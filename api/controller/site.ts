import { RouterContext, helpers } from "../deps.ts";
import { SiteParam, SiteResourceParam, SiteRuleParam } from "../model/site.ts";
import { siteService } from "../service/site.ts";
import { getRange, isUuid } from "../util.ts";

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
    ctx.response.body = result;
  },
  async registerResource(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
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
    ctx.assert(reqBody.properties, 400, "Properties is missing");
    const result = await siteService.registerResource(id, reqBody as SiteResourceParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    if (Object.keys(result).length === 0) {
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async updateResource(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
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
    ctx.assert(reqBody.properties, 400, "Properties is missing");
    const result = await siteService.updateResource(id, reqBody as SiteResourceParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    if (Object.keys(result).length === 0) {
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async deleteResource(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
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
    const result = await siteService.deleteResource(id, reqBody as SiteResourceParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    if (Object.keys(result).length === 0) {
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async getAllResources(ctx: RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const result = await siteService.getAllResources(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async createOrUpdateRule(ctx:RouterContext<string>) {
    const { id, category, weight } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const weight_number = parseInt(weight);
    ctx.assert(!isNaN(weight_number), 400, "Weight must be a number");
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    let reqBody;
    try {
      reqBody = await reqBodyRaw.value;
    } catch (error) {
      ctx.assert(false, 400, "Invalid JSON");
    }
    ctx.assert(reqBody, 400, "No data");
    const result = await siteService.createOrUpdateRule(id, category, weight_number, reqBody as SiteRuleParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async deleteRule(ctx:RouterContext<string>) {
    const { id, category, range } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const range_value = getRange(range);
    ctx.assert(range_value, 400, "Invalid range");
    const min = range_value[0];
    const max = range_value[1];
    ctx.assert(min > 0 || max > 0, 400, "Invalid range");
    const result = await siteService.deleteRule(id, category, min, max);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = null;
  },
  async deleteRules(ctx:RouterContext<string>) {
    const { id, category } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await siteService.deleteRules(id, category);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = null;
  }
}