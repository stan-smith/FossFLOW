"""E2E test: place two nodes, connect them, then undo/redo the connector."""
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
    """Dismiss all modals, dialogs, and tip popups."""
    try:
        driver.execute_script("""
            // Close MUI dialogs
            const dialogs = document.querySelectorAll('[role="dialog"], [class*="MuiDialog"]');
            dialogs.forEach(d => {
                const closeBtn = d.querySelector('button');
                if (closeBtn) closeBtn.click();
            });
            // Close tip popups (X buttons)
            const closeIcons = document.querySelectorAll('[data-testid="CloseIcon"], [data-testid="ClearIcon"]');
            closeIcons.forEach(icon => {
                const btn = icon.closest('button');
                if (btn) btn.click();
            });
            // Close anything with a close/dismiss aria-label
            document.querySelectorAll('button').forEach(btn => {
                const label = (btn.getAttribute('aria-label') || '').toLowerCase();
                if (label.includes('close') || label.includes('dismiss')) btn.click();
            });
        """)
        time.sleep(0.5)
        # Second pass to catch the lazy loading modal that may appear later
        driver.execute_script("""
            const dialogs = document.querySelectorAll('[role="dialog"], [class*="MuiDialog"]');
            dialogs.forEach(d => {
                const btns = d.querySelectorAll('button');
                btns.forEach(b => { if (b.textContent.trim() === '×' || b.querySelector('svg')) b.click(); });
            });
        """)
        time.sleep(0.3)
    except Exception:
        pass


def count_canvas_images(driver):
    return driver.execute_script("""
        const c = document.querySelector('.fossflow-container');
        if (!c) return 0;
        return c.querySelectorAll('img').length;
    """)


def count_connector_polylines(driver):
    """Count SVG polylines inside the fossflow container (connector paths)."""
    return driver.execute_script("""
        const c = document.querySelector('.fossflow-container');
        if (!c) return 0;
        return c.querySelectorAll('svg polyline').length;
    """)


def get_scene_state(driver):
    """Get scene connector count via React fiber store discovery."""
    return driver.execute_script("""
        // Walk React fiber tree to find the scene store
        var root = document.getElementById("root");
        var containerKey = Object.keys(root).find(function(k) {
            return k.startsWith("__reactContainer");
        });
        if (!containerKey) return {error: "no react container"};

        var fiber = root[containerKey];
        var queue = [fiber];
        var visited = 0;
        var sceneStore = null;
        var modelStore = null;

        while (queue.length > 0 && visited < 3000) {
            var node = queue.shift();
            if (!node) continue;
            visited++;

            if (node.pendingProps && node.pendingProps.value &&
                typeof node.pendingProps.value === "object" &&
                node.pendingProps.value !== null &&
                typeof node.pendingProps.value.getState === "function") {
                try {
                    var state = node.pendingProps.value.getState();
                    if (state && state.connectors !== undefined && state.textBoxes !== undefined && state.history) {
                        sceneStore = node.pendingProps.value;
                    }
                    if (state && state.views !== undefined && state.items !== undefined && state.history) {
                        modelStore = node.pendingProps.value;
                    }
                } catch(e) {}
            }
            if (node.child) queue.push(node.child);
            if (node.sibling) queue.push(node.sibling);
        }

        if (!sceneStore || !modelStore) return {error: "stores not found", visited: visited};

        var s = sceneStore.getState();
        var m = modelStore.getState();
        var cv = m.views && m.views[0];
        return {
            connectors: Object.keys(s.connectors || {}).length,
            modelItems: (m.items || []).length,
            viewConnectors: cv && cv.connectors ? cv.connectors.length : 0,
            scenePastLen: s.history.past.length,
            sceneFutureLen: s.history.future.length,
            modelPastLen: m.history.past.length,
            modelFutureLen: m.history.future.length,
        };
    """)


