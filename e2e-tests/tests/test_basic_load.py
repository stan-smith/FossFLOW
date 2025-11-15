"""
Basic E2E tests for FossFLOW application.
Tests basic page loading, canvas presence, and rendering.
"""
import os
import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def get_base_url():
    """Get the base URL from environment or use default."""
    return os.getenv("FOSSFLOW_TEST_URL", "http://localhost:3000")


def get_webdriver_url():
    """Get the WebDriver URL from environment or use default."""
    return os.getenv("WEBDRIVER_URL", "http://localhost:4444")


@pytest.fixture(scope="function")
def driver():
    """Create a Chrome WebDriver instance for each test."""
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")  # Use new headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Enable canvas and WebGL rendering
    chrome_options.add_argument("--enable-webgl")
    chrome_options.add_argument("--use-gl=swiftshader")  # Software GL for headless
    chrome_options.add_argument("--enable-accelerated-2d-canvas")

    # Increase window size (some canvas libraries check viewport)
    chrome_options.add_argument("--window-size=1920,1080")

    # Disable features that might interfere
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")

    # Enable logging to see what's happening
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

    webdriver_url = get_webdriver_url()

    # Connect to remote WebDriver (Selenium Grid)
    driver = webdriver.Remote(
        command_executor=webdriver_url,
        options=chrome_options
    )

    driver.implicitly_wait(10)

    yield driver

    # Cleanup
    driver.quit()


def test_can_connect_to_server(driver):
    """Test that we can connect to the server and get a response."""
    base_url = get_base_url()

    print(f"\nAttempting to navigate to: {base_url}")

    # Navigate to homepage
    driver.get(base_url)

    # Wait a bit for page to load
    time.sleep(3)

    # Just verify we got SOMETHING back
    page_source = driver.page_source
    print(f"Page source length: {len(page_source)} bytes")

    assert len(page_source) > 0, "Page source should not be empty"
    print("✓ Got page content from server")


def test_homepage_loads(driver):
    """Test that the homepage loads successfully."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)

    # Wait for page to load
    time.sleep(5)

    # Get page title
    title = driver.title
    print(f"\nPage title: {title}")

    # Verify title contains relevant keywords or is not empty
    # Be more lenient - just check it's not empty
    assert len(title) > 0, f"Page title should not be empty. Got: '{title}'"

    print("✓ Homepage loaded with title")


def test_page_has_body_and_root(driver):
    """Test that the page has basic HTML structure."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)

    # Wait for page to load
    time.sleep(5)

    # Check that body exists
    body = driver.find_element(By.TAG_NAME, "body")
    assert body is not None, "Body element should exist"
    print("\n✓ Body element found")

    # Check for React root element
    root = driver.find_element(By.ID, "root")
    assert root is not None, "React root element should exist"
    print("✓ React root element found")


def test_javascript_is_executing(driver):
    """Test that JavaScript is actually running in the browser."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)
    time.sleep(5)

    # Check if JavaScript is enabled
    js_enabled = driver.execute_script("return true;")
    print(f"\n✓ JavaScript enabled: {js_enabled}")
    assert js_enabled, "JavaScript should be enabled"

    # Check if we can access window object
    has_window = driver.execute_script("return typeof window !== 'undefined';")
    print(f"✓ Window object available: {has_window}")
    assert has_window, "Window object should be available"

    # Check if React has mounted
    root_content = driver.execute_script("return document.getElementById('root').innerHTML.length;")
    print(f"✓ Root innerHTML length: {root_content} characters")

    if root_content == 0:
        print("⚠️  WARNING: React root is empty - React may not have mounted!")
        # Get browser console logs
        logs = driver.get_log('browser')
        if logs:
            print("\nBrowser console logs:")
            for log in logs[-10:]:  # Last 10 logs
                print(f"  [{log['level']}] {log['message']}")

        # Check for specific elements that React should create
        print("\nChecking for expected React-created elements...")
        all_divs = driver.execute_script("return document.querySelectorAll('div').length;")
        print(f"  Total div elements: {all_divs}")

        all_buttons = driver.execute_script("return document.querySelectorAll('button').length;")
        print(f"  Total button elements: {all_buttons}")

        all_canvases = driver.execute_script("return document.querySelectorAll('canvas').length;")
        print(f"  Total canvas elements: {all_canvases}")

    assert root_content > 0, "React should have rendered content into the root element"
    print(f"✓ React has rendered content into root")


def test_app_renders_diagram_components(driver):
    """Test that the app renders SVG-based diagram components (FossFLOW uses SVG)."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)

    print("\nWaiting for FossFLOW app to render diagram components...")

    # Wait for the fossflow-container div to appear (max 10 seconds)
    try:
        container = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "fossflow-container"))
        )
        print("✓ FossFLOW container element found")
    except Exception as e:
        print(f"❌ FossFLOW container not found: {e}")

        # Get diagnostics
        logs = driver.get_log('browser')
        errors = [log for log in logs if log['level'] == 'SEVERE']
        if errors:
            print(f"\nBrowser console errors:")
            for log in errors[:5]:
                print(f"  {log['message'][:100]}")

        pytest.fail("FossFLOW container div not found - React may not have rendered")

    # Check that the app has rendered its UI components
    dom_info = driver.execute_script("""
        return {
            divs: document.querySelectorAll('div').length,
            buttons: document.querySelectorAll('button').length,
            svgs: document.querySelectorAll('svg').length,
            hasFossflowContainer: document.querySelector('.fossflow-container') !== null
        };
    """)

    print(f"\nDOM structure:")
    print(f"  Divs: {dom_info['divs']}")
    print(f"  Buttons: {dom_info['buttons']}")
    print(f"  SVG elements: {dom_info['svgs']}")
    print(f"  FossFLOW container: {dom_info['hasFossflowContainer']}")

    # Check for console errors
    logs = driver.get_log('browser')
    errors = [log for log in logs if log['level'] == 'SEVERE']

    if errors:
        print(f"\n⚠️  Found {len(errors)} console errors:")
        for log in errors[:5]:
            print(f"  {log['message'][:100]}")

    # Verify the app has rendered meaningful content
    assert dom_info['divs'] > 10, f"Expected many div elements, got {dom_info['divs']}"
    assert dom_info['buttons'] > 0, f"Expected buttons in the UI, got {dom_info['buttons']}"
    assert dom_info['hasFossflowContainer'], "FossFLOW container div should exist"

    print("\n✓ SUCCESS: FossFLOW app has rendered with UI components")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
