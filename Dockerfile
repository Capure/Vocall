FROM node:lts

COPY . .

RUN yarn add ffmpeg-static

RUN yarn build

CMD yarn start