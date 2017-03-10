FROM postgres:9.6.2-alpine

RUN apk update \
&& apk upgrade \
&& apk add -q alpine-sdk \
&& apk add -q vim \
&& apk add -q nano;

ADD seed.sh /docker-entrypoint-initdb.d/
