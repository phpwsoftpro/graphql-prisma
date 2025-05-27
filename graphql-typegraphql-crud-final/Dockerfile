FROM node:18

WORKDIR /app

# Install netcat for DB readiness checks
RUN apt-get update && apt-get install -y netcat-openbsd

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install
RUN npx prisma generate

EXPOSE 8000

CMD ["pnpm", "dev"]
