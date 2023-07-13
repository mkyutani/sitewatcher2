import sql from "./db.ts"
import { log } from "../deps.ts";

export const siteRepository = {
  async get(id: number) {
    try {
      const site = await sql `
        select
          id, name, source, type
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
          id, name, source, type, lastUpdated
        from sites
      `
      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.getAll:${description}`);
    }
  },
  async create(name: string, source: string, type: string) {
    try {
      await sql `
        insert
        into sites (name, source, type, lastUpdated)
        values (${name}, ${source}, ${type}, current_timestamp)
      `
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.create:${description}`);
    }
    return {};
  },
  async update(id: number, name: string, source: string, type: string) {
    try {
      if (name) {
        await sql `
          update sites
          set name = ${name},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
      if (source) {
        await sql `
          update sites
          set source = ${source},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
      if (type) {
        await sql `
          update sites
          set type = ${type},
            lastUpdated = current_timestamp
          where id = ${id}
        `
      }
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