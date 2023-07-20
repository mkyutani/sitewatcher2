import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteParam } from "../model/sites.ts";

export const siteRepository = {
  async get(id: number) {
    try {
      const site = await sql `
        select
          id, uri, name, type, enabled, lastUpdated
        from sites
        where id = ${id}
      `
      if (site.length == 0) {
        return {};
      }
      return site[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to get site ${id}: ${description}`);
      return null;
    }
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    try {
      if (sort && ["id", "uri", "name"].indexOf(sort) == -1) {
        return "Invalid sort key";
      }
      const sites = await sql `
        select
          id, uri, name, type, enabled, lastUpdated
        from sites
        ${(name && name.length > 0) ?
          (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``}
        ${sort === "uri" ?
          sql`order by uri` :
          sort === "name" ?
            sql`order by name` :
            sql`order by id`}
      `
      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to get all sites: ${description}`);
      return null;
    }
  },
  async create(siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const type = siteParam?.type;
    const enabled = siteParam?.enabled;
    try {
      const resources = await sql `
        insert
        into sites (uri, name, type, enabled, lastUpdated)
        values (${uri}, ${name}, ${type}, ${enabled}, current_timestamp)
        returning id
      `
      return resources[0];
    } catch (error) {
      if (error instanceof sql.PostgresError) {
        log.error(`Failed to create site ${uri}: PG${error.code}:${error.message}`);
        if (parseInt(error.code, 10) == 23505) {
          return "Duplicated";
        } else {
          return null;
        }
      } else {
        log.error(`Failed to create site ${uri}: ${error.name}:${error.message}`)
        return null;
      }
    }
  },
  async update(id: number, siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const type = siteParam?.type;
    const enabled = siteParam?.enabled;
    try {
      const site = await sql `
        update sites
        set uri = ${uri ? uri : sql`uri`},
          name = ${name ? name : sql`name`},
          type = ${type ? type : sql`type`},
          enabled = ${(enabled !== void 0) ? enabled : sql`enabled`},
          lastUpdated = current_timestamp
        where id = ${id}
        returning *
      `
      if (site.length == 0) {
        return {};
      }
      return site[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to update site ${id}: ${description}`);
      return null;
    }
  },
  async delete(id: number) {
    try {
      await sql `
        delete
        from sites
        where id = ${id}
      `
      return {};
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to delete site ${id}: ${description}`);
      return null;
    }
  }
}