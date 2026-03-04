FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

RUN mkdir -p /app/data && chown -R node:node /app/data
USER node

CMD ["node", "server.js"]