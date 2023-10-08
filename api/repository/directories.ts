import sql from "./db.ts"
import { log } from "../deps.ts";
import { DirectoryParam } from "../model/directories.ts";

export const directoryRepository = {
  async get(id: string) {
    try {
      const directories = await sql `
        select
          id, uri, name, type, enabled, created, updated
        from directories
        where id = ${id}
      `
      if (directories.length == 0) {
        return {};
      }
      return directories[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`Site:${id}:${description}`);
        return {};
      } else {
        log.error(`Site:${id}:${description}`);
        return null;
      }
    }
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    try {
      if (sort && ["id", "uri", "name"].indexOf(sort) == -1) {
        return "Invalid sort key";
      }
      const directories = await sql `
        select
          id, uri, name, type, enabled, created, updated
        from directories
        ${(name && name.length > 0) ?
          (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``}
        ${sort === "uri" ?
          sql`order by uri` :
          sort === "name" ?
            sql`order by name` :
            sql`order by id`}
      `
      return directories;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Site:${description}`);
      return null;
    }
  },
  async create(DirectoryParam: DirectoryParam) {
    const uri = DirectoryParam?.uri;
    const name = DirectoryParam?.name;
    const type = DirectoryParam?.type;
    const enabled = DirectoryParam?.enabled;
    try {
      const resources = await sql `
        insert
        into directories (uri, name, type, enabled, created, updated)
        values (${uri}, ${name}, ${type}, ${enabled}, current_timestamp, current_timestamp)
        returning id
      `
      return resources[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        log.error(`Site:PG${error.code}:${error.message}:${uri}`);
        return null;
      }
    }
  },
  async update(id: string, param: DirectoryParam) {
    const uri = param?.uri;
    const name = param?.name;
    const type = param?.type;
    const enabled = param?.enabled;
    try {
      const directories = await sql `
        update directories
        set uri = ${uri ? uri : sql`uri`},
          name = ${name ? name : sql`name`},
          type = ${type ? type : sql`type`},
          enabled = ${(enabled !== void 0) ? enabled : sql`enabled`},
          updated = current_timestamp
        where id = ${id}
        returning *
      `
      if (directories.length == 0) {
        return {};
      }
      return directories[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Site:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string) {
    try {
      const directories = await sql `
        delete
        from directories
        where id = ${id}
        returning id
      `
      if (directories.length == 0) {
        return {};
      }
      return directories[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Site:${id}:${description}`);
      return null;
    }
  }
}