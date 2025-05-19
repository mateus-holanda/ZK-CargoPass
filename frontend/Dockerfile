FROM node:20

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start"]