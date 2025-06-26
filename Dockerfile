FROM node:24.3.0 AS builder
WORKDIR /app

ARG MODE

ENV MODE=${MODE}

COPY . .
RUN yarn install
RUN yarn run build --mode $MODE

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]