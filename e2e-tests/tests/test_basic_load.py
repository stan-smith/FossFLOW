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
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

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


def test_homepage_loads(driver):
    """Test that the homepage loads successfully."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)

    # Wait for page to load
    time.sleep(3)

    # Get page title
    title = driver.title
    print(f"Page title: {title}")

    # Verify title contains relevant keywords or is not empty
    assert (
        "fossflow" in title.lower() or
        "isometric" in title.lower() or
        len(title) > 0
    ), f"Page title should contain 'FossFLOW' or 'isometric', or at least not be empty. Got: '{title}'"

    # Check that body exists
    body = driver.find_element(By.TAG_NAME, "body")
    assert body.is_displayed(), "Page body should be visible"

    # Check for React root element
    try:
        root = driver.find_element(By.ID, "root")
        assert root is not None, "React root element should exist"
    except Exception as e:
        pytest.fail(f"React root element not found: {e}")

    print("✓ Homepage loaded successfully")
    print(f"✓ Title: {title}")
    print("✓ Body element present")
    print("✓ React root element present")


def test_page_has_canvas(driver):
    """Test that the page has a canvas element for diagram drawing."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)

    # Wait for page to load
    time.sleep(3)

    # Check for canvas element
    try:
        canvas = driver.find_element(By.TAG_NAME, "canvas")
        assert canvas is not None, "Canvas element should exist for diagram drawing"
        print("✓ Canvas element found on page")
    except Exception as e:
        pytest.fail(f"Canvas element not found: {e}")


def test_page_renders_without_crash(driver):
    """Test that the page renders completely without crashing."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)

    # Wait for page to fully load
    time.sleep(5)

    # Check multiple elements to ensure page rendered properly
    body = driver.find_element(By.TAG_NAME, "body")
    assert body.is_displayed(), "Body should be visible"

    root = driver.find_element(By.ID, "root")
    assert root.is_displayed(), "Root element should be visible"

    # Check for canvas (main drawing area)
    canvas = driver.find_element(By.TAG_NAME, "canvas")
    assert canvas.is_displayed(), "Canvas should be visible"

    # Verify we can get page source (ensures no blank/error page)
    source = driver.page_source
    source_len = len(source)
    assert source_len > 1000, f"Page source should be substantial (got {source_len} bytes)"

    print("✓ Page rendered successfully without crashing")
    print(f"✓ Page source size: {source_len} bytes")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
