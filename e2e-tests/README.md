# FossFLOW E2E Tests

End-to-end tests for FossFLOW using Selenium WebDriver via the [thirtyfour](https://github.com/Vrtgs/thirtyfour) Rust library.

## Prerequisites

1. **Rust** - Install from https://rustup.rs/
2. **Chrome/Chromium** browser
3. **ChromeDriver** or Selenium Server

## Running Tests Locally

### Option 1: Using Selenium Standalone (Recommended)

1. Start Selenium server with Chrome:
   ```bash
   docker run -d -p 4444:4444 -p 7900:7900 --shm-size="2g" selenium/standalone-chrome:latest
   ```

2. Start the FossFLOW dev server:
   ```bash
   npm run dev
   ```

3. Run the tests:
   ```bash
   cd e2e-tests
   cargo test -- --test-threads=1
   ```

   **Note**: Tests must run serially (`--test-threads=1`) because Selenium standalone only supports one session at a time.

### Option 2: Using ChromeDriver directly

1. Download ChromeDriver matching your Chrome version from https://chromedriver.chromium.org/

2. Start ChromeDriver:
   ```bash
   chromedriver --port=4444
   ```

3. Start the FossFLOW dev server:
   ```bash
   npm run dev
   ```

4. Run the tests:
   ```bash
   cd e2e-tests
   cargo test -- --test-threads=1
   ```

## Environment Variables

- `FOSSFLOW_TEST_URL` - Base URL of the app (default: `http://localhost:3000`)
- `WEBDRIVER_URL` - WebDriver endpoint (default: `http://localhost:4444`)

Example:
```bash
FOSSFLOW_TEST_URL=http://localhost:8080 cargo test
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
2. Starts the app server
3. Starts Selenium standalone Chrome
4. Runs all E2E tests

## Adding New Tests

1. Create a new test file in `tests/` directory
2. Add it to `Cargo.toml` under `[[test]]` sections
3. Use the thirtyfour API: https://docs.rs/thirtyfour/latest/thirtyfour/

Example:
```rust
use anyhow::Result;
use thirtyfour::prelude::*;

#[tokio::test]
async fn test_my_feature() -> Result<()> {
    let driver = WebDriver::new("http://localhost:4444", DesiredCapabilities::chrome()).await?;
    driver.goto("http://localhost:3000").await?;

    // Your test logic here

    driver.quit().await?;
    Ok(())
}
```

## Debugging

To run tests with visible browser (non-headless):
1. Modify the test to remove `.set_headless()?` from capabilities
2. Use `selenium/standalone-chrome-debug` Docker image with VNC viewer on port 7900

## Troubleshooting

**Connection refused errors:**
- Ensure Selenium/ChromeDriver is running on port 4444
- Ensure FossFLOW app is running on port 3000

**Element not found errors:**
- Increase wait times in tests
- Check if the app URL is correct
- Verify the app loaded successfully in browser

**Chrome version mismatch:**
- Update ChromeDriver to match your Chrome version
- Use Selenium Docker image (automatically handles version matching)
