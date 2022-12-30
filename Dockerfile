# Stage 1

FROM node:lts-slim as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install
RUN npm install -g @angular/cli
RUN ng build --configuration production

# Stage 2

FROM nginx:alpine

COPY --from=build /usr/local/app/dist/biblioteca-frontend /usr/share/nginx/html
COPY --from=build /usr/local/app/nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
