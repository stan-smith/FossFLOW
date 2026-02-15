"""E2E tests: rectangle and text box creation with undo/redo."""
import os
import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "..", "screenshots")


def get_base_url():
    return os.getenv("FOSSFLOW_TEST_URL", "http://localhost:3000")


def get_webdriver_url():
    return os.getenv("WEBDRIVER_URL", "http://localhost:4444")


@pytest.fixture(scope="function")
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    d = webdriver.Remote(
        command_executor=get_webdriver_url(),
        options=chrome_options,
    )
    d.implicitly_wait(10)
    yield d
    d.quit()


def save_screenshot(driver, name):
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
    driver.save_screenshot(path)
    return path


def dismiss_modals(driver):
    try:
        driver.execute_script("""
            document.querySelectorAll('[role="dialog"], [class*="MuiDialog"]').forEach(d => {
                const b = d.querySelector('button'); if (b) b.click();
            });
            document.querySelectorAll('[data-testid="CloseIcon"], [data-testid="ClearIcon"]').forEach(icon => {
                const b = icon.closest('button'); if (b) b.click();
            });
            document.querySelectorAll('button').forEach(btn => {
                const l = (btn.getAttribute('aria-label') || '').toLowerCase();
                if (l.includes('close') || l.includes('dismiss')) btn.click();
            });
        """)
        time.sleep(0.5)
    except Exception:
        pass


def get_scene_state(driver):
    """Get scene state via React fiber store discovery."""
    return driver.execute_script("""
        var root = document.getElementById("root");
        var ck = Object.keys(root).find(function(k) { return k.startsWith("__reactContainer"); });
        if (!ck) return {error: "no react"};
        var fiber = root[ck], queue = [fiber], v = 0, ss = null, ms = null;
        while (queue.length > 0 && v < 3000) {
            var n = queue.shift(); if (!n) continue; v++;
            if (n.pendingProps && n.pendingProps.value &&
                typeof n.pendingProps.value === "object" && n.pendingProps.value !== null &&
                typeof n.pendingProps.value.getState === "function") {
                try {
                    var st = n.pendingProps.value.getState();
                    if (st && st.connectors !== undefined && st.textBoxes !== undefined && st.history) ss = n.pendingProps.value;
                    if (st && st.views !== undefined && st.items !== undefined && st.history) ms = n.pendingProps.value;
                } catch(e) {}
            }
            if (n.child) queue.push(n.child);
            if (n.sibling) queue.push(n.sibling);
        }
        if (!ss || !ms) return {error: "stores not found"};
        var s = ss.getState(), m = ms.getState();
        var cv = m.views && m.views[0];
        return {
            rectangles: cv && cv.rectangles ? cv.rectangles.length : 0,
            textBoxes: Object.keys(s.textBoxes || {}).length,
            connectors: Object.keys(s.connectors || {}).length,
            modelItems: (m.items || []).length,
            scenePast: s.history.past.length,
            sceneFuture: s.history.future.length,
            modelPast: m.history.past.length,
            modelFuture: m.history.future.length,
        };
    """)


def count_svg_polygons(driver):
    """Count SVG polygon/path elements that represent rectangles."""
    return driver.execute_script("""
        var c = document.querySelector('.fossflow-container');
        if (!c) return 0;
        // Rectangles render as SVG with polygon elements inside IsoTileArea
        return c.querySelectorAll('svg polygon').length;
    """)


def count_text_elements(driver):
    """Count Typography/text elements from TextBox components.
    TextBox renders a <p> with MuiTypography class containing textbox content.
    Default content is 'Text' from TEXTBOX_DEFAULTS.
    """
    return driver.execute_script("""
        var c = document.querySelector('.fossflow-container');
        if (!c) return 0;
        var all = c.querySelectorAll('p.MuiTypography-root, span.MuiTypography-root');
        // Filter to actual textbox content (not UI labels like 'Untitled')
        var count = 0;
        for (var i = 0; i < all.length; i++) {
            var t = all[i].textContent.trim();
            if (t === 'Text' || t === 'text' || t.length > 0) {
                // Check it's inside a positioned container (textbox, not toolbar)
                var parent = all[i].closest('[style*="position"]');
                if (parent) count++;
            }
        }
        return count;
    """)


