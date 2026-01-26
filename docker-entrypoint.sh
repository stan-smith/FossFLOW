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

# Configure HTTP Basic Auth
if [ -n "$HTTP_AUTH_USER" ] && [ -n "$HTTP_AUTH_PASSWORD" ]; then
    echo "Setup HTTP Basic Auth..."
    echo "$HTTP_AUTH_USER:$(openssl passwd -apr1 $HTTP_AUTH_PASSWORD)" > /etc/nginx/.htpasswd
    sed -i 's/AUTH_BASIC_SETTING/"Restricted"/g' /etc/nginx/http.d/default.conf
else
    echo "No HTTP Basic Auth configured"
    sed -i 's/AUTH_BASIC_SETTING/off/g' /etc/nginx/http.d/default.conf
fi
echo "Starting nginx..."
nginx -g "daemon off;"
