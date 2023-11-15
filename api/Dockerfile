FROM node:16

WORKDIR /app

ENV PORT 3000
ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .

RUN npm install

USER node

COPY . .

EXPOSE 3000

CMD ["node", "./src/index.js"]