#!/bin/bash

# Helper script to run E2E tests locally

set -e

SELENIUM_CONTAINER="fossflow-selenium"
APP_PORT=3000
SELENIUM_PORT=4444

echo "FossFLOW E2E Test Runner"


# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed."
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 from https://www.python.org/"
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    echo "Please install pip3"
    exit 1
fi

# Start Selenium container if not running
if [ ! "$(docker ps -q -f name=$SELENIUM_CONTAINER)" ]; then
    echo "Starting Selenium Chrome container..."
    docker run -d --rm \
        --name $SELENIUM_CONTAINER \
        -p $SELENIUM_PORT:4444 \
        -p 7900:7900 \
        --shm-size="2g" \
        selenium/standalone-chrome:latest

    echo "Waiting for Selenium to be ready..."
    timeout 60 bash -c "until curl -sf http://localhost:$SELENIUM_PORT/status > /dev/null; do sleep 2; done" || {
        echo "❌ Selenium failed to start"
        docker logs $SELENIUM_CONTAINER
        docker stop $SELENIUM_CONTAINER
        exit 1
    }
    echo "Selenium is ready"
else
    echo "Selenium container is already running"
fi

# Check if FossFLOW is running
if ! curl -sf http://localhost:$APP_PORT > /dev/null; then
    echo "⚠️  FossFLOW app is not running on port $APP_PORT"
    echo "Please start it with: npm run dev"
    echo ""
    read -p "Start the app now in another terminal and press Enter to continue..."
fi

# Verify app is accessible
if ! curl -sf http://localhost:$APP_PORT > /dev/null; then
    echo "❌ FossFLOW app is still not accessible on http://localhost:$APP_PORT"
    docker stop $SELENIUM_CONTAINER 2>/dev/null || true
    exit 1
fi

echo "✅ FossFLOW app is accessible"
echo ""

# Install Python dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Run tests
echo "Running E2E tests..."
echo ""

FOSSFLOW_TEST_URL="http://localhost:$APP_PORT" \
WEBDRIVER_URL="http://localhost:$SELENIUM_PORT" \
pytest -v --tb=short "$@"

TEST_RESULT=$?

# Deactivate venv
deactivate

# Cleanup
echo ""
echo "Cleaning up..."
docker stop $SELENIUM_CONTAINER 2>/dev/null || true

if [ $TEST_RESULT -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
else
    echo ""
    echo "❌ Some tests failed"
    exit $TEST_RESULT
fi
