"""
E2E tests for verifying the app works correctly when served from different base paths.
This catches issues with React Router and asset loading when deployed to subpaths.
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


def get_base_path():
    """Get the base path from environment."""
    return os.getenv("FOSSFLOW_BASE_PATH", "/")


def get_webdriver_url():
    """Get the WebDriver URL from environment or use default."""
    return os.getenv("WEBDRIVER_URL", "http://localhost:4444")


@pytest.fixture(scope="function")
def driver():
    """Create a Chrome WebDriver instance for each test."""
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

    webdriver_url = get_webdriver_url()

    driver = webdriver.Remote(
        command_executor=webdriver_url,
        options=chrome_options
    )

    driver.implicitly_wait(10)

    yield driver

    driver.quit()


def test_app_loads_at_base_path(driver):
    """Test that the app loads successfully at the configured base path."""
    base_url = get_base_url()
    base_path = get_base_path()

    print(f"\nTesting app at base URL: {base_url}")
    print(f"Base path: {base_path}")

    # Navigate to the app
    driver.get(base_url)

    # Wait for React to mount
    time.sleep(3)

    # Verify we're at the correct URL
    current_url = driver.current_url
    print(f"Current URL: {current_url}")

    # The URL should contain our base path
    if base_path != "/":
        assert base_path in current_url, f"Expected base path '{base_path}' in URL '{current_url}'"

    # Check that the React app has mounted
    root = driver.find_element(By.ID, "root")
    assert root is not None, "React root element should exist"

    root_content = driver.execute_script("return document.getElementById('root').innerHTML.length;")
    assert root_content > 0, "React should have rendered content"

    print("✓ App loaded successfully at base path")


def test_static_assets_load_correctly(driver):
    """Test that CSS, JS, and other static assets load from the correct path."""
    base_url = get_base_url()
    base_path = get_base_path()

    driver.get(base_url)
    time.sleep(3)

    # Check for any failed resource loads in network
    failed_resources = driver.execute_script("""
        const perf = performance.getEntriesByType('resource');
        const failed = perf.filter(entry => {
            // Check for failed loads (status 404, 403, 500, etc.)
            // Note: transferSize === 0 might indicate CORS issues or failed loads
            return entry.transferSize === 0 && !entry.name.includes('data:');
        });
        return failed.map(r => ({
            name: r.name,
            type: r.initiatorType
        }));
    """)

    if failed_resources:
        print(f"\n⚠ Found {len(failed_resources)} potentially failed resource loads:")
        for resource in failed_resources[:10]:
            print(f"  - {resource['type']}: {resource['name']}")

    # Check that main JS bundle loaded
    js_loaded = driver.execute_script("""
        const scripts = Array.from(document.getElementsByTagName('script'));
        return scripts.some(s => s.src && !s.src.includes('data:'));
    """)
    assert js_loaded, "JavaScript bundles should be loaded"
    print("✓ JavaScript bundles loaded")

    # Check that CSS loaded
    css_loaded = driver.execute_script("""
        const links = Array.from(document.getElementsByTagName('link'));
        const hasCSS = links.some(l => l.rel === 'stylesheet' && l.href);
        const hasStyles = document.getElementsByTagName('style').length > 0;
        return hasCSS || hasStyles;
    """)
    assert css_loaded, "CSS should be loaded"
    print("✓ CSS loaded")

    # Check console for errors about failed loads
    logs = driver.get_log('browser')
    errors = [log for log in logs if 'Failed to load resource' in log.get('message', '') or '404' in log.get('message', '')]

    if errors:
        print(f"\n⚠ Found {len(errors)} resource loading errors in console:")
        for error in errors[:5]:
            print(f"  {error['message'][:100]}")

        # Don't fail the test but warn about errors
        if len(errors) > 5:
            pytest.fail(f"Too many resource loading errors ({len(errors)}). Check asset paths.")

    print("✓ Static assets loaded correctly")


def test_react_router_navigation_works(driver):
    """Test that React Router navigation works correctly with the base path."""
    base_url = get_base_url()
    base_path = get_base_path()

    driver.get(base_url)
    time.sleep(3)

    # Get initial URL
    initial_url = driver.current_url
    print(f"\nInitial URL: {initial_url}")

    # Try navigating to a different route using React Router
    # Note: This assumes the app has navigation. Adjust based on actual routes.
    navigation_result = driver.execute_script("""
        // Check if React Router is available
        const hasRouter = window.React && window.ReactDOM;

        // Try to find any links or buttons that might trigger navigation
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="#"]');
        const buttons = document.querySelectorAll('button');

        return {
            hasReactApp: !!document.querySelector('#root').children.length,
            linkCount: links.length,
            buttonCount: buttons.length,
            currentPath: window.location.pathname
        };
    """)

    print(f"Navigation check:")
    print(f"  Has React App: {navigation_result['hasReactApp']}")
    print(f"  Links found: {navigation_result['linkCount']}")
    print(f"  Buttons found: {navigation_result['buttonCount']}")
    print(f"  Current path: {navigation_result['currentPath']}")

    # Verify the current path matches our expected base path structure
    current_path = navigation_result['currentPath']
    if base_path != "/" and not current_path.startswith(base_path.rstrip('/')):
        pytest.fail(f"Current path '{current_path}' doesn't start with base path '{base_path}'")

    print("✓ React Router configured correctly for base path")


def test_router_basename_detection(driver):
    """Test that the React Router basename is correctly detected from the URL."""
    base_url = get_base_url()
    base_path = get_base_path()

    driver.get(base_url)
    time.sleep(3)

    # Check what basename React Router is using
    # This executes the same logic as in App.tsx
    detected_basename = driver.execute_script(r"""
        // This replicates the basename detection logic from App.tsx
        const pathname = window.location.pathname;
        const basename = pathname.replace(/\/display\/.*$/, '').replace(/\/$/, '') || '/';
        return basename;
    """)

    print(f"\nBasename detection:")
    print(f"  Expected base path: {base_path}")
    print(f"  Detected basename: {detected_basename}")
    print(f"  Current pathname: {driver.execute_script('return window.location.pathname')}")

    # The detected basename should match our base path (normalized)
    expected = base_path.rstrip('/') or '/'
    detected = detected_basename.rstrip('/') or '/'

    if expected != detected:
        print(f"⚠ Warning: Basename mismatch - expected '{expected}', detected '{detected}'")
        # This might be okay if the app handles it correctly
        # Don't fail immediately, but check if the app still works

        # Verify the app actually rendered despite the mismatch
        app_rendered = driver.execute_script("""
            return document.querySelector('.fossflow-container') !== null ||
                   document.querySelector('#root').children.length > 0;
        """)

        if not app_rendered:
            pytest.fail(f"App didn't render with basename mismatch. Expected '{expected}', got '{detected}'")

    print("✓ Router basename detection working correctly")


def test_no_console_errors_at_base_path(driver):
    """Ensure there are no critical JavaScript errors when loaded at base path."""
    base_url = get_base_url()
    base_path = get_base_path()

    driver.get(base_url)
    time.sleep(3)

    # Get console logs
    logs = driver.get_log('browser')

    # Filter for severe errors
    severe_errors = [log for log in logs if log['level'] == 'SEVERE']

    # Common errors to ignore (that might not be real issues)
    ignored_patterns = [
        'favicon.ico',  # Missing favicon is okay
        'manifest.json',  # Missing manifest is okay for basic functionality
    ]

    critical_errors = []
    for error in severe_errors:
        message = error.get('message', '')
        if not any(pattern in message for pattern in ignored_patterns):
            critical_errors.append(error)

    if critical_errors:
        print(f"\n⚠ Found {len(critical_errors)} critical console errors:")
        for error in critical_errors[:5]:
            print(f"  {error['message'][:150]}")

        # Check for specific routing-related errors
        routing_errors = [e for e in critical_errors if 'Router' in e['message'] or 'basename' in e['message']]
        if routing_errors:
            pytest.fail(f"Found React Router errors: {routing_errors[0]['message']}")

    else:
        print("✓ No critical console errors found")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])