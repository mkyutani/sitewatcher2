import { RouterContext, helpers } from "../deps.ts";
import { siteMetadataService } from "../service/siteMetadata.ts";
import { convertToBoolean, isUuid } from "../util.ts";

export const siteMetadataController = {
  async create(ctx:RouterContext<string>) {
    const { id, key, value } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(key, 400, "No key");
    ctx.assert(value, 400, "No value");
    const result = await siteMetadataService.create(id, key, value);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id, key } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await siteMetadataService.get(id, key);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id, key } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await siteMetadataService.delete(id, key);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result);
    ctx.response.body = null;
  }
}