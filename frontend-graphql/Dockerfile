# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY app-crm/package*.json ./

# Install dependencies
RUN npm install

# ✅ Install the refine simple-rest provider
RUN npm install @refinedev/simple-rest

# Copy the rest of the app
COPY app-crm .

# Expose Vite dev port
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev", "--", "--host"]
