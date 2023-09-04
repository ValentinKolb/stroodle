# Stage 1: Build the React app using Vite
FROM node:16 AS build
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the React app using Vite
RUN npm run build

# Stage 2: Create a lightweight production image
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
