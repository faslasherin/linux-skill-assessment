FROM nginx:alpine

# OpenShift-compatible static Nginx container
# - Runs as non-root (OpenShift assigns arbitrary UID)
# - Listens on port 8080 (OpenShift route standard)
# - All writable paths use /tmp (PID, temp files, logs)
# - Static website files served from /usr/share/nginx/html

# Remove default config and create OpenShift-compatible nginx.conf
RUN rm -f /etc/nginx/conf.d/default.conf && \
    mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    printf '%s\n' \
    'pid /tmp/nginx.pid;' \
    'error_log /dev/stderr warn;' \
    'events { worker_connections 1024; }' \
    'http {' \
    '    include /etc/nginx/mime.types;' \
    '    default_type application/octet-stream;' \
    '    access_log /dev/stdout;' \
    '    sendfile on;' \
    '    keepalive_timeout 65;' \
    '    # All temp paths go to /tmp (writable by any UID)' \
    '    client_body_temp_path /tmp/client_temp;' \
    '    proxy_temp_path /tmp/proxy_temp;' \
    '    fastcgi_temp_path /tmp/fastcgi_temp;' \
    '    uwsgi_temp_path /tmp/uwsgi_temp;' \
    '    scgi_temp_path /tmp/scgi_temp;' \
    '    server {' \
    '        listen 8080;' \
    '        server_name _;' \
    '        root /usr/share/nginx/html;' \
    '        index index.html;' \
    '        location / {' \
    '            try_files $uri $uri/ /index.html;' \
    '        }' \
    '        # Cache static assets (CSS, JS, images)' \
    '        location ~* \.(css|js|svg|ico|png|jpg|jpeg|gif|webp)$ {' \
    '            expires 1y;' \
    '            add_header Cache-Control "public, immutable";' \
    '        }' \
    '    }' \
    '}' > /etc/nginx/nginx.conf

# Copy website files
COPY index.html quiz.html result.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 8080

# Nginx runs in foreground (required for containers)
# OpenShift handles the UID - no USER directive needed
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]

