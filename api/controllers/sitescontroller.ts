import { RouterContext, helpers } from "../deps.ts";
import { SiteParam, createSite, deleteSite, getSite, getSites, updateSite } from "../db/sites.ts";

export const sitesController = {
  async getAll(ctx: RouterContext<string>) {
    ctx.response.body = await getSites();
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = await getSite(id);
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
    ctx.response.body = await createSite(reqBody as SiteParam);
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
    ctx.response.body = await updateSite(id, reqBody as SiteParam);
    if (ctx.response.body && "errors" in ctx.response.body) {
      ctx.response.status = 400;
    }
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = await deleteSite(id);
  },
}