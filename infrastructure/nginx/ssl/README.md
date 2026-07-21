# AegisIQ — Nginx SSL Configuration
# Place SSL certificates in this directory for production use.
#
# For development/self-signed certificates, run:
#   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#     -keyout ssl/selfsigned.key -out ssl/selfsigned.crt \
#     -subj "/CN=localhost/O=AegisIQ/C=US"
#
# Then uncomment the HTTPS server block in nginx.conf

# Files expected in this directory:
#   selfsigned.crt   — SSL certificate
#   selfsigned.key   — SSL private key
#
# For production, use Let's Encrypt:
#   certbot certonly --webroot -w /var/www/html -d app.aegisiq.io
