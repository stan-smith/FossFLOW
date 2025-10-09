# E2E Testing Setup Summary

## What Was Added

A complete Selenium-based end-to-end testing framework using Python and pytest with the Selenium WebDriver library.

### File Structure

```
e2e-tests/
├── requirements.txt         # Python dependencies (selenium, pytest)
├── pytest.ini              # Pytest configuration
├── .gitignore              # Ignore __pycache__, .pytest_cache, venv
├── README.md               # Comprehensive testing documentation
├── SETUP.md                # This file
├── run-tests.sh            # Helper script for local testing
└── tests/
    └── test_basic_load.py  # Initial test suite
```

### Tests Included

Three basic tests to verify the application loads correctly:

1. **test_homepage_loads** - Verifies:
   - Page loads successfully
   - Title contains "FossFLOW" or "isometric"
   - Body element exists
   - React root element exists

2. **test_page_has_canvas** - Verifies:
   - Canvas element exists (for isometric drawing)

3. **test_page_renders_without_crash** - Verifies:
   - Page fully renders without errors
   - All key elements are visible (body, root, canvas)
   - Page source is substantial (not blank/error page)

### CI/CD Integration

Updated `.github/workflows/e2e-tests.yml` to:
- Run on push/PR to master/main branches
- Set up Python 3.11 with pip caching
- Spin up Selenium standalone Chrome in Docker
- Build the FossFLOW app
- Serve the built app with nohup for persistence
- Install Python test dependencies
- Run all E2E tests with pytest
- Upload test artifacts

### Dependencies

**Python packages:**
- `selenium` v4.27.1 - WebDriver automation library
- `pytest` v8.3.4 - Testing framework
- `pytest-xdist` v3.6.1 - Parallel test execution support

**External services:**
- Selenium Server (via Docker)
- Running FossFLOW instance

## Quick Start

### Local Development

```bash
# Easiest: Use the helper script
cd e2e-tests
./run-tests.sh

# The script will:
# - Start Selenium container
# - Create Python venv
# - Install dependencies
# - Prompt you to start the app
# - Run tests
# - Clean up
```

### Manual Setup

```bash
# 1. Start Selenium (in Docker)
docker run -d -p 4444:4444 -p 7900:7900 --shm-size=2g selenium/standalone-chrome

# 2. Start FossFLOW dev server (in another terminal)
npm run dev

# 3. Set up Python environment
cd e2e-tests
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Run tests
pytest -v
```

### CI/CD

Tests run automatically on GitHub Actions. See workflow at `.github/workflows/e2e-tests.yml`.

## Next Steps

You can now expand the test suite to cover:

1. **Drawing Features**
   - Add nodes to canvas
   - Connect nodes
   - Edit node properties
   - Delete nodes

2. **UI Interactions**
   - Menu navigation
   - Settings dialogs
   - Tool selection
   - Hotkeys

3. **Data Operations**
   - Save diagrams
   - Load diagrams
   - Export to JSON
   - Import from JSON

4. **Advanced Features**
   - Undo/redo
   - Custom icons
   - Multi-select
   - Zoom/pan

## Example: Adding a New Test

Create `tests/test_diagram_creation.py`:

```python
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def test_can_add_node(driver):
    """Test that users can add a node to the canvas."""
    driver.get("http://localhost:3000")

    # Wait for app to load
    wait = WebDriverWait(driver, 10)

    # Click the add node button
    add_button = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='Add Node']"))
    )
    add_button.click()

    # Verify node library appears
    library = wait.until(
        EC.visibility_of_element_located((By.CLASS_NAME, "node-library"))
    )
    assert library.is_displayed()
```

Run: `pytest tests/test_diagram_creation.py::test_can_add_node -v`

## Pytest Features

### Running Tests

```bash
# Run all tests
pytest -v

# Run specific test file
pytest tests/test_basic_load.py -v

# Run specific test
pytest tests/test_basic_load.py::test_homepage_loads -v

# Run tests matching pattern
pytest -k "canvas" -v

# Run with more verbose output
pytest -vv --tb=long
```

### Test Fixtures

The `driver` fixture is automatically available to all tests:

```python
def test_example(driver):
    driver.get("http://localhost:3000")
    # driver is automatically created and cleaned up
```

## Debugging

### Watch Tests with VNC

Connect to `http://localhost:7900` (password: `secret`) to watch tests run in real-time.

### Run Non-Headless

Edit `test_basic_load.py` and comment out:
```python
# chrome_options.add_argument("--headless")
```

### Add Screenshots on Failure

Add to your test:
```python
def test_example(driver):
    try:
        # Your test code
        assert something
    except AssertionError:
        driver.save_screenshot("failure.png")
        raise
```

## Troubleshooting

See `README.md` for detailed troubleshooting steps including:
- Connection refused errors
- Element not found errors
- Import errors
- Docker container conflicts

## Resources

- [Selenium Python documentation](https://selenium-python.readthedocs.io/)
- [pytest documentation](https://docs.pytest.org/)
- [Selenium WebDriver docs](https://www.selenium.dev/documentation/webdriver/)
- [WebDriver spec](https://w3c.github.io/webdriver/)

## Migration Notes

This test suite was migrated from Rust (thirtyfour) to Python (selenium + pytest) for:
- Simpler syntax and easier maintenance
- Better debugging tools
- Wider community support
- Faster test development
- More reliable WebDriver connections
