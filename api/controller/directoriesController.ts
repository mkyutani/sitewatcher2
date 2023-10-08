import { RouterContext, helpers } from "../deps.ts";
import { DirectoryParam } from "../model/directories.ts";
import { directoryService } from "../service/directories.ts";

export const directoriesController = {
  async getAll(ctx: RouterContext<string>) {
    const { name, strict, sort } = helpers.getQuery(ctx, { mergeParams: true });
    const strict_lower = (strict !== void 0) ? strict.toLowerCase() : "false";
    const strict_flag = (strict_lower === "true") ? true : ((strict_lower === "false") ? false : null);
    ctx.assert(strict_flag != null, 400, "Invalid strict value"); 
    const result = await directoryService.getAll(name, strict_flag, sort);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, id);
    ctx.response.body = result;
  },
  async create(ctx:RouterContext<string>) {
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, reqBodyRaw.type);
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(reqBody.uri, 400, "Uri is missing");
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.type, 400, "Type is missing");
    ctx.assert(reqBody.enabled, 400, "Enabled is missing");
    const result = await directoryService.create(reqBody as DirectoryParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, reqBodyRaw.type);
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    const result = await directoryService.update(id, reqBody as DirectoryParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, id);
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryService.delete(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, id);
    ctx.response.body = null;
  },
  async getCollector(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryService.getCollector(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async createCollector(ctx:RouterContext<string>) {
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, reqBodyRaw.type);
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(reqBody.target, 400, "Target is missing");
    const result = await directoryService.createCollector(reqBody.target as string);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async deleteCollector(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await directoryService.deleteCollector(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = null;
  }
}