# Multi-stage: build the static site with Node, then serve it with a tiny nginx.
# The final image is just nginx + static files (~25 MB), no Node runtime.

# ---- build ----
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- serve ----
FROM nginx:alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# nginx:alpine's default entrypoint starts the server.
