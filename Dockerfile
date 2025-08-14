# Use the official Node.js runtime as the base image
FROM node:22 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package files for the monorepo
COPY package*.json ./
COPY packages/fossflow-lib/package*.json ./packages/fossflow-lib/
COPY packages/fossflow-app/package*.json ./packages/fossflow-app/

#Update NPM
RUN npm install -g npm@11.5.2

# Install dependencies for the entire workspace
RUN npm install

# Copy the entire monorepo code
COPY . .

# Build the library first, then the app
RUN npm run build:lib && npm run build:app

# Use Node with nginx for production
FROM node:22-alpine

# Install nginx
RUN apk add --no-cache nginx

# Copy backend code
COPY --from=build /app/packages/fossflow-backend /app/packages/fossflow-backend

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/packages/fossflow-app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create data directory for persistent storage
RUN mkdir -p /data/diagrams

# Expose ports
EXPOSE 80 3001

# Environment variables with defaults
ENV ENABLE_SERVER_STORAGE=true
ENV STORAGE_PATH=/data/diagrams
ENV BACKEND_PORT=3001

# Start services
ENTRYPOINT ["/docker-entrypoint.sh"]