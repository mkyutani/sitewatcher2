import { RouterContext, helpers } from "../deps.ts";
import { directoryMetadataService } from "../service/directoryMetadata.ts";
import { convertToBoolean, isUuid } from "../util.ts";

export const directoryMetadataController = {
  async create(ctx:RouterContext<string>) {
    const { id, key, value } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(key, 400, "No key");
    ctx.assert(value, 400, "No value");
    const result = await directoryMetadataService.create(id, key, value);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id, key } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await directoryMetadataService.get(id, key);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    if (key && Object.keys(result).length === 0) {
      ctx.response.body = null;
    } else {
      ctx.response.body = result;
    }
  },
  async delete(ctx:RouterContext<string>) {
    const { id, key } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await directoryMetadataService.delete(id, key);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = null;
  }
}