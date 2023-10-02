FROM node:18

WORKDIR /usr/src/api-energy-station

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]
