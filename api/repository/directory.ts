import sql from "./db.ts"
import { log } from "../deps.ts";
import { DirectoryParam } from "../model/directory.ts";

export const directoryRepository = {
  async get(id: string) {
    try {
      const directories = await sql `
        select
          id, name, created, updated
        from directory
        where id = ${id}
      `
      if (directories.length == 0) {
        return {};
      }

      const directory = directories[0];

      directory.metadata = await sql`
        select key, value
        from directory_metadata
        where directory = ${directory.id}
      `

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
  async getAll(name: string | null, strict: boolean | null) {
    try {
      const directories = await sql `
        select
          id, name, created, updated
        from directory
        ${(name && name.length > 0) ?
          (strict ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``
        }
      `

      for (const directory of directories) {
        const data = await sql`
          select key, value
          from directory_metadata
          where directory = ${directory.id}
        `
        directory.metadata = data;
      }

      return directories;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`directoryRepository.getAll:${description}`);
      return null;
    }
  },
  async getSites(id: string) {
    try {
      const sites = await sql `
        select
          s.id, s.name, s.uri, s.directory, d.name as directory_name, s.created, s.updated
        from site as s
        inner join directory as d on s.directory = d.id
        where s.directory = ${id}
      `

      for (const site of sites) {
        const data = await sql`
          select key, value
          from site_metadata
          where site = ${site.id}
        `
        site.metadata = data;
      }

      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`directoryRepository.getSites:${id}:${description}`);
        return null;
      } else {
        log.error(`directoryRepository.getSites:${id}:${description}`);
        return null;
      }
    }
  },
  async create(DirectoryParam: DirectoryParam) {
    const name = DirectoryParam?.name;
    try {
      const directories = await sql `
        insert
        into directory (name,created, updated)
        values (${name}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
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
    try {
      const directories = await sql `
        update directory
        set name = ${name ? name : sql`name`},
          updated = current_timestamp at time zone 'UTC'
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