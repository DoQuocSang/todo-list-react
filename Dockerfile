FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.14.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN yarn build

FROM nginx:alpine
RUN apk add --no-cache iputils
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
