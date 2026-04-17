# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app/shopsense-ai
COPY shopsense-ai/package.json shopsense-ai/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app/shopsense-ai
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/shopsense-ai/node_modules ./node_modules
COPY shopsense-ai ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/shopsense-ai
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder /app/shopsense-ai/public ./public
COPY --from=builder /app/shopsense-ai/.next ./.next
COPY --from=builder /app/shopsense-ai/node_modules ./node_modules
COPY --from=builder /app/shopsense-ai/package.json ./package.json
COPY --from=builder /app/shopsense-ai/next.config.ts ./next.config.ts

USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start"]
