
FROM node:20-alpine AS base


FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app


COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps


FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./

RUN npm install -g @nestjs/cli && npm install --legacy-peer-deps
COPY . .


RUN nest build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs


COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nestjs

EXPOSE 4000

ENV PORT=4000

CMD ["npm", "run", "start:prod"]

