import { RouterContext, helpers } from "../deps.ts";
import { siteService, createParam, updateParam } from "../service/sites.ts";

export const sitesController = {
  async getAll(ctx: RouterContext<string>) {
    const result = await siteService.getAll();
    if (typeof result === "number") {
      ctx.response.status = result;
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.get(id);
    if (typeof result === "number") {
      ctx.response.status = result;
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async getResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.getResources(id);
    if (typeof result === "number") {
      ctx.response.status = result;
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async create(ctx:RouterContext<string>) {
    if(!ctx.request.hasBody) {
      ctx.throw(415);
    }
    const reqBodyRaw = await ctx.request.body({ type: 'json' });
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400,  "No data");
    ctx.assert(reqBody.uri, 400, "uri is missing");
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.type, 400, "Type is missing");
    ctx.assert(reqBody.enabled, 400, "Enabled is missing");
    const result = await siteService.create(reqBody as createParam);
    if (typeof result === "string") {
      ctx.response.status = 403;
      ctx.response.body = result;  
    } else if (typeof result === "number") {
      ctx.response.status = result;
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    if(!ctx.request.hasBody) {
      ctx.throw(415);
    }
    const reqBodyRaw = await ctx.request.body({ type: 'json' });
    const reqBody = await reqBodyRaw.value;
    const result = await siteService.update(id, reqBody as updateParam);
    if (typeof result === "number") {
      ctx.response.status = result;
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async updateResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.updateResources(id);
    if (typeof result === "number") {
      ctx.response.status = result;
    }
    ctx.response.body = null;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.delete(id);
    if (typeof result === "number") {
      ctx.response.status = result;
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async deleteResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.deleteResources(id);
    if (typeof result === "number") {
      ctx.response.status = result;
    }
    ctx.response.body = null;
  },
}