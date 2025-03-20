FROM node:alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev"]