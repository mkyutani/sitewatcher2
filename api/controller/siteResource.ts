import { RouterContext, helpers } from "../deps.ts";
import { SiteResourceParam } from "../model/siteResource.ts";
import { siteResourceService } from "../service/siteResource.ts";
import { convertToBoolean, isUuid } from "../util.ts";

export const siteResourceController = {
  async create(ctx:RouterContext<string>) {
    const { id, initial } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const reqBodyRaw = await ctx.request.body();
    const initial_flag = convertToBoolean(initial);
    ctx.assert(initial_flag != null, 400, "Invalid initial flag"); 
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(reqBody.uri, 400, "Uri is missing");
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.reason, 400, "Reason is missing");
    const result = await siteResourceService.create(id, reqBody as SiteResourceParam, initial_flag);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async getAll(ctx: RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const result = await siteResourceService.getAll(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  }
}