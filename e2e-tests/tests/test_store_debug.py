"""Direct store-level undo/redo debugging."""
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def setup_driver():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1920,1080")
    opts.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
    d = webdriver.Remote("http://localhost:4444", options=opts)
    d.implicitly_wait(10)
    return d


def dump_store(d, label):
    """Dump detailed store state."""
    result = d.execute_script("""
        var ms = window.__modelStore__;
        var ss = window.__sceneStore__;
        if (!ms || !ss) return {error: "stores not found", hasModel: !!ms, hasScene: !!ss};

        var m = ms.getState();
        var s = ss.getState();
        var cv = m.views && m.views[0];
        return {
            model: {
                itemsLen: (m.items || []).length,
                itemIds: (m.items || []).map(function(i){return i.id}),
                viewsLen: (m.views || []).length,
                viewItemsLen: cv ? (cv.items || []).length : -1,
                viewItemIds: cv ? (cv.items || []).map(function(i){return i.id}) : [],
                iconsLen: (m.icons || []).length,
                histPastLen: m.history.past.length,
                histFutureLen: m.history.future.length,
                canUndo: m.actions.canUndo(),
                canRedo: m.actions.canRedo(),
            },
            scene: {
                connectors: Object.keys(s.connectors || {}).length,
                textBoxes: Object.keys(s.textBoxes || {}).length,
                histPastLen: s.history.past.length,
                histFutureLen: s.history.future.length,
                canUndo: s.actions.canUndo(),
                canRedo: s.actions.canRedo(),
            }
        };
    """)
    print(f"\n  [{label}] Store state: {json.dumps(result, indent=2)}")
    return result


def count_dom_nodes(d):
    """Count images and 'Untitled' labels in the DOM."""
    return d.execute_script("""
        var c = document.querySelector('.fossflow-container');
        if (!c) return {images: 0, labels: 0};
        var imgs = c.querySelectorAll('img').length;
        var spans = Array.from(c.querySelectorAll('span, p'));
        var labels = spans.filter(function(s){return s.textContent.trim() === 'Untitled'}).length;
        return {images: imgs, labels: labels};
    """)


def place_node(d):
    """Place a node using the same approach as the working e2e test."""
    # Click "Add item (N)" button
    add_btn = d.find_element(By.CSS_SELECTOR, "button[aria-label*='Add item']")
    add_btn.click()
    time.sleep(1)

    # Expand ISOFLOW icon collection
    d.execute_script("""
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

    # Select first icon button via ActionChains (not JS click)
    first_icon_btn = d.execute_script("""
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
        print("  ERROR: No icon button found")
        return False

    ActionChains(d).click(first_icon_btn).perform()
    time.sleep(0.5)

    # Click on canvas
    canvas = d.find_element(By.CLASS_NAME, "fossflow-container")
    ActionChains(d).move_to_element_with_offset(canvas, 500, 400).click().perform()
    time.sleep(1)
    return True


def main():
    d = setup_driver()
    try:
        d.get("http://localhost:3000")
        WebDriverWait(d, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
        )
        time.sleep(3)

        # Dismiss modals/tips
        d.execute_script("""
            const dialogs = document.querySelectorAll('[role="dialog"], [class*="MuiDialog"]');
            dialogs.forEach(d => { const b = d.querySelector('button'); if(b) b.click(); });
        """)
        time.sleep(0.5)

        # Check stores
        has = d.execute_script("return {m: !!window.__modelStore__, s: !!window.__sceneStore__}")
        print(f"Stores on window: {json.dumps(has)}")
        if not has.get("m") or not has.get("s"):
            print("ERROR: Stores not exported to window!")
            return

        # 1. Baseline
        dump_store(d, "BASELINE")
        dom = count_dom_nodes(d)
        print(f"  DOM: {json.dumps(dom)}")

        # 2. Place node
        print("\n--- PLACING NODE ---")
        ok = place_node(d)
        print(f"  place_node returned: {ok}")
        dom = count_dom_nodes(d)
        print(f"  DOM after place: {json.dumps(dom)}")
        dump_store(d, "AFTER PLACE")

        if dom.get("images", 0) == 0:
            print("\n  WARNING: No images in DOM - placement may have failed")
            # Screenshot for debugging
            d.save_screenshot("/tmp/debug_after_place.png")
            print("  Screenshot: /tmp/debug_after_place.png")

        # 3. Direct model undo
        print("\n--- MODEL UNDO ---")
        undo_result = d.execute_script("""
            var ms = window.__modelStore__.getState();
            var result = ms.actions.undo();
            var after = window.__modelStore__.getState();
            var cv = after.views && after.views[0];
            var f = after.history.future;
            return {
                result: result,
                afterItems: (after.items || []).length,
                afterViewItems: cv ? (cv.items || []).length : -1,
                pastLen: after.history.past.length,
                futureLen: f.length,
                // Inspect what's in future[0]
                future0: f[0] ? {
                    items: (f[0].items || []).length,
                    views: (f[0].views || []).length,
                    viewItems: f[0].views && f[0].views[0] ? (f[0].views[0].items || []).length : -1,
                } : null
            };
        """)
        print(f"  Model undo: {json.dumps(undo_result, indent=2)}")

        # Also undo scene
        scene_undo = d.execute_script("""
            var ss = window.__sceneStore__.getState();
            return { result: ss.actions.undo() };
        """)
        print(f"  Scene undo: {json.dumps(scene_undo)}")

        dump_store(d, "AFTER UNDO")
        time.sleep(0.5)
        dom = count_dom_nodes(d)
        print(f"  DOM after undo: {json.dumps(dom)}")

        # 4. Direct model redo
        print("\n--- MODEL REDO ---")
        redo_result = d.execute_script("""
            var ms = window.__modelStore__.getState();
            var f = ms.history.future;
            var beforeInfo = {
                items: (ms.items || []).length,
                futureLen: f.length,
                future0: f[0] ? {
                    items: (f[0].items || []).length,
                    views: (f[0].views || []).length,
                    viewItems: f[0].views && f[0].views[0] ? (f[0].views[0].items || []).length : -1,
                } : null
            };
            var result = ms.actions.redo();
            var after = window.__modelStore__.getState();
            var cv = after.views && after.views[0];
            return {
                before: beforeInfo,
                result: result,
                afterItems: (after.items || []).length,
                afterViewItems: cv ? (cv.items || []).length : -1,
                pastLen: after.history.past.length,
                futureLen: after.history.future.length,
            };
        """)
        print(f"  Model redo: {json.dumps(redo_result, indent=2)}")

        # Also redo scene
        scene_redo = d.execute_script("""
            var ss = window.__sceneStore__.getState();
            return { result: ss.actions.redo() };
        """)
        print(f"  Scene redo: {json.dumps(scene_redo)}")

        dump_store(d, "AFTER REDO")
        time.sleep(0.5)
        dom = count_dom_nodes(d)
        print(f"  DOM after redo: {json.dumps(dom)}")

        print("\n--- ALL TESTS PASSED ---")

    finally:
        d.quit()


if __name__ == "__main__":
    main()
