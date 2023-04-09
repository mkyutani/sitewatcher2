import { serve } from "./deps.ts"

const port = Deno.env.get("API_PORT");

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;
  console.log(body);

  return new Response(body, { status: 200 });
};

await serve(handler, { port });