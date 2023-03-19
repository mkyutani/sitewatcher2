FROM node:19.7.0-bullseye-slim as base
WORKDIR /app
RUN chown -R node:node /app && chmod -R 770 /app

FROM base AS development
COPY --chown=node:node . .
RUN npm i
RUN npm i -g @nestjs/cli
USER node
EXPOSE 3000
CMD [ "npm", "run", "start" ]

FROM base AS ut
COPY --chown=node:node . .
RUN npm i
RUN npm i -g @nestjs/cli
RUN npm i jest
USER node
EXPOSE 3000
CMD [ "npm", "run", "test" ]

FROM base AS builder
COPY --chown=node:node . .
RUN npm i --loglevel warn
RUN npm run build

FROM base as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node ./package*.json ./
COPY --chown=node:node ./tsconfig*.json ./
COPY --chown=node:node ./typeOrm.config.ts ./
RUN npm i --only=${NODE_ENV}
USER node
EXPOSE 3000
CMD [ "node", "./dist/src/main.js" ]
