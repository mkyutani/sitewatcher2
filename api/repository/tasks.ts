import sql from "./db.ts"
import { log } from "../deps.ts";
import { TaskParam } from "../model/tasks.ts";

export const taskRepository = {
  async get(id: string) {
    try {
      const tasks = await sql `
        select
          id, target, type, method, status, created, updated
        from tasks
        where id = ${id}
      `
      if (tasks.length == 0) {
        return {};
      }
      return tasks[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`task:${id}:${description}`);
        return {};
      } else {
        log.error(`task:${id}:${description}`);
        return null;
      }
    }
  },
  async getByTarget(target: string) {
    try {
      const tasks = await sql `
        select
          id, target, type, method, status, created, updated
        from tasks
        where target = ${target}
      `
      if (tasks.length == 0) {
        return {};
      }
      return tasks[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`task:target=${target}:${description}`);
        return {};
      } else {
        log.error(`task:target=${target}:${description}`);
        return null;
      }
    }
  },
  async getAll() {
    try {
      const tasks = await sql `
        select
          id, target, type, method, status, created, updated
        from tasks
        order by created
      `
      return tasks;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Task:${description}`);
      return null;
    }
  },
  async create(param: TaskParam) {
    const target = param?.target;
    const type = param?.type;
    const method = param?.method;
    const status = "waiting";
    try {
      const resources = await sql `
        insert
        into tasks (target, type, method, status, created, updated)
        values (${target}, ${type}, ${method}, ${status}, current_timestamp, current_timestamp)
        returning id
      `
      return resources[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
        return "Duplicated";
      } else {
        log.error(`task:PG${error.code}:${error.message}:${target}`);
        return null;
      }
    }
  },
  async delete(id: string) {
    try {
      const tasks = await sql `
        delete
        from tasks
        where id = ${id}
        returning id
      `
      if (tasks.length == 0) {
        return {};
      }
      return tasks[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`task:${id}:${description}`);
      return null;
    }
  },
  async deleteByTarget(target: string) {
    try {
      const tasks = await sql `
        delete
        from tasks
        where target = ${target}
        returning id
      `
      if (tasks.length == 0) {
        return {};
      }
      return tasks[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`task:target=${target}:${description}`);
      return null;
    }
  }
}