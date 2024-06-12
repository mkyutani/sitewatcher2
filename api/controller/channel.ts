import { RouterContext, helpers, log } from "../deps.ts";
import { ChannelDeviceParam, ChannelDirectoryParam, ChannelParam, ChannelSiteParam } from "../model/channel.ts";
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
  },
  async addDirectory(ctx:RouterContext<string>) {
    const { id, dir } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(isUuid(dir), 400, "Invalid directory id");
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
    ctx.assert(reqBody.title, 400, "Title is missing");
    ctx.assert(reqBody.description, 400, "Description is missing");
    const result = await channelService.addDirectory(id, dir, reqBody as ChannelDirectoryParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async updateDirectory(ctx:RouterContext<string>) {
    const { id, dir } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(isUuid(dir), 400, "Invalid directory id");
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
    if (reqBody.priority) {
      ctx.assert(!isNaN(reqBody.priority), 400, "Priority must be a number");
      ctx.assert(reqBody.priority.length === 24, 400, "Priority must be a 24-digit number");
    }
    const result = await channelService.updateDirectory(id, dir, reqBody as ChannelDirectoryParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async deleteDirectory(ctx:RouterContext<string>) {
    const { id, dir } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(isUuid(dir), 400, "Invalid directory id");
    const result = await channelService.deleteDirectory(id, dir);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async addSite(ctx:RouterContext<string>) {
    const { id, site } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(isUuid(site), 400, "Invalid site id");
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
    ctx.assert(reqBody.title, 400, "Title is missing");
    ctx.assert(reqBody.description, 400, "Description is missing");
    const result = await channelService.addSite(id, site, reqBody as ChannelSiteParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async updateSite(ctx:RouterContext<string>) {
    const { id, site } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(isUuid(site), 400, "Invalid site id");
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
    if (reqBody.priority) {
      ctx.assert(!isNaN(reqBody.priority), 400, "Priority must be a number");
      ctx.assert(reqBody.priority.length === 24, 400, "Priority must be a 24-digit number");
    }
    const result = await channelService.updateSite(id, site, reqBody as ChannelSiteParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async deleteSite(ctx:RouterContext<string>) {
    const { id, site } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    ctx.assert(isUuid(site), 400, "Invalid site id");
    const result = await channelService.deleteSite(id, site);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async addDevice(ctx:RouterContext<string>) {
    const { id, dev } = helpers.getQuery(ctx, { mergeParams: true });
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
    ctx.assert(reqBody.interface, 400, "Interface is missing");
    ctx.assert(reqBody.header, 400, "Header is missing");
    ctx.assert(reqBody.body, 400, "Body is missing");
    const result = await channelService.addDevice(id, dev, reqBody as ChannelDeviceParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.response.body = result;
  },
  async updateDevice(ctx:RouterContext<string>) {
    const { id, dev } = helpers.getQuery(ctx, { mergeParams: true });
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
    const result = await channelService.updateDevice(id, dev, reqBody as ChannelDeviceParam);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(typeof result !== "string", 400, result as string);
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async deleteDevice(ctx:RouterContext<string>) {
    const { id, dev } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await channelService.deleteDevice(id, dev);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  },
  async collectResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await channelService.collectResources(id);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async getResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await channelService.getResources(id);
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  }
}