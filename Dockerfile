FROM nginx:alpine

# Copy website files
COPY index.html quiz.html result.html /usr/share/nginx/html/
COPY css/style.css /usr/share/nginx/html/css/
COPY js/questions.js /usr/share/nginx/html/js/
COPY js/app.js /usr/share/nginx/html/js/
COPY assets/README.md /usr/share/nginx/html/assets/

# Configure Nginx for OpenShift
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf \
    && mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp \
    && chgrp -R 0 /var/cache/nginx /var/run /var/log/nginx \
    && chmod -R g=u /var/cache/nginx /var/run /var/log/nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]