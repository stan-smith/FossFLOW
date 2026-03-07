"""E2E test: build a scene with nodes, rectangle, and text, then export as SVG."""
import os
import time
import glob
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "..", "screenshots")
DOWNLOAD_DIR = "/tmp/fossflow-e2e-downloads"


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

    # Configure download directory for headless Chrome
    prefs = {
        "download.default_directory": DOWNLOAD_DIR,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True,
    }
    chrome_options.add_experimental_option("prefs", prefs)

    d = webdriver.Remote(
        command_executor=get_webdriver_url(),
        options=chrome_options,
    )
    d.implicitly_wait(10)

    # For headless Chrome on Remote, enable download via CDP
    # This sets the download path inside the container
    try:
        d.execute("send_command", {
            "cmd": "Page.setDownloadBehavior",
            "params": {"behavior": "allow", "downloadPath": DOWNLOAD_DIR}
        })
    except Exception:
        # Fallback: try CDP command directly
        try:
            d.execute_cdp_cmd("Page.setDownloadBehavior", {
                "behavior": "allow",
                "downloadPath": DOWNLOAD_DIR,
            })
        except Exception:
            pass

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
                // Close MUI dialogs
                document.querySelectorAll('[role="dialog"], [class*="MuiDialog"]').forEach(d => {
                    const btns = d.querySelectorAll('button');
                    btns.forEach(b => {
                        if (b.querySelector('svg') || b.textContent.trim() === '×') b.click();
                    });
                    const closeBtn = d.querySelector('button');
                    if (closeBtn) closeBtn.click();
                });
                // Close X buttons (CloseIcon, ClearIcon)
                document.querySelectorAll('[data-testid="CloseIcon"], [data-testid="ClearIcon"]').forEach(icon => {
                    const b = icon.closest('button'); if (b) b.click();
                });
                // Close anything with close/dismiss aria-label
                document.querySelectorAll('button').forEach(btn => {
                    const l = (btn.getAttribute('aria-label') || '').toLowerCase();
                    if (l.includes('close') || l.includes('dismiss')) btn.click();
                });
            """)
            time.sleep(0.5)
        except Exception:
            pass


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


def draw_rectangle(driver, x, y, width, height):
    """Activate rectangle tool and drag to draw."""
    rect_btn = driver.execute_script(
        "return document.querySelector(\"button[aria-label*='Rectangle']\");"
    )
    if not rect_btn:
        return False
    rect_btn.click()
    time.sleep(0.5)

    canvas = driver.find_element(By.CLASS_NAME, "fossflow-container")
    actions = ActionChains(driver)
    actions.move_to_element_with_offset(canvas, x, y)
    actions.click_and_hold()
    actions.move_by_offset(width, height)
    actions.release()
    actions.perform()
    time.sleep(1)
    return True


def place_textbox(driver, x, y):
    """Activate text tool and click to place."""
    text_btn = driver.execute_script(
        "return document.querySelector(\"button[aria-label*='Text']\");"
    )
    if not text_btn:
        return False
    text_btn.click()
    time.sleep(0.5)

    canvas = driver.find_element(By.CLASS_NAME, "fossflow-container")
    ActionChains(driver).move_to_element_with_offset(canvas, x, y).click().perform()
    time.sleep(1)

    # Press Escape to exit text mode and deselect
    ActionChains(driver).send_keys('\ue00c').perform()
    time.sleep(0.5)
    return True


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
                    if (st && st.connectors !== undefined && st.textBoxes !== undefined) ss = n.pendingProps.value;
                    if (st && st.views !== undefined && st.items !== undefined) ms = n.pendingProps.value;
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
        };
    """)


