FROM alpine:latest
LABEL org.opencontainers.image.maintainer="AsP3X"
LABEL org.opencontainers.image.name="healthcheck"

RUN apk update && apk upgrade
RUN apk add --no-cache bash curl nano wget
RUN apk add --no-cache nodejs npm
RUN npm install -g nvm yarn

RUN nvm install 16.6.1
RUN nvm use 16.6.1

SHELL ["/bin/bash", "-c"]