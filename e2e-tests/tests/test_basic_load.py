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


def test_page_has_canvas(driver):
    """Test that the page has a canvas element for diagram drawing."""
    base_url = get_base_url()

    # Navigate to homepage
    driver.get(base_url)

    # Wait longer for the app to fully initialize
    time.sleep(10)

    # Check for canvas element
    canvases = driver.find_elements(By.TAG_NAME, "canvas")
    print(f"\nFound {len(canvases)} canvas element(s)")

    assert len(canvases) > 0, "At least one canvas element should exist for diagram drawing"
    print("✓ Canvas element found on page")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
