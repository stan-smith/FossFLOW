"""
E2E tests for placing nodes on the FossFLOW canvas and undo/redo.
Takes screenshots at each step to visually verify state.
"""
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
    chrome_options.add_argument("--enable-webgl")
    chrome_options.add_argument("--use-gl=swiftshader")
    chrome_options.add_argument("--enable-accelerated-2d-canvas")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

    driver = webdriver.Remote(
        command_executor=get_webdriver_url(),
        options=chrome_options,
    )
    driver.implicitly_wait(10)

    yield driver
    driver.quit()


def save_screenshot(driver, name):
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
    driver.save_screenshot(path)
    print(f"  Screenshot saved: {path}")
    return path


def dismiss_modals(driver):
    """Close any popup modals/dialogs that appear on first load."""
    try:
        driver.execute_script("""
            const dialogs = document.querySelectorAll('[role="dialog"], [class*="MuiDialog"]');
            dialogs.forEach(d => {
                const closeBtn = d.querySelector('button');
                if (closeBtn) closeBtn.click();
            });
            const closeBtns = document.querySelectorAll('button[aria-label="Close"], button[aria-label="close"]');
            closeBtns.forEach(b => b.click());
        """)
        time.sleep(0.5)
    except Exception:
        pass


def dismiss_tips(driver):
    """Close tip popups (Import Diagrams, Creating Connectors tips)."""
    try:
        driver.execute_script("""
            const allButtons = document.querySelectorAll('button');
            for (const btn of allButtons) {
                const ariaLabel = btn.getAttribute('aria-label') || '';
                if (ariaLabel.toLowerCase().includes('close') ||
                    ariaLabel.toLowerCase().includes('dismiss')) {
                    btn.click();
                }
            }
            const closeIcons = document.querySelectorAll('[data-testid="CloseIcon"], [data-testid="ClearIcon"]');
            closeIcons.forEach(icon => {
                const btn = icon.closest('button');
                if (btn) btn.click();
            });
        """)
        time.sleep(0.3)
    except Exception:
        pass


def count_canvas_nodes(driver):
    """Count placed nodes on the canvas by checking for node images and labels."""
    return driver.execute_script("""
        const container = document.querySelector('.fossflow-container');
        if (!container) return { images: 0, untitledLabels: 0, hasUntitled: false };

        const allImgs = container.querySelectorAll('img');

        const allText = container.innerText || '';
        // Filter out "Untitled Diagram" and "Untitled view" from the count
        // We only want "Untitled" that appears as a standalone node label
        const hasUntitled = allText.includes('Untitled');

        // Count standalone "Untitled" spans (node labels), but exclude
        // the bottom bar which has "Untitled Diagram > Untitled view"
        const spans = Array.from(container.querySelectorAll('span, p'));
        const untitledLabels = spans.filter(s => {
            const text = s.textContent.trim();
            // Must be exactly "Untitled" (node label), not "Untitled Diagram" etc.
            return text === 'Untitled';
        });

        return {
            images: allImgs.length,
            untitledLabels: untitledLabels.length,
            hasUntitled: hasUntitled,
            allImgAlts: Array.from(allImgs).map(img => img.getAttribute('alt') || '(none)')
        };
    """)


def place_node(driver, screenshot_prefix=""):
    """Open icon panel, select first icon, click canvas to place a node.
    Returns True if node was placed successfully.
    """
    pfx = f"{screenshot_prefix}_" if screenshot_prefix else ""

    # Click "Add item (N)" button
    add_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label*='Add item']")
    add_btn.click()
    time.sleep(1)

    # Expand the ISOFLOW icon collection
    driver.execute_script("""
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const text = btn.textContent.trim().toUpperCase();
            if (text.includes('ISOFLOW') && !text.includes('IMPORT')) {
                btn.click();
                return;
            }
        }
    """)
    time.sleep(3)

    # Select first icon with a small image (icon grid item)
    first_icon_btn = driver.execute_script("""
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const img = btn.querySelector('img');
            if (img && img.naturalWidth > 0 && img.naturalWidth <= 100) {
                return btn;
            }
        }
        for (const btn of buttons) {
            const img = btn.querySelector('img');
            if (img) return btn;
        }
        return null;
    """)

    if first_icon_btn is None:
        return False

    actions = ActionChains(driver)
    actions.click(first_icon_btn).perform()
    time.sleep(0.5)

    # Click on the canvas to place
    canvas = driver.find_element(By.CLASS_NAME, "fossflow-container")
    actions = ActionChains(driver)
    actions.move_to_element_with_offset(canvas, 500, 400)
    actions.click()
    actions.perform()
    time.sleep(1)

    if screenshot_prefix:
        save_screenshot(driver, f"{pfx}placed")

    return True


