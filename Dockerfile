# Linux Skill Assessment - Nginx Container
# Deploy to OpenShift or any Kubernetes cluster

FROM nginx:alpine

# Copy all website files to Nginx default serving directory
COPY index.html quiz.html result.html /usr/share/nginx/html/
COPY css/style.css /usr/share/nginx/html/css/
COPY js/questions.js /usr/share/nginx/html/js/
COPY js/app.js /usr/share/nginx/html/js/
COPY assets/README.md /usr/share/nginx/html/assets/

# Nginx configuration (optional - default works fine for static site)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Nginx in Alpine runs as non-root by default, use 8080 to avoid privilege issues
CMD ["nginx", "-g", "daemon off;"]
