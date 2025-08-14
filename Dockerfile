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

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/packages/fossflow-app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]