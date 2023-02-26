FROM node:19.7.0-bullseye-slim as development
WORKDIR /app
COPY ./tsconfig*.json .
COPY ./package*.json .
RUN npm i
COPY . /app
RUN npm run build

FROM node:19.7.0-bullseye-slim as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY ./package*.json .
RUN npm i --omit=dev
COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