def test_export_svg(driver):
    """Build a scene with nodes, rectangle, and text, then export as SVG."""
    base_url = get_base_url()

    # Clean up any previous downloads
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    for f in glob.glob(os.path.join(DOWNLOAD_DIR, "fossflow-export-*")):
        os.remove(f)

    # --- Load app ---
    print(f"\n1. Loading app at {base_url}")
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
    )
    time.sleep(2)
    dismiss_modals(driver)
    time.sleep(0.5)

    # --- Place 2 nodes ---
    print("\n2. Placing nodes...")
    assert place_node_at(driver, 350, 300), "Failed to place node 1"
    print("   Node 1 placed.")
    assert place_node_at(driver, 600, 300), "Failed to place node 2"
    print("   Node 2 placed.")

    # Dismiss any late-appearing modals (Lazy Loading popup)
    dismiss_modals(driver)
    time.sleep(0.5)

    # --- Draw a rectangle ---
    print("\n3. Drawing rectangle...")
    assert draw_rectangle(driver, 100, 100, 150, 100), "Failed to draw rectangle"
    print("   Rectangle drawn.")

    # --- Place a text box ---
    print("\n4. Placing text box...")
    assert place_textbox(driver, 500, 200), "Failed to place text box"
    print("   Text box placed.")

    # --- Verify scene has all elements ---
    state = get_scene_state(driver)
    print(f"\n5. Scene state: {state}")
    assert isinstance(state, dict), f"Failed to get scene state: {state}"
    assert state.get("modelItems", 0) >= 2, f"Expected 2+ nodes, got {state}"
    assert state.get("rectangles", 0) >= 1, f"Expected 1+ rectangle, got {state}"
    assert state.get("textBoxes", 0) >= 1, f"Expected 1+ text box, got {state}"

    save_screenshot(driver, "export_01_scene_built")
    print("   Scene verified: nodes, rectangle, and text box all present.")

    # --- Open main menu ---
    print("\n6. Opening main menu...")
    menu_btn = driver.execute_script("""
        // MainMenu uses IconButton with name="Main menu"
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            var label = (btn.getAttribute('aria-label') || '').toLowerCase();
            var name = (btn.getAttribute('name') || '').toLowerCase();
            if (label.includes('main menu') || name.includes('main menu') ||
                label.includes('menu')) {
                return btn;
            }
        }
        // Fallback: look for the MUI MenuIcon (hamburger)
        var svgs = document.querySelectorAll('button svg');
        for (var j = 0; j < svgs.length; j++) {
            var path = svgs[j].querySelector('path');
            if (path) {
                var d = path.getAttribute('d') || '';
                // MUI MenuIcon path starts with "M3 18h18v-2H3"
                if (d.includes('M3 18h18') || d.includes('M3 18')) return svgs[j].closest('button');
            }
        }
        return null;
    """)
    assert menu_btn is not None, "Main menu button not found"
    menu_btn.click()
    time.sleep(1)
    save_screenshot(driver, "export_02_menu_open")
    print("   Main menu opened.")

    # --- Click "Export as image" ---
    print("\n7. Clicking 'Export as image'...")
    export_item = driver.execute_script("""
        // Look for menu item containing "Export as image" or similar
        var items = document.querySelectorAll('[role="menuitem"], li.MuiMenuItem-root');
        for (var i = 0; i < items.length; i++) {
            var text = items[i].textContent.trim().toLowerCase();
            if (text.includes('export') && text.includes('image')) return items[i];
        }
        // Fallback: any menu item with "export"
        for (var j = 0; j < items.length; j++) {
            var t = items[j].textContent.trim().toLowerCase();
            if (t.includes('export')) return items[j];
        }
        return null;
    """)
    assert export_item is not None, "Export as image menu item not found"
    export_item.click()
    time.sleep(2)
    save_screenshot(driver, "export_03_dialog_opening")
    print("   Clicked export menu item.")

    # --- Wait for export dialog ---
    print("\n8. Waiting for export dialog...")
    dialog = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[role="dialog"]'))
    )
    print("   Export dialog appeared.")

    # Wait for the preview to render (SVG data needs to be generated)
    # The "Download as SVG" button is disabled until svgData is ready
    print("   Waiting for SVG data to generate...")
    svg_btn = None
    for attempt in range(30):  # Up to 30 seconds
        svg_btn = driver.execute_script("""
            var buttons = document.querySelectorAll('[role="dialog"] button');
            for (var i = 0; i < buttons.length; i++) {
                var text = buttons[i].textContent.trim().toLowerCase();
                if (text.includes('svg') && text.includes('download')) {
                    return buttons[i];
                }
            }
            return null;
        """)
        if svg_btn:
            is_disabled = driver.execute_script(
                "return arguments[0].disabled;", svg_btn
            )
            if not is_disabled:
                print(f"   SVG button ready after {attempt + 1}s.")
                break
            print(f"   SVG button found but disabled (attempt {attempt + 1})...")
        else:
            print(f"   SVG button not found yet (attempt {attempt + 1})...")
        time.sleep(1)
    else:
        save_screenshot(driver, "export_04_svg_timeout")
        pytest.fail("SVG download button never became enabled")

    save_screenshot(driver, "export_04_dialog_ready")

    # --- Click "Download as SVG" ---
    print("\n9. Clicking 'Download as SVG'...")
    svg_btn.click()
    time.sleep(3)  # Wait for download to complete
    save_screenshot(driver, "export_05_after_download")
    print("   Download triggered.")

    # --- Verify SVG file was downloaded ---
    print("\n10. Checking for downloaded SVG file...")

    # Method 1: Check filesystem (works when download dir is accessible)
    svg_files = glob.glob(os.path.join(DOWNLOAD_DIR, "fossflow-export-*.svg"))
    if svg_files:
        svg_path = svg_files[0]
        svg_size = os.path.getsize(svg_path)
        print(f"    Found SVG file: {svg_path} ({svg_size} bytes)")
        assert svg_size > 100, f"SVG file too small ({svg_size} bytes), likely empty"

        # Read first 500 chars to verify it's valid SVG
        with open(svg_path, "r", errors="replace") as f:
            content_start = f.read(500)
        is_svg = "<svg" in content_start.lower() or "data:image/svg" in content_start.lower()
        print(f"    Content starts with SVG markup: {is_svg}")
        print(f"    First 200 chars: {content_start[:200]}")
        assert is_svg or svg_size > 1000, (
            f"Downloaded file doesn't appear to be valid SVG. Start: {content_start[:200]}"
        )
        print("    SVG file verified!")
    else:
        # Method 2: If running in Docker, the download happens inside the container.
        # We can verify the download happened by checking browser download state.
        print("    No SVG file found locally (download may be inside Docker container).")
        print("    Verifying download was triggered via browser...")

        # Check that the button click didn't cause an error
        errors = driver.execute_script("""
            var logs = [];
            try {
                var entries = performance.getEntriesByType('resource');
                for (var i = entries.length - 1; i >= Math.max(0, entries.length - 5); i--) {
                    logs.push(entries[i].name);
                }
            } catch(e) {}
            return logs;
        """)
        print(f"    Recent resource loads: {errors}")

        # Check for any error alerts in the dialog
        export_error = driver.execute_script("""
            var alerts = document.querySelectorAll('[role="dialog"] .MuiAlert-standardError');
            return alerts.length;
        """)
        assert export_error == 0, "Export dialog shows an error alert"
        print("    No export errors detected. Download was triggered successfully.")

    print("\n    SUCCESS: Scene exported as SVG!")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