def click_undo(driver):
    btn = driver.execute_script("return document.querySelector(\"button[aria-label*='Undo']\");")
    if btn:
        btn.click()
        time.sleep(1)
        return True
    return False


def click_redo(driver):
    btn = driver.execute_script("return document.querySelector(\"button[aria-label*='Redo']\");")
    if btn:
        btn.click()
        time.sleep(1)
        return True
    return False


# ---------------------------------------------------------------------------
# Rectangle test
# ---------------------------------------------------------------------------

def test_rectangle_undo_redo(driver):
    """Draw a rectangle by drag, undo to remove it, redo to restore."""
    base_url = get_base_url()

    print(f"\n1. Loading app at {base_url}")
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
    )
    time.sleep(2)
    dismiss_modals(driver)
    time.sleep(0.5)

    state_before = get_scene_state(driver)
    polygons_before = count_svg_polygons(driver)
    print(f"   Baseline: polygons={polygons_before}, state={state_before}")
    save_screenshot(driver, "rect_01_baseline")

    # --- Click Rectangle tool ---
    print("\n2. Activating Rectangle tool...")
    rect_btn = driver.execute_script(
        "return document.querySelector(\"button[aria-label*='Rectangle']\");"
    )
    assert rect_btn, "Rectangle button not found"
    rect_btn.click()
    time.sleep(0.5)

    # --- Draw rectangle: mousedown, drag, mouseup ---
    print("   Drawing rectangle by drag...")
    canvas = driver.find_element(By.CLASS_NAME, "fossflow-container")
    actions = ActionChains(driver)
    actions.move_to_element_with_offset(canvas, 400, 250)
    actions.click_and_hold()
    actions.move_by_offset(200, 150)
    actions.release()
    actions.perform()
    time.sleep(1)
    save_screenshot(driver, "rect_02_drawn")

    state_after = get_scene_state(driver)
    polygons_after = count_svg_polygons(driver)
    print(f"   After draw: polygons={polygons_after}, state={state_after}")

    assert isinstance(state_after, dict) and state_after.get("rectangles", 0) > 0, (
        f"No rectangle in store after drawing. State: {state_after}"
    )
    rect_polygons = polygons_after
    print(f"   Rectangle created. Store has {state_after['rectangles']} rectangle(s).")

    # --- Undo rectangle ---
    print("\n3. Undoing rectangle...")
    # Rectangle draw creates 1 history entry (createRectangle) + potentially
    # updateRectangle calls during drag. Undo until rectangles are 0.
    max_undos = 5
    for i in range(max_undos):
        click_undo(driver)
        state_undo = get_scene_state(driver)
        if isinstance(state_undo, dict) and state_undo.get("rectangles", 0) == 0:
            print(f"   Rectangle removed after {i+1} undo(s). State: {state_undo}")
            break
    else:
        state_undo = get_scene_state(driver)
        pytest.fail(f"Rectangle still present after {max_undos} undos. State: {state_undo}")

    polygons_undo = count_svg_polygons(driver)
    save_screenshot(driver, "rect_03_after_undo")
    print(f"   Polygons after undo: {polygons_undo}")

    # --- Redo rectangle ---
    print("\n4. Redoing rectangle...")
    # Redo same number of times as we undid
    redo_count = i + 1
    for j in range(redo_count):
        click_redo(driver)

    state_redo = get_scene_state(driver)
    polygons_redo = count_svg_polygons(driver)
    print(f"   After {redo_count} redo(s): polygons={polygons_redo}, state={state_redo}")
    save_screenshot(driver, "rect_04_after_redo")

    assert isinstance(state_redo, dict) and state_redo.get("rectangles", 0) > 0, (
        f"Redo did not restore rectangle. State: {state_redo}"
    )
    print("   Rectangle restored by redo.")

    # --- Undo again to verify cycle ---
    print("\n5. Undoing rectangle again...")
    for _ in range(redo_count):
        click_undo(driver)

    state_undo2 = get_scene_state(driver)
    assert isinstance(state_undo2, dict) and state_undo2.get("rectangles", 0) == 0, (
        f"Second undo cycle failed. State: {state_undo2}"
    )
    print("   Rectangle removed again.")

    print("\n   Redoing rectangle again...")
    for _ in range(redo_count):
        click_redo(driver)

    state_redo2 = get_scene_state(driver)
    assert isinstance(state_redo2, dict) and state_redo2.get("rectangles", 0) > 0, (
        f"Second redo cycle failed. State: {state_redo2}"
    )

    save_screenshot(driver, "rect_05_final")
    print("\n   SUCCESS: Rectangle undo/redo cycle works!")


