FROM node:12.20.1

WORKDIR /app

COPY package.json yarn.lock ./

COPY . .

RUN yarn

CMD ["yarn", "dev"]