# FossFLOW E2E Tests

End-to-end tests for FossFLOW using Selenium WebDriver with Python and pytest.

## Prerequisites

1. **Python 3.11+** - Install from https://www.python.org/
2. **Docker** - For running Selenium Grid
3. **Chrome/Chromium** browser (provided by Selenium Docker image)

## Running Tests Locally

### Quick Start (Recommended)

Use the provided test runner script:

```bash
cd e2e-tests
./run-tests.sh
```

The script will:
- Check for required dependencies (Docker, Python)
- Start Selenium container automatically
- Create a Python virtual environment
- Install test dependencies
- Prompt you to start the FossFLOW app if not running
- Run the tests
- Clean up Selenium container

### Manual Setup

1. Start Selenium server with Chrome:
   ```bash
   docker run -d --name fossflow-selenium -p 4444:4444 -p 7900:7900 --shm-size="2g" selenium/standalone-chrome:latest
   ```

2. Start the FossFLOW dev server:
   ```bash
   cd ..  # Go to project root
   npm run dev
   ```

3. Install Python dependencies:
   ```bash
   cd e2e-tests
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Run the tests:
   ```bash
   pytest -v
   ```

## Environment Variables

- `FOSSFLOW_TEST_URL` - Base URL of the app (default: `http://localhost:3000`)
- `WEBDRIVER_URL` - WebDriver endpoint (default: `http://localhost:4444`)

Example:
```bash
FOSSFLOW_TEST_URL=http://localhost:8080 pytest -v
```

## Available Tests

- `test_homepage_loads` - Verifies the homepage loads and has basic React elements
- `test_page_has_canvas` - Checks for the canvas element used for diagram drawing
- `test_page_renders_without_crash` - Verifies the page fully renders with all key elements visible

## CI/CD

Tests run automatically in GitHub Actions on:
- Push to `master` or `main` branches
- Pull requests to `master` or `main` branches

The CI workflow:
1. Builds the app
2. Starts the app server in background
3. Starts Selenium standalone Chrome
4. Installs Python dependencies
5. Runs all E2E tests with pytest

## Test Structure

```
e2e-tests/
├── tests/
│   └── test_basic_load.py    # Main test suite
├── requirements.txt           # Python dependencies
├── pytest.ini                 # Pytest configuration
├── run-tests.sh              # Test runner script
└── README.md                 # This file
```

## Adding New Tests

1. Create a new test file in `tests/` directory (must start with `test_`)
2. Import required modules:
   ```python
   import pytest
   from selenium import webdriver
   from selenium.webdriver.common.by import By
   ```

3. Use the `driver` fixture:
   ```python
   def test_my_feature(driver):
       driver.get("http://localhost:3000")
       element = driver.find_element(By.ID, "my-element")
       assert element.is_displayed()
   ```

4. Run your test:
   ```bash
   pytest tests/test_my_feature.py -v
   ```

## Debugging

### Running with Visible Browser

To see the browser during tests, modify the driver fixture in `test_basic_load.py`:
```python
# Comment out headless mode
# chrome_options.add_argument("--headless")
```

### Using VNC to Watch Tests

When using the Selenium Docker image, you can watch tests in real-time:

1. Connect to VNC viewer at `http://localhost:7900` (password: `secret`)
2. Remove `--headless` from Chrome options
3. Run tests and watch in VNC viewer

### Verbose Output

Run tests with more verbose output:
```bash
pytest -vv --tb=long
```

### Running Specific Tests

```bash
# Run a single test
pytest tests/test_basic_load.py::test_homepage_loads -v

# Run tests matching a pattern
pytest -k "canvas" -v
```

## Troubleshooting

### Connection refused errors
- Ensure Selenium is running: `docker ps | grep selenium`
- Check Selenium status: `curl http://localhost:4444/status`
- Ensure FossFLOW app is running: `curl http://localhost:3000`

### Element not found errors
- Increase wait times in tests
- Check if the app URL is correct
- Verify the app loaded successfully in browser

### Import errors
- Activate virtual environment: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`

### Docker container conflicts
- Remove existing container: `docker rm -f fossflow-selenium`
- Check for port conflicts: `lsof -i :4444`

## Dependencies

- **selenium** (4.27.1) - WebDriver automation library
- **pytest** (8.3.4) - Testing framework
- **pytest-xdist** (3.6.1) - Parallel test execution support
