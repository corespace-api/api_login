FROM alpine:latest
LABEL org.opencontainers.image.maintainer="AsP3X"
LABEL org.opencontainers.image.name="login"

# -- Installing basic dependencies
RUN apk update && apk upgrade
RUN apk add --no-cache bash curl nano wget tzdata
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# -- Set timezone to Universal Time
RUN cp /usr/share/zoneinfo/UTC /etc/localtime
RUN echo "UTC" > /etc/timezone

# -- Presetup for NodeJS 
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.12.0
RUN mkdir -p $NVM_DIR

# -- Installing NVM
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

# -- Installing NodeJS
RUN apk add --no-cache nodejs npm
RUN npm install -g yarn

WORKDIR /service

# -- Installing service dependencies
COPY package.json /service/package.json
COPY yarn.lock /service/yarn.lock
RUN yarn install

# -- Copying service files
COPY service.js /service/service.js
COPY assets/ /service/assets/
COPY routes /service/routes/
COPY service-config.json /service/service-config.json

CMD [ "yarn", "start" ]