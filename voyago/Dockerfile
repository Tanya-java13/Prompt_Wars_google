FROM node:22

WORKDIR /app

# Install build tools for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install all dependencies
RUN npm install

# Copy source
COPY client/ ./client/
COPY server/ ./server/

# Build React client
RUN npm run build --workspace=client

# Build Express server
RUN npm run build --workspace=server

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "server/dist/index.js"]
