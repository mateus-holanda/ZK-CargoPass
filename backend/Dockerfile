FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start"]