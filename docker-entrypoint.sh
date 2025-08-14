#!/bin/sh

# Start Node.js backend if server storage is enabled
if [ "$ENABLE_SERVER_STORAGE" = "true" ]; then
    echo "Starting FossFLOW backend server..."
    cd /app/packages/fossflow-backend
    npm install --production
    node server.js &
    echo "Backend server started"
else
    echo "Server storage disabled, backend not started"
fi

# Start nginx
echo "Starting nginx..."
nginx -g "daemon off;"