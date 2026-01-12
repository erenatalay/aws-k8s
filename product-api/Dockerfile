
FROM node:20-alpine AS base


FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app


COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps


FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .


RUN npx prisma generate


RUN npm run build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DOCKER=true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs


COPY --chown=nestjs:nodejs --from=builder /app/dist ./dist
COPY --chown=nestjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=builder /app/package.json ./package.json
COPY --chown=nestjs:nodejs --from=builder /app/prisma ./prisma
COPY --chown=nestjs:nodejs --from=builder /app/generated ./generated


COPY --chown=nestjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh


RUN chmod 1777 /tmp

USER nestjs

EXPOSE 3002

ENV PORT=3002

ENTRYPOINT ["./docker-entrypoint.sh"]
