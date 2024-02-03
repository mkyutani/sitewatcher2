import { RouterContext, helpers } from "../deps.ts";
import { ChannelParam } from "../model/channel.ts";
import { channelService } from "../service/channel.ts";

export const channelController = {
  async getAll(ctx: RouterContext<string>) {
    const { name, strict, sort } = helpers.getQuery(ctx, { mergeParams: true });
    const strict_lower = (strict !== void 0) ? strict.toLowerCase() : "false";
    const strict_flag = (strict_lower === "true") ? true : ((strict_lower === "false") ? false : null);
    ctx.assert(strict_flag != null, 400, "Invalid strict value"); 
    const result = await channelService.getAll(name, strict_flag, sort);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await channelService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async create(ctx:RouterContext<string>) {
    const reqBodyRaw = await ctx.request.body();
    ctx.assert(reqBodyRaw.type === "json", 415, "");
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.enabled, 400, "Enabled is missing");
    const result = await channelService.create(reqBody as ChannelParam);
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
    const result = await channelService.update(id, reqBody as ChannelParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await channelService.delete(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = null;
  },
}