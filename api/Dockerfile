FROM node:19.7.0-bullseye-slim AS base
WORKDIR /app
RUN chown -R node:node /app && chmod -R 770 /app

FROM base AS builder
COPY --chown=node:node . .
RUN npm i --loglevel warn
RUN npm run build

FROM base AS developer
COPY --chown=node:node . .
RUN npm i

FROM developer AS development
COPY --chown=node:node --from=developer /app .
RUN npm i @nestjs/cli
USER node
EXPOSE 3000
CMD [ "npm", "run", "start" ]

FROM developer AS unittest
COPY --chown=node:node --from=developer /app .
RUN npm i jest
USER node
CMD [ "npm", "run", "test" ]

FROM developer AS e2etest
COPY --chown=node:node --from=developer /app .
COPY --chown=node:node ./package*.json ./
COPY --chown=node:node ./tsconfig*.json ./
RUN npm i jest
USER node
CMD [ "npm", "run", "test:e2e" ]

FROM builder AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node ./package*.json ./
COPY --chown=node:node ./tsconfig*.json ./
RUN npm i --only=${NODE_ENV}
USER node
EXPOSE 3000
CMD [ "node", "./dist/src/main.js" ]
