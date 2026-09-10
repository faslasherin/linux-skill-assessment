FROM nginx:alpine

COPY index.html quiz.html result.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

RUN rm -f /etc/nginx/conf.d/default.conf && \
    printf '%s\n' \
    'pid /tmp/nginx.pid;' \
    'events {}' \
    'http {' \
    '    include /etc/nginx/mime.types;' \
    '    default_type application/octet-stream;' \
    '    access_log /dev/stdout;' \
    '    error_log /dev/stderr;' \
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
    '    }' \
    '}' > /etc/nginx/nginx.conf

EXPOSE 8080

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]