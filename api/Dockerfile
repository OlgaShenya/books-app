# Build stage is not needed for a simple Node app, but we use multi-stage
# anyway to keep the image clean and reproducible.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Runtime image ─────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/
COPY package.json ./

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000

CMD ["node", "src/app.js"]
