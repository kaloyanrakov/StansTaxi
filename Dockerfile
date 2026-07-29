# --- Build public site ---
FROM node:18-alpine AS build-public
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# --- Build driver-app (PWA) ---
FROM node:18-alpine AS build-driver
WORKDIR /app
ENV REACT_APP_API_URL=/api
COPY driver-app/package*.json ./
RUN npm install --legacy-peer-deps
COPY driver-app/ .
RUN npm run build

# --- Serve both from one nginx image ---
FROM nginx:alpine
COPY --from=build-public /app/build /usr/share/nginx/html/public
COPY --from=build-driver /app/build /usr/share/nginx/html/driver
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 81
CMD ["nginx", "-g", "daemon off;"]