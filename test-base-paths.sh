#!/bin/bash
# Test FossFLOW deployment at different base paths
# This simulates how the app will be served on GitHub Pages or other platforms with subpaths

set -e

echo "Testing FossFLOW at multiple base paths..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base paths to test
BASE_PATHS=("/" "/fossflow" "/apps/fossflow" "/my-org/projects/fossflow")

# Function to cleanup
cleanup() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"

    # Stop any running containers
    docker stop nginx-test 2>/dev/null || true
    docker rm nginx-test 2>/dev/null || true
    docker stop selenium-test 2>/dev/null || true
    docker rm selenium-test 2>/dev/null || true

    # Kill any local servers
    if [ -f /tmp/server.pid ]; then
        kill $(cat /tmp/server.pid) 2>/dev/null || true
        rm /tmp/server.pid
    fi
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Function to test a specific base path
test_base_path() {
    local BASE_PATH=$1
    echo -e "\n${YELLOW}Testing base path: ${BASE_PATH}${NC}"

    # Clean up any previous test
    docker stop nginx-test 2>/dev/null || true
    docker rm nginx-test 2>/dev/null || true

    # Build the app with the specific PUBLIC_URL
    echo "Building app with PUBLIC_URL=${BASE_PATH}..."
    PUBLIC_URL="${BASE_PATH}" npm run build:app

    # Create nginx config for this base path
    if [ "$BASE_PATH" = "/" ]; then
        LOCATION_PATH="/"
        ALIAS_PATH="/usr/share/nginx/html/"
    else
        LOCATION_PATH="${BASE_PATH%/}/"
        ALIAS_PATH="/usr/share/nginx/html/"
    fi

    cat > /tmp/nginx.conf <<EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location ${LOCATION_PATH} {
            alias ${ALIAS_PATH};
            try_files \$uri \$uri/ ${LOCATION_PATH}index.html;

            location ~ \\.css$ {
                add_header Content-Type text/css;
            }
            location ~ \\.js$ {
                add_header Content-Type application/javascript;
            }
            location ~ \\.json$ {
                add_header Content-Type application/json;
            }
        }
    }
}
EOF

    # Start nginx container
    echo "Starting nginx server..."
    docker run -d \
        --name nginx-test \
        -p 3001:80 \
        -v $(pwd)/packages/fossflow-app/build:/usr/share/nginx/html:ro \
        -v /tmp/nginx.conf:/etc/nginx/nginx.conf:ro \
        nginx:alpine

    # Wait for nginx to be ready
    echo "Waiting for nginx to be ready..."
    sleep 2

    # Test if the app is accessible
    if curl -sf "http://localhost:3001${BASE_PATH}" > /dev/null; then
        echo -e "${GREEN}✓ App accessible at http://localhost:3001${BASE_PATH}${NC}"
    else
        echo -e "${RED}✗ App NOT accessible at http://localhost:3001${BASE_PATH}${NC}"
        echo "Nginx logs:"
        docker logs nginx-test
        return 1
    fi

    # Run E2E tests if Selenium is available
    if docker ps | grep selenium-test > /dev/null; then
        echo "Running E2E tests..."
        FOSSFLOW_TEST_URL="http://localhost:3001${BASE_PATH}" \
        FOSSFLOW_BASE_PATH="${BASE_PATH}" \
        WEBDRIVER_URL="http://localhost:4444" \
        pytest tests/test_base_path_routing.py -v --tb=short || {
            echo -e "${RED}✗ E2E tests failed for base path: ${BASE_PATH}${NC}"
            return 1
        }
        echo -e "${GREEN}✓ E2E tests passed for base path: ${BASE_PATH}${NC}"
    else
        echo -e "${YELLOW}Selenium not running, skipping E2E tests${NC}"
        echo "To run E2E tests, start Selenium first:"
        echo "  docker run -d --name selenium-test --network host selenium/standalone-chrome:latest"
    fi

    # Clean up this test's nginx
    docker stop nginx-test 2>/dev/null || true
    docker rm nginx-test 2>/dev/null || true

    return 0
}

# Main execution
echo "Setting up test environment..."

# Check if Selenium is running, offer to start it
if ! docker ps | grep selenium > /dev/null; then
    echo -e "${YELLOW}Selenium is not running. Would you like to start it for E2E tests? (y/n)${NC}"
    read -r response
    if [[ "$response" == "y" ]]; then
        echo "Starting Selenium..."
        docker run -d \
            --name selenium-test \
            --network host \
            --shm-size=2g \
            selenium/standalone-chrome:latest

        echo "Waiting for Selenium to be ready..."
        timeout 30 bash -c 'until curl -sf http://localhost:4444/status > /dev/null 2>&1; do sleep 2; done' || {
            echo -e "${RED}Selenium failed to start${NC}"
            exit 1
        }
        echo -e "${GREEN}✓ Selenium is ready${NC}"
    fi
fi

# Test each base path
FAILED_PATHS=()
for BASE_PATH in "${BASE_PATHS[@]}"; do
    if ! test_base_path "$BASE_PATH"; then
        FAILED_PATHS+=("$BASE_PATH")
    fi
done

# Summary
echo -e "\n========================================="
echo "Test Summary:"
echo "========================================="
if [ ${#FAILED_PATHS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All base paths tested successfully!${NC}"
    echo "Tested paths: ${BASE_PATHS[*]}"
else
    echo -e "${RED}✗ Some base paths failed:${NC}"
    for path in "${FAILED_PATHS[@]}"; do
        echo "  - $path"
    done
    echo -e "\n${YELLOW}This indicates the app may not work correctly when deployed to GitHub Pages or other subpath deployments.${NC}"
    exit 1
fi