import sql from "./db.ts"
import { log } from "../deps.ts";
import { DirectoryParam } from "../model/directories.ts";

export const directoryRepository = {
  async get(id: string) {
    try {
      const directories = await sql `
        select
          id, name, metadata, enabled, created, updated
        from directory
        where id like ${id}
      `
      if (directories.length == 0) {
        return {};
      }
      const directory = directories[0];
      if (directory.metadata) {
        directory.metadata = JSON.parse(directory.metadata);
      }
      return directory;
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
      if (sort && ["id", "name"].indexOf(sort) == -1) {
        return "Invalid sort key";
      }
      const directories = await sql `
        select
          id, name, metadata, enabled, created, updated
        from directory
        ${(name && name.length > 0) ?
          (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``}
        ${sort === "name" ?
          sql`order by name` :
          sql`order by id`}
      `
      for (const directory of directories) {
        if (directory.metadata) {
          directory.metadata = JSON.parse(directory.metadata);
        }
      }
      return directories;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Site:${description}`);
      return null;
    }
  },
  async create(DirectoryParam: DirectoryParam) {
    const name = DirectoryParam?.name;
    const metadata = DirectoryParam?.metadata;
    const enabled = DirectoryParam?.enabled;
    try {
      const directories = await sql `
        insert
        into directory (name, metadata, enabled, created, updated)
        values (${name}, ${JSON.stringify(metadata)}, ${enabled}, current_timestamp, current_timestamp)
        returning id
      `
      if (directories[0].metadata) {
        directories[0].metadata = JSON.parse(directories[0].metadata);
      }
      return directories[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        log.error(`Site:PG${error.code}:${error.message}:${name}`);
        return null;
      }
    }
  },
  async update(id: string, param: DirectoryParam) {
    const name = param?.name;
    const metadata = param?.metadata;
    const enabled = param?.enabled;
    try {
      const directories = await sql `
        update directory
        set name = ${name ? name : sql`name`},
          metadata = ${metadata ? JSON.stringify(metadata) : sql`metadata`},
          enabled = ${(enabled !== void 0) ? enabled : sql`enabled`},
          updated = current_timestamp
        where id = ${id}
        returning *
      `
      if (directories.length == 0) {
        return {};
      }
      if (directories[0].metadata) {
        directories[0].metadata = JSON.parse(directories[0].metadata);
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
        from directory
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