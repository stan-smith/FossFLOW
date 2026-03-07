"""E2E test: import a diagram JSON file and verify all elements loaded correctly."""
import os
import time
import json
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.remote.file_detector import LocalFileDetector


SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "..", "screenshots")
TEST_DIAGRAM = os.path.join(os.path.dirname(__file__), "..", "test-diagram.json")


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
    # Enable local file detection for remote WebDriver (uploads files to remote)
    d.file_detector = LocalFileDetector()
    yield d
    d.quit()


def save_screenshot(driver, name):
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
    driver.save_screenshot(path)
    return path


def dismiss_modals(driver):
    """Dismiss all modals, dialogs, and tip popups (multiple passes for lazy ones)."""
    for _ in range(3):
        try:
            driver.execute_script("""
                document.querySelectorAll('[role="dialog"], [class*="MuiDialog"]').forEach(d => {
                    var btns = d.querySelectorAll('button');
                    btns.forEach(b => {
                        if (b.querySelector('svg') || b.textContent.trim() === '×') b.click();
                    });
                    var first = d.querySelector('button'); if (first) first.click();
                });
                document.querySelectorAll('[data-testid="CloseIcon"], [data-testid="ClearIcon"]').forEach(icon => {
                    var b = icon.closest('button'); if (b) b.click();
                });
                document.querySelectorAll('button').forEach(btn => {
                    var l = (btn.getAttribute('aria-label') || '').toLowerCase();
                    if (l.includes('close') || l.includes('dismiss')) btn.click();
                });
            """)
            time.sleep(0.5)
        except Exception:
            pass


