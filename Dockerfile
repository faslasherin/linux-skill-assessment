FROM nginx:alpine

# Copy website files
COPY index.html quiz.html result.html /usr/share/nginx/html/
COPY css/style.css /usr/share/nginx/html/css/
COPY js/questions.js /usr/share/nginx/html/js/
COPY js/app.js /usr/share/nginx/html/js/
COPY assets/README.md /usr/share/nginx/html/assets/

# Configure Nginx to listen on port 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]