FROM node:18

WORKDIR /app

# Install netcat for DB readiness checks
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 8000

# Use nodemon for hot reload
CMD ["npm", "run", "dev"]
