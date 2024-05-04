import { RouterContext, helpers } from "../deps.ts";
import { SiteParam } from "../model/site.ts";
import { siteService } from "../service/site.ts";
import { convertToBoolean, convertToJson, isUuid } from "../util.ts";

export const siteController = {
  async create(ctx:RouterContext<string>) {
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw, 400, "No data")
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    let reqBody;
    try {
      reqBody = await reqBodyRaw.value;
    } catch (error) {
      ctx.assert(false, 400, "Invalid JSON");
    }
    ctx.assert(reqBody, 400, "Data is empty");
    ctx.assert(reqBody.uri, 400, "Uri is missing");
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.directory, 400, "Directory is missing");
    ctx.assert(isUuid(reqBody.directory), 400, "Invalid directory id");
    const result = await siteService.create(reqBody as SiteParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await siteService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async list(ctx: RouterContext<string>) {
    const result = await siteService.list();
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    let reqBody;
    try {
      reqBody = await reqBodyRaw.value;
    } catch (error) {
      ctx.assert(false, 400, "Invalid JSON");
    }
    ctx.assert(reqBody, 400, "No data");
    if (reqBody.directory) {
      ctx.assert(isUuid(reqBody.directory), 400, "Invalid directory id");
    }
    const result = await siteService.update(id, reqBody as SiteParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await siteService.delete(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = null;
  }
}