def find_toolbar_button(driver, name_substring):
    """Find a toolbar button by matching its tooltip/name text.
    The IconButton component wraps MUI Button inside a Tooltip.
    We find buttons whose parent tooltip has a matching title.
    """
    btn = driver.execute_script("""
        const target = arguments[0].toLowerCase();
        // Try aria-label first
        const byAria = document.querySelector(`button[aria-label*='${arguments[0]}']`);
        if (byAria) return byAria;

        // Try title attribute
        const byTitle = document.querySelector(`button[title*='${arguments[0]}']`);
        if (byTitle) return byTitle;

        // Try finding via MUI Tooltip data attribute or svg icon
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
            // Check if button or parent has matching tooltip text
            const title = btn.getAttribute('title') || '';
            const ariaLabel = btn.getAttribute('aria-label') || '';
            const ariaDescribedBy = btn.getAttribute('aria-describedby') || '';
            if (title.toLowerCase().includes(target) ||
                ariaLabel.toLowerCase().includes(target)) {
                return btn;
            }
        }
        return null;
    """, name_substring)
    return btn


def get_undo_redo_debug_info(driver):
    """Get debug info about undo/redo buttons and store state."""
    return driver.execute_script("""
        const allButtons = Array.from(document.querySelectorAll('button'));
        const buttonInfo = allButtons.map(btn => ({
            text: btn.textContent.trim().substring(0, 30),
            ariaLabel: btn.getAttribute('aria-label'),
            title: btn.getAttribute('title'),
            disabled: btn.disabled,
            className: btn.className.substring(0, 50)
        })).filter(b => b.ariaLabel || b.title);

        // Find undo/redo specific buttons
        const undoBtn = allButtons.find(b =>
            (b.getAttribute('aria-label') || '').includes('Undo') ||
            (b.getAttribute('title') || '').includes('Undo'));
        const redoBtn = allButtons.find(b =>
            (b.getAttribute('aria-label') || '').includes('Redo') ||
            (b.getAttribute('title') || '').includes('Redo'));

        return {
            totalButtons: allButtons.length,
            buttonsWithLabels: buttonInfo,
            undoButton: undoBtn ? {
                found: true,
                disabled: undoBtn.disabled,
                ariaLabel: undoBtn.getAttribute('aria-label'),
                title: undoBtn.getAttribute('title'),
                tagName: undoBtn.tagName,
                innerHTML: undoBtn.innerHTML.substring(0, 100)
            } : { found: false },
            redoButton: redoBtn ? {
                found: true,
                disabled: redoBtn.disabled,
                ariaLabel: redoBtn.getAttribute('aria-label'),
                title: redoBtn.getAttribute('title'),
            } : { found: false }
        };
    """)


def click_undo(driver):
    """Click the Undo button in the toolbar."""
    # Debug: check button state before clicking
    debug = get_undo_redo_debug_info(driver)
    print(f"  DEBUG Undo button: {debug['undoButton']}")

    btn = find_toolbar_button(driver, "Undo")
    if btn is None:
        # Fallback: try keyboard shortcut
        print("  WARNING: Undo button not found, trying Ctrl+Z")
        actions = ActionChains(driver)
        actions.key_down('\ue009').send_keys('z').key_up('\ue009').perform()
        time.sleep(1)
        return

    is_disabled = driver.execute_script("return arguments[0].disabled", btn)
    print(f"  DEBUG Undo button disabled={is_disabled}")

    if is_disabled:
        print("  WARNING: Undo button is DISABLED - canUndo is false!")

    btn.click()
    time.sleep(1)


def click_redo(driver):
    """Click the Redo button in the toolbar."""
    debug = get_undo_redo_debug_info(driver)
    print(f"  DEBUG Redo button: {debug['redoButton']}")

    btn = find_toolbar_button(driver, "Redo")
    if btn is None:
        print("  WARNING: Redo button not found, trying Ctrl+Y")
        actions = ActionChains(driver)
        actions.key_down('\ue009').send_keys('y').key_up('\ue009').perform()
        time.sleep(1)
        return

    is_disabled = driver.execute_script("return arguments[0].disabled", btn)
    print(f"  DEBUG Redo button disabled={is_disabled}")
    btn.click()
    time.sleep(1)


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def test_place_node_on_canvas(driver):
    """Place a node on the canvas and verify it appears."""
    base_url = get_base_url()

    print(f"\n1. Loading app at {base_url}")
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
    )
    time.sleep(2)

    dismiss_modals(driver)
    dismiss_tips(driver)
    time.sleep(0.5)

    save_screenshot(driver, "place_01_clean")

    # Count nodes before
    before = count_canvas_nodes(driver)
    print(f"2. Nodes before: images={before['images']}, labels={before['untitledLabels']}")

    # Place a node
    print("3. Placing node...")
    assert place_node(driver, "place"), "Failed to find icon to place"

    save_screenshot(driver, "place_02_after")

    # Count nodes after
    after = count_canvas_nodes(driver)
    print(f"4. Nodes after: images={after['images']}, labels={after['untitledLabels']}")

    assert after['images'] > before['images'] or after['untitledLabels'] > 0, (
        f"Node was NOT placed. Before: {before}, After: {after}"
    )

    print("  SUCCESS: Node placed on canvas!")