def place_node_at(driver, x_offset, y_offset):
    """Select icon and place at a specific canvas offset."""
    add_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label*='Add item']")
    add_btn.click()
    time.sleep(0.8)

    driver.execute_script("""
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const text = btn.textContent.trim().toUpperCase();
            if (text.includes('ISOFLOW') && !text.includes('IMPORT')) {
                btn.click(); return;
            }
        }
    """)
    time.sleep(2)

    first_icon_btn = driver.execute_script("""
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const img = btn.querySelector('img');
            if (img && img.naturalWidth > 0 && img.naturalWidth <= 100) return btn;
        }
        for (const btn of buttons) {
            const img = btn.querySelector('img');
            if (img) return btn;
        }
        return null;
    """)
    if first_icon_btn is None:
        return False

    ActionChains(driver).click(first_icon_btn).perform()
    time.sleep(0.5)

    canvas = driver.find_element(By.CLASS_NAME, "fossflow-container")
    ActionChains(driver).move_to_element_with_offset(canvas, x_offset, y_offset).click().perform()
    time.sleep(1)
    return True


def click_connector_tool(driver):
    """Click the Connector tool button in the toolbar."""
    btn = driver.execute_script("""
        return document.querySelector("button[aria-label*='Connector']");
    """)
    if btn:
        btn.click()
        time.sleep(0.5)
        return True
    return False


def click_undo(driver):
    btn = driver.execute_script("""
        return document.querySelector("button[aria-label*='Undo']");
    """)
    if btn:
        btn.click()
        time.sleep(1)
        return True
    return False


def click_redo(driver):
    btn = driver.execute_script("""
        return document.querySelector("button[aria-label*='Redo']");
    """)
    if btn:
        btn.click()
        time.sleep(1)
        return True
    return False


