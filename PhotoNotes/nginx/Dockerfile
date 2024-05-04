FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/certs
COPY ./myphotonotes_tech /etc/nginx/certs
COPY nginx.conf /etc/nginx/conf.d
