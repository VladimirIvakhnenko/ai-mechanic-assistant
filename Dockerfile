# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci --prefer-offline --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps --link /app/node_modules ./node_modules
COPY --link . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder --link /app/next.config.js ./
COPY --from=builder --link /app/public ./public
COPY --from=builder --link --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --link /app/node_modules ./node_modules
COPY --from=builder --link /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
