# base image
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY ./app/ .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]