FROM node:lts

COPY . .

RUN yarn build

CMD yarn start