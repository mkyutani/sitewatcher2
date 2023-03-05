FROM node:19.7.0-bullseye-slim as base
WORKDIR /app
RUN chown -R node:node /app && chmod -R 770 /app

FROM base AS builder
COPY --chown=node:node . .
RUN npm i --loglevel warn
RUN npm run build
USER node

FROM base as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node ./package*.json ./
COPY --chown=node:node ./tsconfig*.json ./
COPY --chown=node:node ./typeOrm.config.ts ./
RUN npm i --only=production
USER node

EXPOSE 3000

CMD [ "node", "./dist/src/main.js" ]
