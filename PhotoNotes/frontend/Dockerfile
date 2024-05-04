FROM nginx:latest
COPY ./build /var/www
RUN mkdir -p /etc/nginx/certs
COPY ./self_signed_ssl /etc/nginx/certs
COPY nginx.conf /etc/nginx/nginx.conf
