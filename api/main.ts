import { Application, log } from "./deps.ts"

await log.setup({
  handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: function(r: log.LogRecord) {
          return ["[" + r.levelName + "]", r.datetime.toISOString(), r.msg].join(" ");
        }
      })
  },
  loggers: {
      default: {
          level: "DEBUG",
          handlers: ["console"],
      }
  }
});

const app = new Application();

app.use((ctx) => {
  ctx.response.body = {
    ip: ctx.request.ip
  }
  log.debug(ctx.request.ip);
});

const port = Number(Deno.env.get("API_PORT")) || 8089;
log.info("listening on port " + port);
await app.listen({ port: port });