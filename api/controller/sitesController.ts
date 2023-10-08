import { RouterContext, helpers } from "../deps.ts";
import { SiteParam } from "../model/sites.ts";
import { siteService } from "../service/sites.ts";

export const siteController = {
  async getAll(ctx: RouterContext<string>) {
    const { name, strict, sort } = helpers.getQuery(ctx, { mergeParams: true });
    const strict_lower = (strict !== void 0) ? strict.toLowerCase() : "false";
    const strict_flag = (strict_lower === "true") ? true : ((strict_lower === "false") ? false : null);
    ctx.assert(strict_flag != null, 400, "Invalid strict value"); 
    const result = await siteService.getAll(name, strict_flag, sort);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async getResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.getResources(id);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async create(ctx:RouterContext<string>) {
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(reqBody.uri, 400, "Uri is missing");
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.type, 400, "Type is missing");
    ctx.assert(reqBody.enabled, 400, "Enabled is missing");
    const result = await siteService.create(reqBody as SiteParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    const result = await siteService.update(id, reqBody as SiteParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async updateResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.updateResources(id);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.delete(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = null;
  },
  async deleteResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.deleteResources(id);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = null;
  },
}