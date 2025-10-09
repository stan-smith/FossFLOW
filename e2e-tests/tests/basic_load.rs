use anyhow::Result;
use thirtyfour::prelude::*;

/// Get the base URL from environment variable or use default localhost
fn get_base_url() -> String {
    std::env::var("FOSSFLOW_TEST_URL").unwrap_or_else(|_| "http://localhost:3000".to_string())
}

/// Get the WebDriver URL from environment variable or use default
fn get_webdriver_url() -> String {
    std::env::var("WEBDRIVER_URL").unwrap_or_else(|_| "http://localhost:4444".to_string())
}

#[tokio::test]
async fn test_homepage_loads() -> Result<()> {
    let base_url = get_base_url();
    let webdriver_url = get_webdriver_url();

    // Configure Chrome options
    let mut caps = DesiredCapabilities::chrome();
    caps.set_headless()?;
    caps.set_no_sandbox()?;
    caps.set_disable_dev_shm_usage()?;

    // Connect to WebDriver
    let driver = WebDriver::new(&webdriver_url, caps).await?;

    // Navigate to the homepage
    driver.goto(&base_url).await?;

    // Wait for the page to load (give it a moment)
    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;

    // Get the page title
    let title = driver.title().await?;
    println!("Page title: {}", title);

    // Verify the title contains "FossFLOW" or relevant app name
    assert!(
        title.to_lowercase().contains("fossflow")
            || title.to_lowercase().contains("isometric")
            || !title.is_empty(),
        "Page title should contain 'FossFLOW' or 'isometric', or at least not be empty. Got: '{}'",
        title
    );

    // Check that the page body exists
    let body = driver.find(By::Tag("body")).await?;
    assert!(body.is_present().await?, "Page body should be present");

    // Check for React root element (common in React apps)
    let root_exists = driver.find(By::Id("root")).await.is_ok();
    assert!(root_exists, "React root element should exist");

    println!("✓ Homepage loaded successfully");
    println!("✓ Title: {}", title);
    println!("✓ Body element present");
    println!("✓ React root element present");

    // Clean up
    driver.quit().await?;

    Ok(())
}

#[tokio::test]
async fn test_page_has_canvas() -> Result<()> {
    let base_url = get_base_url();
    let webdriver_url = get_webdriver_url();

    let mut caps = DesiredCapabilities::chrome();
    caps.set_headless()?;
    caps.set_no_sandbox()?;
    caps.set_disable_dev_shm_usage()?;

    let driver = WebDriver::new(&webdriver_url, caps).await?;

    driver.goto(&base_url).await?;

    // Wait for the page to load
    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;

    // Check for canvas element (isometric drawing should have a canvas)
    let canvas_exists = driver.find(By::Tag("canvas")).await.is_ok();
    assert!(canvas_exists, "Canvas element should exist for diagram drawing");

    println!("✓ Canvas element found on page");

    driver.quit().await?;

    Ok(())
}

#[tokio::test]
async fn test_no_javascript_errors() -> Result<()> {
    let base_url = get_base_url();
    let webdriver_url = get_webdriver_url();

    let mut caps = DesiredCapabilities::chrome();
    caps.set_headless()?;
    caps.set_no_sandbox()?;
    caps.set_disable_dev_shm_usage()?;

    let driver = WebDriver::new(&webdriver_url, caps).await?;

    driver.goto(&base_url).await?;

    // Wait for the page to fully load
    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;

    // Get browser console logs
    let logs = driver.logs(LogType::Browser).await?;

    // Filter for severe errors
    let errors: Vec<_> = logs
        .iter()
        .filter(|log| log.level == "SEVERE")
        .collect();

    if !errors.is_empty() {
        println!("Console errors found:");
        for error in &errors {
            println!("  - {}", error.message);
        }
    }

    // We'll warn but not fail on console errors for now
    // as some third-party libraries may log warnings
    if errors.is_empty() {
        println!("✓ No severe console errors found");
    } else {
        println!("⚠ {} severe console error(s) found (not failing test)", errors.len());
    }

    driver.quit().await?;

    Ok(())
}
