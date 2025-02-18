FROM node:20.16.0-alpine

WORKDIR /src

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]