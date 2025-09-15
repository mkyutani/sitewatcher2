import { Context } from "../deps.ts";

/**
 * CORS Middleware for Oak framework
 * Cross-Origin Resource Sharing support for API requests
 */
export const corsMiddleware = async (ctx: Context, next: () => Promise<unknown>) => {
  // Set CORS headers
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods", 
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers", 
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  ctx.response.headers.set("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS requests
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  await next();
};
