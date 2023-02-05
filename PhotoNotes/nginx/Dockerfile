from nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/certs
COPY ./self_signed_ssl /etc/nginx/certs
COPY nginx.conf /etc/nginx/conf.d
