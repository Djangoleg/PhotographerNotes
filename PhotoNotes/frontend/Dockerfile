from nginx:latest

COPY ./build /var/www
RUN mkdir -p /etc/nginx/certs
COPY ./myphotonotes_tech /etc/nginx/certs
COPY nginx.conf /etc/nginx/nginx.conf
