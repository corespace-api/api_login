FROM zombymediaic/nodejs:v19.5.0-alpine
LABEL org.opencontainers.image.maintainer="AsP3X"
LABEL org.opencontainers.image.name="LOGIN"

WORKDIR /service

RUN yarn set version berry

# -- Installing service dependencies
COPY package.json /service/package.json
COPY yarn.lock /service/yarn.lock
RUN yarn install

# -- Copying service files
COPY service.js /service/service.js
COPY assets/ /service/assets/
COPY routes /service/routes/
COPY config.json /service/config.json

EXPOSE 3000

CMD [ "yarn", "start" ]