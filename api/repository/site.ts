import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteParam } from "../model/site.ts";

export const siteRepository = {
  async create(siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const directory = siteParam?.directory;
    const enabled = siteParam?.enabled;
    try {
      const sites = await sql `
        insert
        into site (uri, name, directory, enabled, created, updated)
        values (${uri}, ${name}, ${directory}, ${enabled}, current_timestamp, current_timestamp)
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
          id, uri, name, directory, enabled, created, updated
        from site
        where id = ${id}
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
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
  async getAll(name: string | null, strict_flag: boolean | null) {
    try {
      const sites = await sql `
        select
          id, uri, name, directory, enabled, created, updated
        from site
        ${(name && name.length > 0) ?
          (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``
        }
      `
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
    const enabled = siteParam?.enabled;
    try {
      const sites = await sql `
        update site
        set uri = ${uri ? uri : sql`uri`},
          name = ${name ? name : sql`name`},
          directory = ${directory ? directory : sql`directory`},
          enabled = ${(enabled !== void 0) ? enabled : sql`enabled`},
          updated = current_timestamp
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