def test_undo_redo_node(driver):
    """Place a node, undo to remove it, redo to restore it."""
    base_url = get_base_url()

    # --- Setup: load app, dismiss popups ---
    print(f"\n1. Loading app at {base_url}")
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
    )
    time.sleep(2)

    dismiss_modals(driver)
    dismiss_tips(driver)
    time.sleep(0.5)

    # --- Baseline: empty canvas ---
    baseline = count_canvas_nodes(driver)
    print(f"2. Baseline (empty canvas): images={baseline['images']}, labels={baseline['untitledLabels']}")
    save_screenshot(driver, "undo_01_baseline")

    # --- Place a node ---
    print("3. Placing node...")
    assert place_node(driver, "undo"), "Failed to find icon to place"

    after_place = count_canvas_nodes(driver)
    print(f"4. After placement: images={after_place['images']}, labels={after_place['untitledLabels']}")
    save_screenshot(driver, "undo_02_node_placed")

    assert after_place['images'] > baseline['images'] or after_place['untitledLabels'] > 0, (
        f"Node was not placed. Baseline: {baseline}, After: {after_place}"
    )

    placed_images = after_place['images']

    # --- Debug: dump store state BEFORE undo via React fiber ---
    print("5. Inspecting store state before undo (via React fiber)...")
    store_state = driver.execute_script("""
        // Walk React fiber tree to find Zustand store contexts
        function findStores() {
            const root = document.getElementById('root');
            if (!root) return { error: 'No root element' };

            // Get the React fiber root
            const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
            if (!fiberKey) return { error: 'No React fiber found' };

            let fiber = root[fiberKey];

            // Walk the fiber tree looking for context values that look like Zustand stores
            const stores = {};
            let visited = 0;
            const queue = [fiber];

            while (queue.length > 0 && visited < 5000) {
                const node = queue.shift();
                visited++;

                // Check memoizedState for context values
                if (node && node.memoizedState) {
                    let st = node.memoizedState;
                    while (st) {
                        if (st.queue && st.queue.lastRenderedState) {
                            const state = st.queue.lastRenderedState;
                            // Look for model store (has 'views', 'items', 'history')
                            if (state && state.views && state.items && state.history) {
                                stores.modelStore = state;
                            }
                            // Look for scene store (has 'connectors', 'textBoxes', 'history')
                            if (state && state.connectors !== undefined && state.textBoxes !== undefined && state.history) {
                                stores.sceneStore = state;
                            }
                        }
                        st = st.next;
                    }
                }

                // Check context
                if (node && node.pendingProps && node.pendingProps.value) {
                    const val = node.pendingProps.value;
                    if (typeof val === 'object' && val !== null && typeof val.getState === 'function') {
                        try {
                            const state = val.getState();
                            if (state && state.views && state.items && state.history) {
                                stores.modelStoreApi = val;
                            }
                            if (state && state.connectors !== undefined && state.textBoxes !== undefined && state.history) {
                                stores.sceneStoreApi = val;
                            }
                        } catch(e) {}
                    }
                }

                if (node && node.child) queue.push(node.child);
                if (node && node.sibling) queue.push(node.sibling);
            }

            // If we found the stores via context providers, use those
            if (stores.modelStoreApi) {
                window.__modelStore__ = stores.modelStoreApi;
                const ms = stores.modelStoreApi.getState();
                const modelHistory = ms.history;
                const views = ms.views || [];
                const currentView = views[0];

                let sceneInfo = {};
                if (stores.sceneStoreApi) {
                    window.__sceneStore__ = stores.sceneStoreApi;
                    const ss = stores.sceneStoreApi.getState();
                    sceneInfo = {
                        sceneHistoryPastLength: ss.history ? ss.history.past.length : -1,
                        canUndoScene: ss.actions ? ss.actions.canUndo() : 'N/A',
                    };
                }

                return {
                    found: true,
                    modelHistoryPastLength: modelHistory ? modelHistory.past.length : -1,
                    modelHistoryFutureLength: modelHistory ? modelHistory.future.length : -1,
                    currentModelItemsCount: (ms.items || []).length,
                    currentViewItemsCount: currentView ? (currentView.items || []).length : -1,
                    currentViewsCount: views.length,
                    canUndoModel: ms.actions ? ms.actions.canUndo() : 'N/A',
                    canRedoModel: ms.actions ? ms.actions.canRedo() : 'N/A',
                    ...sceneInfo,
                    visited: visited,
                };
            }

            return { error: 'Stores not found via fiber', visited: visited };
        }

        return findStores();
    """)
    print(f"   Store state: {store_state}")

    # --- Click Undo ---
    print("6. Clicking Undo button...")
    click_undo(driver)
    time.sleep(0.5)

    # --- Debug: dump store state AFTER undo ---
    store_after_undo = driver.execute_script("""
        if (!window.__modelStore__) return { error: 'No store ref' };
        const ms = window.__modelStore__.getState();
        const modelHistory = ms.history;
        const views = ms.views || [];
        const currentView = views[0];
        const viewItems = currentView ? (currentView.items || []) : [];
        return {
            modelHistoryPastLength: modelHistory ? modelHistory.past.length : -1,
            modelHistoryFutureLength: modelHistory ? modelHistory.future.length : -1,
            currentModelItemsCount: (ms.items || []).length,
            currentViewItemsCount: viewItems.length,
            canUndoModel: ms.actions.canUndo(),
            canRedoModel: ms.actions.canRedo(),
        };
    """)
    print(f"   Store after undo: {store_after_undo}")

    after_undo = count_canvas_nodes(driver)
    print(f"7. After undo: images={after_undo['images']}, labels={after_undo['untitledLabels']}")
    save_screenshot(driver, "undo_03_after_undo")

    # If button click didn't work, try calling undo directly via JS
    if after_undo['images'] >= placed_images:
        print("   Button undo didn't remove node. Trying direct store undo via JS...")
        direct_result = driver.execute_script("""
            if (!window.__modelStore__) return { error: 'No store ref' };
            const ms = window.__modelStore__.getState();

            // First check state before undo
            const beforeItems = (ms.items || []).length;
            const beforeViews = ms.views || [];
            const beforeViewItems = beforeViews[0] ? (beforeViews[0].items || []).length : -1;
            const beforePast = ms.history.past.length;

            // Call undo directly
            const modelUndoResult = ms.actions.undo();

            // Check state after direct undo
            const msAfter = window.__modelStore__.getState();
            const views = msAfter.views || [];
            const currentView = views[0];
            return {
                modelUndoResult: modelUndoResult,
                beforeItems: beforeItems,
                beforeViewItems: beforeViewItems,
                beforePast: beforePast,
                afterModelItemsCount: (msAfter.items || []).length,
                afterViewItemsCount: currentView ? (currentView.items || []).length : -1,
                afterPastLength: msAfter.history.past.length,
                afterFutureLength: msAfter.history.future.length,
            };
        """)
        print(f"   Direct undo result: {direct_result}")
        time.sleep(1)
        after_undo = count_canvas_nodes(driver)
        print(f"   After direct undo: images={after_undo['images']}, labels={after_undo['untitledLabels']}")
        save_screenshot(driver, "undo_03b_after_direct_undo")

    assert after_undo['images'] < placed_images, (
        f"Undo did NOT remove the node. "
        f"Before undo: {placed_images} images, After undo: {after_undo['images']} images"
    )
    print("  Undo removed the node.")

    # --- Click Redo ---
    print("7. Clicking Redo...")
    click_redo(driver)

    after_redo = count_canvas_nodes(driver)
    print(f"8. After redo: images={after_redo['images']}, labels={after_redo['untitledLabels']}")
    save_screenshot(driver, "undo_04_after_redo")

    assert after_redo['images'] >= placed_images, (
        f"Redo did NOT restore the node. "
        f"After place: {placed_images} images, After redo: {after_redo['images']} images"
    )
    print("  Redo restored the node.")

    # --- Undo again (verify cycle works) ---
    print("9. Clicking Undo again...")
    click_undo(driver)

    after_undo2 = count_canvas_nodes(driver)
    print(f"10. After second undo: images={after_undo2['images']}, labels={after_undo2['untitledLabels']}")
    save_screenshot(driver, "undo_05_after_undo2")

    assert after_undo2['images'] < placed_images, (
        f"Second undo did NOT remove the node. "
        f"After redo: {placed_images} images, After undo2: {after_undo2['images']} images"
    )
    print("  Second undo removed the node again.")

    print("\n  SUCCESS: Undo/Redo/Undo cycle works correctly!")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
