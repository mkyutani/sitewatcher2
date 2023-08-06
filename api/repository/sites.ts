import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteParam } from "../model/sites.ts";

export const siteRepository = {
  async get(id: string) {
    try {
      const sites = await sql `
        select
          id, uri, name, type, enabled, created, updated
        from sites
        where id = ${id}
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
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
      const sites = await sql `
        select
          id, uri, name, type, enabled, created, updated
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
      log.error(`Site:${description}`);
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
        into sites (uri, name, type, enabled, created, updated)
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
  async update(id: string, siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const type = siteParam?.type;
    const enabled = siteParam?.enabled;
    try {
      const sites = await sql `
        update sites
        set uri = ${uri ? uri : sql`uri`},
          name = ${name ? name : sql`name`},
          type = ${type ? type : sql`type`},
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
      log.error(`Site:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string) {
    try {
      const sites = await sql `
        delete
        from sites
        where id = ${id}
        returning id
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Site:${id}:${description}`);
      return null;
    }
  }
}