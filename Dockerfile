# Production Dockerfile for Hermes Sentinel Hub (Nitro server)
FROM node:22-alpine AS runner

WORKDIR /app

# Copy built output from local build
COPY .output ./output
COPY package.json ./

# Install production dependencies if needed
RUN npm install --omit=dev 2>/dev/null || true

# Expose port
EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Start Nitro server
CMD ["node", ".output/server/index.mjs"]
