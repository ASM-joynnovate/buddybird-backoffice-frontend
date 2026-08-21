FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS deps

RUN corepack enable

COPY .yarn .yarn
COPY .yarnrc.yml package.json yarn.lock ./

RUN yarn install --immutable

FROM base AS builder

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

RUN yarn build

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir .next
RUN chown node:node .next

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

HEALTHCHECK \
    --interval=30s \
    --timeout=30s \
    --start-period=5s \
    --retries=3 \
    CMD wget -qO /dev/null http://localhost:3000/api/healthz || exit 1

CMD ["node", "server.js"]
