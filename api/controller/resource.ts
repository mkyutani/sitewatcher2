import { RouterContext, helpers } from "../deps.ts";
import { resourceService } from "../service/resource.ts";
import { isUuid } from "../util.ts";

export const resourceController = {
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.assert(isUuid(id), 400, "Invalid id");
    const result = await resourceService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = result;
  }
}