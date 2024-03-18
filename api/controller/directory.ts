import { RouterContext, helpers, log } from "../deps.ts";
import { DirectoryParam } from "../model/directory.ts";
import { directoryService } from "../service/directory.ts";
import { convertToBoolean, isUuid } from "../util.ts";

export const directoryController = {
  async create(ctx:RouterContext<string>) {
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw, 400, "No data")
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "Data is empty");
    ctx.assert(reqBody.name, 400, "Name is missing");
    const result = await directoryService.create(reqBody as DirectoryParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await directoryService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async getAll(ctx: RouterContext<string>) {
    const { name, strict } = helpers.getQuery(ctx, { mergeParams: true });
    const strict_flag = convertToBoolean(strict);
    ctx.assert(strict_flag != null, 400, "Invalid strict flag"); 
    const result = await directoryService.getAll(name, strict_flag);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async getSites(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await directoryService.getSites(id);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw, 400, "No data")
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "Data is empty");
    const result = await directoryService.update(id, reqBody as DirectoryParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await directoryService.delete(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = null;
  }
}