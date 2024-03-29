import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteParam } from "../model/site.ts";

export const siteRepository = {
  async create(siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const directory = siteParam?.directory;
    try {
      const sites = await sql `
        insert
        into site (uri, name, directory, created, updated)
        values (${uri}, ${name}, ${directory}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning id
      `
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`siteRepository.create:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid directory id";
        }
      }
      log.error(`siteRepository.create:${description}`);
      return null;
    }
  },
  async get(id: string) {
    try {
      const sites = await sql `
        select
          s.id, s.uri, s.name, s.directory, d.name as directory_name, s.created, s.updated
        from site as s
        inner join directory as d on s.directory = d.id
        where s.id = ${id}
      `
      if (sites.length == 0) {
        return {};
      }

      const site = sites[0]

      site.metadata = await sql`
        select key, value
        from site_metadata
        where site = ${site.id}
      `

      return site;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        log.warning(`siteRepository.get:${id}:${description}`);
        return {};
      }
      log.error(`siteRepository.get:${id}:${description}`);
      return null;
    }
  },
  async getAll(name: string | null, directory_id: string | null, strict: boolean | null) {
    try {
      const sites = await sql `
        select
          s.id, s.uri, s.name, s.directory, d.name as directory_name, s.created, s.updated
        from site as s
        inner join directory as d on s.directory = d.id
        ${directory_id ?
          sql`where s.directory = ${directory_id}` :
          sql``
        }
        ${(name && name.length > 0) ?
          (strict ?
            (directory_id ?
              sql`and s.name = ${name}`:
              sql`where s.name = ${name}`) :
            (directory_id ?
              sql`and s.name ilike ${`%${name}%`}` :
              sql`where s.name ilike ${`%${name}%`}`)):
          sql``
        }
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
      log.error(`siteRepository.getAll:${description}`);
      return null;
    }
  },
  async update(id: string, siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const directory = siteParam?.directory;
    try {
      const sites = await sql `
        update site
        set uri = ${uri ? uri : sql`uri`},
          name = ${name ? name : sql`name`},
          directory = ${directory ? directory : sql`directory`},
          updated = current_timestamp at time zone 'UTC'
        where id = ${id}
        returning *
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`siteRepository.update:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid directory id";
          }
      }
      log.error(`siteRepository.update:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string) {
    try {
      const sites = await sql `
        delete
        from site
        where id = ${id}
        returning id
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.delete:${id}:${description}`);
      return null;
    }
  }
}