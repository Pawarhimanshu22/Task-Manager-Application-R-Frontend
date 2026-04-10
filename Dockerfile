# Stage 1: Build the React App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json only (not lock file — avoids Windows/Linux binary mismatch)
COPY package.json ./

# Fresh install for Linux platform
RUN npm install --silent

# Copy all source code
COPY . .

# Build React app → outputs to /app/dist
RUN npm run build


# Stage 2: Serve via Nginx
FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Write our config — handles React routing
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf

# Copy built files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]