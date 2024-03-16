FROM node:20 AS build

ENV FRONTEND=/opt/frontend

WORKDIR $FRONTEND

COPY package.json package-lock.json ./

RUN npm config set registry https://registry.npmmirror.com

RUN npm install

COPY . .

RUN npm run build

FROM nginx

ENV HOME=/opt/app

WORKDIR $HOME

COPY --from=build /opt/frontend/build dist

COPY nginx /etc/nginx/conf.d

EXPOSE 80
