# Stage 1: Build the Angular application
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci installs exactly what package-lock.json pins, so rebuilding the image
# later gives the same dependency tree; npm install may rewrite the lock file.
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# The image runs as root by default; serve the app as an unprivileged user instead.
RUN addgroup -g 1001 -S webuser && \
    adduser -u 1001 -S webuser -G webuser

COPY --from=build --chown=webuser:webuser /app/dist /usr/share/nginx/html
COPY --chown=webuser:webuser nginx.conf /etc/nginx/conf.d/default.conf

# Paths nginx writes to at runtime are root-owned in the base image. The pid file
# is handed over rather than moved: the bundled /etc/nginx/nginx.conf already sets
# `pid`, and overriding it through `-g` fails with "pid directive is duplicate".
# /var/log/nginx is left alone - access.log and error.log are symlinks to
# stdout/stderr, which any user can write to.
RUN mkdir -p /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/cache/nginx /var/run/nginx.pid /usr/share/nginx/html

USER webuser

# Ports below 1024 require root, so nginx.conf listens on 8080 - keep both in sync.
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
