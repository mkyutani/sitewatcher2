import { RouterContext, helpers } from "../deps.ts";
import { directoryMetadataService } from "../service/directoriesMetadata.ts";

export const directoryMetadataController = {
  async getAll(ctx: RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryMetadataService.getAll(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id, key } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryMetadataService.get(id, key);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async create(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    const result = await directoryMetadataService.create(id, reqBody as any);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "Invalid content");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    const result = await directoryMetadataService.update(id, reqBody as any);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id, key } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryMetadataService.delete(id, key);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  }
}