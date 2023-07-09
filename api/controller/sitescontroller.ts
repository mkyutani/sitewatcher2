import { RouterContext, helpers } from "../deps.ts";
import { siteService, createParam, updateParam } from "../service/sites.ts";

export const sitesController = {
  async getAll(ctx: RouterContext<string>) {
    ctx.response.body = await siteService.getAll();
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = await siteService.get(id);
    if (!ctx.response.body) {
      ctx.response.status = 404;
    }
  },
  async getLinks(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = await siteService.getLinks(id);
  },
  async create(ctx:RouterContext<string>) {
    if(!ctx.request.hasBody) {
      ctx.throw(415);
    }
    const reqBodyRaw = await ctx.request.body({ type: 'json' });
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.source, 400, "Source is missing");
    ctx.assert(reqBody.type, 400, "Type is missing");
    ctx.response.body = await siteService.create(reqBody as createParam);
    if (ctx.response.body && "errors" in ctx.response.body) {
      ctx.response.status = 400;
    }
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    if(!ctx.request.hasBody) {
      ctx.throw(415);
    }
    const reqBodyRaw = await ctx.request.body({ type: 'json' });
    const reqBody = await reqBodyRaw.value;
    ctx.response.body = await siteService.update(id, reqBody as updateParam);
    if (ctx.response.body && "errors" in ctx.response.body) {
      ctx.response.status = 400;
    }
  },
  async updateLinks(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = await siteService.updateLinks(id);
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = await siteService.delete(id);
  },
}