def test_connector_undo_redo(driver):
    """Place 2 nodes, connect them, undo connector, redo connector."""
    base_url = get_base_url()

    # --- Load app ---
    print(f"\n1. Loading app at {base_url}")
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
    )
    time.sleep(2)
    dismiss_modals(driver)
    time.sleep(0.5)

    # --- Place two nodes ---
    print("\n2. Placing node 1 at (350, 300)...")
    assert place_node_at(driver, 350, 300), "Failed to place node 1"
    imgs = count_canvas_images(driver)
    print(f"   Images: {imgs}")

    print("   Placing node 2 at (600, 300)...")
    assert place_node_at(driver, 600, 300), "Failed to place node 2"
    imgs = count_canvas_images(driver)
    print(f"   Images: {imgs}")
    assert imgs == 2, f"Expected 2 images after placing 2 nodes, got {imgs}"
    save_screenshot(driver, "conn_01_two_nodes")

    polylines_before = count_connector_polylines(driver)
    state_before = get_scene_state(driver)
    print(f"   Polylines before connector: {polylines_before}")
    print(f"   Scene state: {state_before}")

    # Dismiss any late-appearing modals (Lazy Loading popup)
    dismiss_modals(driver)
    time.sleep(0.5)
    save_screenshot(driver, "conn_01b_before_connect")

    # --- Get node image elements for clicking ---
    node_imgs = driver.find_elements(By.CSS_SELECTOR, ".fossflow-container img")
    print(f"   Found {len(node_imgs)} node images")
    assert len(node_imgs) >= 2, f"Expected 2+ node images, got {len(node_imgs)}"

    # --- Activate connector tool (click mode) ---
    print("\n3. Activating Connector tool...")
    assert click_connector_tool(driver), "Failed to find Connector button"
    time.sleep(0.5)

    # --- Click on node 1 image (first click - start connector) ---
    print("   Clicking on node 1 to start connector...")
    ActionChains(driver).click(node_imgs[0]).perform()
    time.sleep(1)
    save_screenshot(driver, "conn_02_first_click")

    # --- Click on node 2 image (second click - complete connector) ---
    print("   Clicking on node 2 to complete connector...")
    ActionChains(driver).click(node_imgs[1]).perform()
    time.sleep(1)
    save_screenshot(driver, "conn_03_connected")

    polylines_after = count_connector_polylines(driver)
    state_after = get_scene_state(driver)
    print(f"   Polylines after connector: {polylines_after}")
    print(f"   Scene state: {state_after}")

    # Verify connector was created
    has_connector = polylines_after > polylines_before
    scene_has_connector = (
        isinstance(state_after, dict) and
        state_after.get("connectors", 0) > 0
    )
    print(f"   DOM has connector: {has_connector}")
    print(f"   Scene store has connector: {scene_has_connector}")

    assert has_connector or scene_has_connector, (
        f"No connector created. Polylines: {polylines_before} -> {polylines_after}, "
        f"Scene state: {state_after}"
    )

    connector_polylines = polylines_after

    # --- Switch back to default mode (press Escape) ---
    print("\n4. Pressing Escape to exit connector mode...")
    ActionChains(driver).send_keys('\ue00c').perform()  # Escape
    time.sleep(0.5)

    # --- Undo connector (create + update = 2 history entries) ---
    print("\n5. Undoing connector (2 steps: update then create)...")
    click_undo(driver)
    polylines_mid = count_connector_polylines(driver)
    state_mid = get_scene_state(driver)
    print(f"   After undo 1: polylines={polylines_mid}, scene={state_mid}")

    click_undo(driver)
    polylines_undo = count_connector_polylines(driver)
    state_undo = get_scene_state(driver)
    print(f"   After undo 2: polylines={polylines_undo}, scene={state_undo}")
    save_screenshot(driver, "conn_04_after_undo")

    assert polylines_undo < connector_polylines or (
        isinstance(state_undo, dict) and state_undo.get("connectors", 0) == 0
    ), (
        f"Undo did not remove connector. Polylines: {connector_polylines} -> {polylines_undo}, "
        f"Scene state: {state_undo}"
    )
    print("   Connector removed by undo.")

    # Verify nodes are still there
    imgs_after_undo = count_canvas_images(driver)
    print(f"   Images after undo: {imgs_after_undo} (nodes should still be there)")
    assert imgs_after_undo == 2, f"Expected 2 images after undoing connector, got {imgs_after_undo}"

    # --- Redo connector (2 steps: create then update) ---
    print("\n6. Redoing connector (2 steps)...")
    click_redo(driver)
    click_redo(driver)
    time.sleep(0.5)

    polylines_redo = count_connector_polylines(driver)
    state_redo = get_scene_state(driver)
    print(f"   Polylines after redo: {polylines_redo}")
    print(f"   Scene state: {state_redo}")
    save_screenshot(driver, "conn_05_after_redo")

    assert polylines_redo >= connector_polylines or (
        isinstance(state_redo, dict) and state_redo.get("connectors", 0) > 0
    ), (
        f"Redo did not restore connector. Polylines: {polylines_undo} -> {polylines_redo}, "
        f"Scene state: {state_redo}"
    )
    print("   Connector restored by redo.")

    # --- Undo/redo cycle again ---
    print("\n7. Undoing connector again (2 steps)...")
    click_undo(driver)
    click_undo(driver)
    time.sleep(0.5)

    polylines_undo2 = count_connector_polylines(driver)
    state_undo2 = get_scene_state(driver)
    print(f"   Polylines: {polylines_undo2}, connectors: {state_undo2.get('connectors', '?')}")
    assert polylines_undo2 < connector_polylines or (
        isinstance(state_undo2, dict) and state_undo2.get("connectors", 0) == 0
    ), "Second undo cycle did not remove connector"
    print("   Connector removed again.")

    print("   Redoing connector again (2 steps)...")
    click_redo(driver)
    click_redo(driver)
    time.sleep(0.5)

    polylines_redo2 = count_connector_polylines(driver)
    state_redo2 = get_scene_state(driver)
    print(f"   Polylines: {polylines_redo2}, connectors: {state_redo2.get('connectors', '?')}")
    assert polylines_redo2 >= connector_polylines or (
        isinstance(state_redo2, dict) and state_redo2.get("connectors", 0) > 0
    ), "Second redo cycle did not restore connector"

    save_screenshot(driver, "conn_06_final")
    print("\n   SUCCESS: Connector undo/redo cycle works correctly!")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
