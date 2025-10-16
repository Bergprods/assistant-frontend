### Build stage
FROM node:20-alpine AS builder
 WORKDIR /app
 COPY package.json package-lock.json* ./
 COPY . .
# Install all dependencies (including dev) so build tools like vite and tailwind are available
RUN npm ci || npm install
RUN npm run build

### Production stage
FROM nginx:stable-alpine
 COPY --from=builder /app/dist /usr/share/nginx/html
 COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
