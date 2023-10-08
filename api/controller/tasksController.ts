import { RouterContext, helpers } from "../deps.ts";
import { taskService } from "../service/tasks.ts";

export const tasksController = {
  async getAll(ctx: RouterContext<string>) {
    const result = await taskService.getAll();
    ctx.assert(result, 500, "Unknown");
    ctx.response.body = result;
  },
  async get(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await taskService.get(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, id);
    ctx.response.body = result;
  },
  async delete(ctx:RouterContext<string>) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const result = await taskService.delete(id);
    ctx.assert(result, 500, "Unknown");
    ctx.assert(Object.keys(result).length > 0, 404, "");
    ctx.response.body = null;
  }
}