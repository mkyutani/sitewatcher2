import { RouterContext, helpers } from "../deps.ts";
import { directoryMetadataService } from "../service/directoryMetadata.ts";
import { convertToBoolean, isUuid } from "../util.ts";

export const directoryMetadataController = {
  async create(ctx:RouterContext<string>) {
    const { id, name, strict } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(Object.keys(reqBody).length > 0, 400, "No key-value pairs");
    const strict_flag = convertToBoolean(strict);
    ctx.assert(strict_flag != null, 400, "Invalid strict flag"); 
    const result = await directoryMetadataService.create(id, reqBody as any, name, strict_flag);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id, key, name, strict } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const strict_flag = convertToBoolean(strict);
    ctx.assert(strict_flag != null, 400, "Invalid strict flag"); 
    const result = await directoryMetadataService.get(id, key, name, strict_flag);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async getAll(ctx: RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const result = await directoryMetadataService.getAll(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async update(ctx:RouterContext<string>) {
    const { id, name, strict } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(Object.keys(reqBody).length > 0, 400, "No key-value pairs");
    const strict_flag = convertToBoolean(strict);
    ctx.assert(strict_flag != null, 400, "Invalid strict flag"); 
    const result = await directoryMetadataService.update(id, reqBody as any, name, strict_flag);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id, key, name, strict } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(!id || isUuid(id), 400, "Invalid id");
    const strict_flag = convertToBoolean(strict);
    ctx.assert(strict_flag != null, 400, "Invalid strict flag"); 
    const result = await directoryMetadataService.delete(id, key, name, strict_flag);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = null;
  },
  async deleteAll(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryMetadataService.deleteAll(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = null;
  }
}