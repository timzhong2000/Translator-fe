# build image
FROM node:14 as build
RUN npm i -g pnpm
WORKDIR /build

COPY package*.json pnpm-lock.yaml pre-install.sh /build/
COPY public /build/public
RUN sh pre-install.sh
RUN pnpm install

COPY . /build
RUN pnpm run build

# deploy image
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /build/dist/ /www/translator-fe
