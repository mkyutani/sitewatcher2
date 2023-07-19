import { RouterContext, helpers } from "../deps.ts";
import { SiteParam } from "../model/sites.ts";
import { siteService } from "../service/sites.ts";

export const sitesController = {
  async getAll(ctx: RouterContext<string>) {
    const sites = await siteService.getAll();
    if (!sites) ctx.response.status = 500;
    else ctx.response.body = sites;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const site = await siteService.get(id);
    if (!site) ctx.response.status = 500;
    else if (Object.keys(site).length == 0) ctx.response.status = 404;
    else ctx.response.body = site;
  },
  async getResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const resources = await siteService.getResources(id);
    if (!resources) ctx.response.status = 500;
    else ctx.response.body = resources;
  },
  async create(ctx:RouterContext<string>) {
    const reqBodyRaw = await ctx.request.body({ type: 'json' });
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    ctx.assert(reqBody.uri, 400, "Uri is missing");
    ctx.assert(reqBody.name, 400, "Name is missing");
    ctx.assert(reqBody.type, 400, "Type is missing");
    ctx.assert(reqBody.enabled, 400, "Enabled is missing");
    const result = await siteService.create(reqBody as SiteParam);
    if (!result) ctx.response.status = 500;
    else {
      if (typeof result == "string") ctx.response.status = 400;
      ctx.response.body = result;
    }
  },
  async update(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const reqBodyRaw = await ctx.request.body({ type: 'json' });
    const reqBody = await reqBodyRaw.value;
    ctx.assert(reqBody, 400, "No data");
    const site = await siteService.update(id, reqBody as SiteParam);
    if (!site) ctx.response.status = 500;
    else if (Object.keys(site).length == 0) ctx.response.status = 404;
    else ctx.response.body = site;
  },
  async updateResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.updateResources(id);
    if (!result) ctx.response.status = 500;
    else if (result == -1) ctx.response.status = 404;
    else ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.delete(id);
    if (!result) ctx.response.status = 500;
    else ctx.response.body = null;
  },
  async deleteResources(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await siteService.deleteResources(id);
    if (!result) ctx.response.status = 500;
    else ctx.response.body = null;
  },
}