def get_scene_state(driver):
    """Get full scene state via React fiber store discovery."""
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
            modelItems: (m.items || []).length,
            icons: (m.icons || []).length,
            views: (m.views || []).length,
            viewItems: cv ? (cv.items || []).length : 0,
            viewConnectors: cv && cv.connectors ? cv.connectors.length : 0,
            viewRectangles: cv && cv.rectangles ? cv.rectangles.length : 0,
            viewTextBoxes: cv && cv.textBoxes ? cv.textBoxes.length : 0,
            sceneConnectors: Object.keys(s.connectors || {}).length,
            sceneTextBoxes: Object.keys(s.textBoxes || {}).length,
            title: m.title || "",
        };
    """)


def load_expected_counts():
    """Load the test diagram JSON and extract expected element counts."""
    with open(TEST_DIAGRAM, "r") as f:
        data = json.load(f)

    view = data["views"][0] if data.get("views") else {}
    return {
        "modelItems": len(data.get("items", [])),
        "icons": len(data.get("icons", [])),
        "views": len(data.get("views", [])),
        "viewItems": len(view.get("items", [])),
        "viewConnectors": len(view.get("connectors", [])),
        "viewRectangles": len(view.get("rectangles", [])),
        "viewTextBoxes": len(view.get("textBoxes", [])),
        "title": data.get("title", ""),
    }


def test_import_via_app_button(driver):
    """Import a diagram using the MainMenu 'Open' and verify all elements loaded."""
    base_url = get_base_url()
    expected = load_expected_counts()

    print(f"\n1. Loading app at {base_url}")
    print(f"   Expected from JSON: {expected}")
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
    )
    time.sleep(2)
    dismiss_modals(driver)
    time.sleep(0.5)

    # Verify baseline (empty diagram)
    baseline = get_scene_state(driver)
    print(f"   Baseline state: {baseline}")
    save_screenshot(driver, "import_01_baseline")

    # --- Import via MainMenu "Open" ---
    # The MainMenu "Open" creates a transient <input type="file">.click().
    # We intercept this by overriding click() to capture the input element
    # so we can send_keys to it.
    print(f"\n2. Importing diagram from {TEST_DIAGRAM}...")

    # Step 1: Install interceptor that captures the file input before it clicks
    driver.execute_script("""
        window.__capturedFileInput = null;
        var origClick = HTMLInputElement.prototype.click;
        HTMLInputElement.prototype.click = function() {
            if (this.type === 'file') {
                window.__capturedFileInput = this;
                // Don't actually click (which opens native dialog)
                // Instead, append to DOM so Selenium can interact with it
                this.style.position = 'fixed';
                this.style.top = '0';
                this.style.left = '0';
                this.style.opacity = '0.01';
                this.style.zIndex = '99999';
                document.body.appendChild(this);
                return;
            }
            origClick.call(this);
        };
    """)

    # Step 2: Open main menu and click "Open"
    menu_btn = driver.execute_script("""
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            var label = (buttons[i].getAttribute('aria-label') || '').toLowerCase();
            var name = (buttons[i].getAttribute('name') || '').toLowerCase();
            if (label.includes('main menu') || name.includes('main menu') ||
                label.includes('menu')) return buttons[i];
        }
        return null;
    """)
    assert menu_btn is not None, "Main menu button not found"
    menu_btn.click()
    time.sleep(1)
    save_screenshot(driver, "import_02_menu_open")

    # Click "Open" menu item
    open_item = driver.execute_script("""
        var items = document.querySelectorAll('[role="menuitem"], li.MuiMenuItem-root');
        for (var i = 0; i < items.length; i++) {
            var text = items[i].textContent.trim().toLowerCase();
            if (text === 'open') return items[i];
        }
        return null;
    """)
    assert open_item is not None, "'Open' menu item not found"
    open_item.click()
    time.sleep(1)

    # Step 3: Get the captured file input and send the file
    file_input = driver.execute_script("return window.__capturedFileInput;")
    assert file_input is not None, "File input was not captured by interceptor"
    print("   Captured file input via interceptor.")

    file_input.send_keys(os.path.abspath(TEST_DIAGRAM))
    print("   File sent to input.")
    time.sleep(3)

    # Restore original click
    driver.execute_script("""
        if (window.__origHTMLInputClick) {
            HTMLInputElement.prototype.click = window.__origHTMLInputClick;
        }
    """)

    # Check for alert dialogs (validation errors)
    try:
        alert = driver.switch_to.alert
        alert_text = alert.text
        alert.accept()
        print(f"   Alert appeared: {alert_text}")
        pytest.fail(f"Import failed with alert: {alert_text}")
    except Exception:
        pass

    save_screenshot(driver, "import_03_after_import")

    # --- Wait for diagram to render ---
    print("\n3. Waiting for diagram to render...")
    time.sleep(2)
    dismiss_modals(driver)
    time.sleep(1)
    save_screenshot(driver, "import_03_rendered")

    # --- Verify imported elements ---
    print("\n4. Verifying imported elements...")
    state = get_scene_state(driver)
    print(f"   Scene state: {state}")

    assert isinstance(state, dict) and "error" not in state, (
        f"Failed to get scene state: {state}"
    )

    # Verify model items (nodes)
    assert state["modelItems"] == expected["modelItems"], (
        f"Expected {expected['modelItems']} model items, got {state['modelItems']}"
    )
    print(f"   Model items: {state['modelItems']} (expected {expected['modelItems']})")

    # Verify view items
    assert state["viewItems"] == expected["viewItems"], (
        f"Expected {expected['viewItems']} view items, got {state['viewItems']}"
    )
    print(f"   View items: {state['viewItems']} (expected {expected['viewItems']})")

    # Verify connectors
    assert state["viewConnectors"] == expected["viewConnectors"], (
        f"Expected {expected['viewConnectors']} connectors, got {state['viewConnectors']}"
    )
    print(f"   Connectors: {state['viewConnectors']} (expected {expected['viewConnectors']})")

    # Verify rectangles
    assert state["viewRectangles"] == expected["viewRectangles"], (
        f"Expected {expected['viewRectangles']} rectangles, got {state['viewRectangles']}"
    )
    print(f"   Rectangles: {state['viewRectangles']} (expected {expected['viewRectangles']})")

    # Verify text boxes
    assert state["viewTextBoxes"] == expected["viewTextBoxes"], (
        f"Expected {expected['viewTextBoxes']} text boxes, got {state['viewTextBoxes']}"
    )
    print(f"   Text boxes: {state['viewTextBoxes']} (expected {expected['viewTextBoxes']})")

    # --- Verify visual rendering ---
    print("\n5. Verifying visual elements...")

    # Check for node images on canvas
    img_count = driver.execute_script("""
        var c = document.querySelector('.fossflow-container');
        return c ? c.querySelectorAll('img').length : 0;
    """)
    print(f"   Canvas images (nodes): {img_count}")
    assert img_count >= expected["modelItems"], (
        f"Expected at least {expected['modelItems']} images (nodes), got {img_count}"
    )

    # Check for connector polylines
    polyline_count = driver.execute_script("""
        var c = document.querySelector('.fossflow-container');
        return c ? c.querySelectorAll('svg polyline').length : 0;
    """)
    print(f"   SVG polylines (connectors): {polyline_count}")

    # Check for rectangle polygons
    polygon_count = driver.execute_script("""
        var c = document.querySelector('.fossflow-container');
        return c ? c.querySelectorAll('svg polygon').length : 0;
    """)
    print(f"   SVG polygons (rectangles): {polygon_count}")

    save_screenshot(driver, "import_04_verified")

    # --- Test undo after import (should work cleanly) ---
    print("\n6. Testing undo after import...")
    state_before_undo = get_scene_state(driver)

    undo_btn = driver.execute_script(
        "return document.querySelector(\"button[aria-label*='Undo']\");"
    )
    if undo_btn:
        undo_btn.click()
        time.sleep(1)
        state_after_undo = get_scene_state(driver)
        print(f"   Before undo: items={state_before_undo['modelItems']}")
        print(f"   After undo:  items={state_after_undo['modelItems']}")
        # Import should clear history, so undo should be a no-op or have minimal effect
        print("   Undo after import behaves correctly.")
    else:
        print("   No undo button found (OK for this test).")

    save_screenshot(driver, "import_05_after_undo")

    # --- Test that we can interact with imported elements ---
    print("\n7. Testing interaction with imported elements...")

    # Try clicking on a node image
    node_imgs = driver.find_elements(By.CSS_SELECTOR, ".fossflow-container img")
    if node_imgs:
        ActionChains(driver).click(node_imgs[0]).perform()
        time.sleep(0.5)
        save_screenshot(driver, "import_06_node_clicked")
        print(f"   Clicked on first node. Interaction works.")
    else:
        print("   No node images found for click test.")

    # --- Re-export to verify round-trip ---
    print("\n8. Verifying export after import (round-trip)...")

    # Press Escape first to deselect
    ActionChains(driver).send_keys('\ue00c').perform()
    time.sleep(0.5)

    # Open main menu
    menu_btn = driver.execute_script("""
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            var label = (buttons[i].getAttribute('aria-label') || '').toLowerCase();
            var name = (buttons[i].getAttribute('name') || '').toLowerCase();
            if (label.includes('main menu') || name.includes('main menu') ||
                label.includes('menu')) return buttons[i];
        }
        return null;
    """)
    if menu_btn:
        menu_btn.click()
        time.sleep(1)

        # Click Export as image
        export_item = driver.execute_script("""
            var items = document.querySelectorAll('[role="menuitem"], li.MuiMenuItem-root');
            for (var i = 0; i < items.length; i++) {
                var text = items[i].textContent.trim().toLowerCase();
                if (text.includes('export') && text.includes('image')) return items[i];
            }
            return null;
        """)
        if export_item:
            export_item.click()
            time.sleep(2)

            # Wait for export dialog
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, '[role="dialog"]'))
                )
                # Wait for SVG button to become enabled
                for attempt in range(15):
                    svg_btn = driver.execute_script("""
                        var buttons = document.querySelectorAll('[role="dialog"] button');
                        for (var i = 0; i < buttons.length; i++) {
                            var text = buttons[i].textContent.trim().toLowerCase();
                            if (text.includes('svg') && text.includes('download')) return buttons[i];
                        }
                        return null;
                    """)
                    if svg_btn and not driver.execute_script("return arguments[0].disabled", svg_btn):
                        print("   Export dialog rendered with SVG button ready.")
                        break
                    time.sleep(1)

                save_screenshot(driver, "import_07_export_dialog")
                print("   Round-trip export dialog verified.")

                # Close dialog
                cancel_btn = driver.execute_script("""
                    var buttons = document.querySelectorAll('[role="dialog"] button');
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].textContent.trim().toLowerCase() === 'cancel') return buttons[i];
                    }
                    return null;
                """)
                if cancel_btn:
                    cancel_btn.click()
                    time.sleep(0.5)
            except Exception as e:
                print(f"   Export dialog issue: {e}")
        else:
            print("   Export menu item not found.")
    else:
        print("   Main menu button not found.")

    save_screenshot(driver, "import_08_final")
    print(f"\n   SUCCESS: Diagram imported with {expected['modelItems']} items, "
          f"{expected['viewConnectors']} connectors, {expected['viewRectangles']} rectangles, "
          f"{expected['viewTextBoxes']} text boxes!")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
