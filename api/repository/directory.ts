import sql from "./db.ts"
import { log } from "../deps.ts";
import { DirectoryParam } from "../model/directory.ts";

export const directoryRepository = {
  async get(id: string) {
    try {
      const directories = await sql `
        select
          id, name, enabled, created, updated
        from directory
        where id = ${id}
      `
      if (directories.length == 0) {
        return {};
      }
      const directory = directories[0];
      return directory;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`directoryRepository.get:${id}:${description}`);
        return {};
      } else {
        log.error(`directoryRepository.get:${id}:${description}`);
        return null;
      }
    }
  },
  async getAll(name: string | null, strict_flag: boolean | null) {
    try {
      const directories = await sql `
        select
          id, name, enabled, created, updated
        from directory
        ${(name && name.length > 0) ?
          (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``}
      `
      return directories;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`directoryRepository.getAll:${description}`);
      return null;
    }
  },
  async create(DirectoryParam: DirectoryParam) {
    const name = DirectoryParam?.name;
    const enabled = DirectoryParam?.enabled;
    try {
      const directories = await sql `
        insert
        into directory (name, enabled, created, updated)
        values (${name}, ${enabled}, current_timestamp, current_timestamp)
        returning id
      `
      return directories[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
        log.error(`directoryRepository.create:${description}`);
        return null;
      }
    }
  },
  async update(id: string, param: DirectoryParam) {
    const name = param?.name;
    const enabled = param?.enabled;
    try {
      const directories = await sql `
        update directory
        set name = ${name ? name : sql`name`},
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
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
        log.error(`directoryRepository.update:${id}:${description}`);
        return null;
      }
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
      log.error(`directoryRepository.delete:${id}:${description}`);
      return null;
    }
  }
}