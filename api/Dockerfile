FROM denoland/deno:debian-1.32.3 AS base
RUN mkdir /app
RUN chown -R deno:deno /deno-dir && chmod -R 770 /deno-dir
RUN chown -R deno:deno /app && chmod -R 770 /app

FROM base AS dev
WORKDIR /app
COPY --chown=deno:deno . /app
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]

FROM base as production
WORKDIR /app
COPY --chown=deno:deno . /app
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]