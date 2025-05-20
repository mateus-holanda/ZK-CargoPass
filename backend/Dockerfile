FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./

COPY . .

RUN apt-get update && apt-get install -y openssl

RUN npm install

RUN npm run build

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start"]