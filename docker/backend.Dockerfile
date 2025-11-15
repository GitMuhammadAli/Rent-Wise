FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy source
COPY server ./server

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=3600

EXPOSE 3600

CMD ["npm", "start"]

