import postgres from "https://deno.land/x/postgresjs@v3.3.4/mod.js"

const sql = postgres({
  host: Deno.env.get("PG_SERVER"),
  port: parseInt(Deno.env.get("PG_PORT")??"5432", 10),
  database: Deno.env.get("PG_DATABASE"),
  username: Deno.env.get("PG_USER"),
  password: Deno.env.get("PG_PASSWORD")
});

export default sql;