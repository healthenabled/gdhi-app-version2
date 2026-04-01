FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN corepack enable
RUN HUSKY=0 yarn install --immutable

COPY . .

RUN yarn build

FROM nginx:1.27-alpine AS runtime

WORKDIR /app

ENV PORT=8080
ENV BACKEND_UPSTREAM=http://127.0.0.1:8888

COPY docker/entrypoint.sh /entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
