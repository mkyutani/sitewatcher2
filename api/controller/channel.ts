import { RouterContext, helpers, log } from "../deps.ts";
import { ChannelParam } from "../model/channel.ts";
import { channelService } from "../service/channel.ts";
import { isUuid } from "../util.ts";

export const channelController = {
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
    ctx.assert(reqBody.name, 400, "Name is missing");
    const result = await channelService.create(reqBody as ChannelParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await channelService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async list(ctx: RouterContext<string>) {
    const result = await channelService.list();
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async getResources(ctx:RouterContext<string>) {
    const { id, last } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const last_position = last ? last : 0;
    const result = await channelService.getResources(id, last_position);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
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
    const result = await channelService.update(id, reqBody as ChannelParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await channelService.delete(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  }
}