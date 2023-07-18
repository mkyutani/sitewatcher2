import sql from "./db.ts"
import { log } from "../deps.ts";

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
  async getAll() {
    try {
      const sites = await sql `
        select
          id, uri, name, type, enabled, lastUpdated
        from sites
      `
      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to get all sites: ${description}`);
      return null;
    }
  },
  async create(uri: string, name: string, type: string, enabled: boolean) {
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
  async update(id: number, uri: string, name: string, type: string, enabled: boolean) {
    try {
      if (uri !== void 0) {
        await sql `
          update sites
          set uri = ${uri},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
      if (name !== void 0) {
        await sql `
          update sites
          set name = ${name},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
      if (type !== void 0) {
        await sql `
          update sites
          set type = ${type},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
      if (enabled != null) {
        await sql `
          update sites
          set enabled = ${enabled},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
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