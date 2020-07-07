FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 5004

CMD [ "npm", "run", "dev" ]