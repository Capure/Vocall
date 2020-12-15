FROM node:lts

COPY . .

USER root

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm -g config set user root

RUN npm install -g ffmpeg-static

RUN yarn build

CMD yarn start