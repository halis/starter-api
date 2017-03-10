FROM node:7.7.1-alpine

ENV NODE_ENV=production

RUN mkdir -p /usr/local/api \
&& apk update \
&& apk upgrade \
&& apk add -q alpine-sdk \
&& apk add -q vim \
&& apk add -q nano;

WORKDIR /usr/local/api

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY key.pem key.pem
COPY cert.pem cert.pem
COPY ./lib ./lib

RUN yarn

EXPOSE 443
ENTRYPOINT ["npm", "start"]
