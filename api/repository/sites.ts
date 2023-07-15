import sql from "./db.ts"
import { log } from "../deps.ts";

export const siteRepository = {
  async get(id: number) {
    try {
      const site = await sql `
        select
          id, name, source, type, enabled, lastUpdated
        from sites
        where id = ${id}
      `
      if (site.length > 0) {
        return site[0];
      }
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.get:${description}`);
    }
    return null;
  },
  async getAll() {
    try {
      const sites = await sql `
        select
          id, name, source, type, enabled, lastUpdated
        from sites
      `
      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.getAll:${description}`);
    }
  },
  async create(name: string, source: string, type: string, enabled: boolean) {
    try {
      const site = await sql `
        insert
        into sites (name, source, type, enabled, lastUpdated)
        values (${name}, ${source}, ${type}, ${enabled}, current_timestamp)
      `
      log.info(site);
      return site;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.create:${description}`);
    }
    return {};
  },
  async update(id: number, name: string, source: string, type: string, enabled: boolean) {
    try {
      if (name !== void 0) {
        await sql `
          update sites
          set name = ${name},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
      if (source !== void 0) {
        await sql `
          update sites
          set source = ${source},
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
      const site = siteRepository.get(id);
      log.info(site);
      return site;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.update:${description}`);
    }
    return {};
  },
  async delete(id: number) {
    try {
      await sql `
        delete
        from sites
        where id = ${id}
      `
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.delete:${description}`);
    }
    return {};
  }
}