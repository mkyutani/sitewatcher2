import { RouterContext, helpers } from "../deps.ts";

export const sitesController = {
  getAll(ctx: RouterContext<string>) {
    ctx.response.body = "GET /api/v1/sites";
  },
  get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `GET /api/v1/sites/${id}`;
  },
  create(ctx:RouterContext<string>) {
    ctx.response.body = "POST /api/v1/sites/";
  },
  update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `PUT /api/v1/sites/${id}`;
  },
  delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `DELETE /api/v1/sites/${id}`;
  },
}