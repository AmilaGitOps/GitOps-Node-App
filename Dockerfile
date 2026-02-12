# ---- Build deps stage ----
FROM node:20-alpine AS deps
WORKDIR /app

# Only copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copy installed deps from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY server.js ./server.js
# If you later add more files (routes/, src/, etc), change to:
# COPY . .

# Kubernetes/container best practice: run as non-root
RUN addgroup -S nodegrp -g 10001 && adduser -S nodeusr -G nodegrp -u 10001
USER 10001:10001

EXPOSE 3000

# Good k8s defaults: graceful shutdown support
CMD ["node", "server.js"]

