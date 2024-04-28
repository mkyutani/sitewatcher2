import sql from "./db.ts"
import { log } from "../deps.ts";
import { DirectoryParam } from "../model/directory.ts";

export const directoryRepository = {
  async get(id: string) {
    const context = {
      name: "directoryRepository.get"
    };

    try {
      context.name = "directoryRepository.get.getDirectory";
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

      context.name = "directoryRepository.get.getMetadata";
      directory.metadata = await sql`
        select key, value
        from directory_metadata
        where directory = ${directory.id}
      `

      context.name = "directoryRepository.get.getSites";
      directory.sites = await sql `
        select
          s.id, s.name, s.uri, s.directory, d.name as directory_name, s.created, s.updated
        from site as s
        inner join directory as d on s.directory = d.id
        where s.directory = ${directory.id}
      `

      context.name = "directoryRepository.get.getSiteMetadata";
      for (const site of directory.sites) {
        const data = await sql`
          select key, value
          from site_metadata
          where site = ${site.id}
        `
        site.metadata = data;
      }

      return directory;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`${context.name}:${id}:${description}`);
        return {};
      } else {
        log.error(`${context.name}:${id}:${description}`);
        return null;
      }
    }
  },
  async list() {
    const context = {
      name: "directoryRepository.search"
    };

    try {
      const directories = await sql `
        select
          id, name
        from directory
      `
      return directories;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${description}`);
      return null;
    }
  },
  async getResources(id: string, last: number) {
    const context = {
      name: "directoryRepository.getResources"
    };

    try {
      const resources = await sql `
        select
          s.directory, d.name as directory_name, s.id as site, s.name as site_name, s.uri as site_uri,
          u.id, u.uri, u.name, u.reason, u.section1, u.section2, u.section3, u.section4, u.section5, u.section6, u.tm as time
        from site as s
        inner join directory as d
        on s.directory = d.id
        inner join (
          select
            r.id, r.uri, r.name, r.reason, r.section1, r.section2, r.section3, r.section4, r.section5, r.section6, r.tm, r.site
          from site_resource as r
          inner join (
            select uri, max(id) as id
            from site_resource
            where id > ${last}
            group by uri
          ) as g
          on r.id = g.id
        ) as u
        on s.id = u.site
        where s.directory = ${id};
      `
      return resources;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`${context.name}:${id}:${description}`);
        return null;
      } else {
        log.error(`${context.name}:${id}:${description}`);
        return null;
      }
    }
  },
  async create(DirectoryParam: DirectoryParam) {
    const context = {
      name: "directoryRepository.create"
    };

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
        log.error(`${context.name}:${description}`);
        return null;
      }
    }
  },
  async update(id: string, param: DirectoryParam) {
    const context = {
      name: "directoryRepository.update"
    };

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
        log.error(`${context.name}:${id}:${description}`);
        return null;
      }
    }
  },
  async delete(id: string) {
    const context = {
      name: "directoryRepository.delete"
    };

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
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  }
}