# ---------------------------------------------------------------------------
# TextBox test
# ---------------------------------------------------------------------------

def test_textbox_undo_redo(driver):
    """Create a text box, undo to remove it, redo to restore."""
    base_url = get_base_url()

    print(f"\n1. Loading app at {base_url}")
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
    )
    time.sleep(2)
    dismiss_modals(driver)
    time.sleep(0.5)

    state_before = get_scene_state(driver)
    print(f"   Baseline: state={state_before}")
    save_screenshot(driver, "text_01_baseline")

    # --- Click Text tool (creates textbox at mouse position immediately) ---
    print("\n2. Clicking Text tool...")
    text_btn = driver.execute_script(
        "return document.querySelector(\"button[aria-label*='Text']\");"
    )
    assert text_btn, "Text button not found"
    text_btn.click()
    time.sleep(0.5)

    # The textbox is created and follows the cursor in TEXTBOX mode.
    # We need to click on the canvas to place it (mouseup handler).
    print("   Clicking canvas to place text box...")
    canvas = driver.find_element(By.CLASS_NAME, "fossflow-container")
    ActionChains(driver).move_to_element_with_offset(canvas, 500, 350).click().perform()
    time.sleep(1)
    save_screenshot(driver, "text_02_placed")

    state_after = get_scene_state(driver)
    print(f"   After placement: state={state_after}")

    assert isinstance(state_after, dict) and state_after.get("textBoxes", 0) > 0, (
        f"No text box in store after placement. State: {state_after}"
    )
    print(f"   TextBox created. Store has {state_after['textBoxes']} text box(es).")

    # --- Undo text box (may take multiple steps) ---
    print("\n3. Undoing text box...")
    undo_steps = 0
    max_undos = 5
    for i in range(max_undos):
        click_undo(driver)
        undo_steps += 1
        state_undo = get_scene_state(driver)
        print(f"   After undo {i+1}: state={state_undo}")
        if isinstance(state_undo, dict) and state_undo.get("textBoxes", 0) == 0:
            break
    else:
        pytest.fail(f"TextBox still present after {max_undos} undos. State: {state_undo}")

    save_screenshot(driver, "text_03_after_undo")
    print(f"   TextBox removed after {undo_steps} undo(s).")

    # --- Redo text box ---
    print("\n4. Redoing text box...")
    for _ in range(undo_steps):
        click_redo(driver)

    state_redo = get_scene_state(driver)
    print(f"   After {undo_steps} redo(s): state={state_redo}")
    save_screenshot(driver, "text_04_after_redo")

    assert isinstance(state_redo, dict) and state_redo.get("textBoxes", 0) > 0, (
        f"Redo did not restore text box. State: {state_redo}"
    )
    print("   TextBox restored by redo.")

    # --- Second undo/redo cycle ---
    print("\n5. Second undo/redo cycle...")
    for _ in range(undo_steps):
        click_undo(driver)
    state_undo2 = get_scene_state(driver)
    assert isinstance(state_undo2, dict) and state_undo2.get("textBoxes", 0) == 0, (
        f"Second undo failed. State: {state_undo2}"
    )
    print("   TextBox removed again.")

    for _ in range(undo_steps):
        click_redo(driver)
    state_redo2 = get_scene_state(driver)
    assert isinstance(state_redo2, dict) and state_redo2.get("textBoxes", 0) > 0, (
        f"Second redo failed. State: {state_redo2}"
    )

    save_screenshot(driver, "text_05_final")
    print("\n   SUCCESS: TextBox undo/redo cycle works!")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
