import sql from "./db.ts"
import { log } from "../deps.ts";

export const siteDatabase = {
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
      if (error instanceof sql.PostgresError) {
        log.error(`siteDatabase.get:${error.name}:${error.code}:${error.detail}`);
      }
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
      if (error instanceof sql.PostgresError) {
        log.error(`siteDatabase.getAll:${error.name}:${error.code}:${error.detail}`);
      }
    }
  },
  async create(name: string, source: string, type: string) {
    try {
      log.info(`
      insert
      into sites (name, source, type, lastUpdated)
      values (${name}, ${source}, ${type}, current_timestamp)
    `)
      await sql `
        insert
        into sites (name, source, type, lastUpdated)
        values (${name}, ${source}, ${type}, current_timestamp)
      `
    } catch (error) {
      if (error instanceof sql.PostgresError) {
        log.error(`siteDatabase.create:${error.name}:${error.code}:${error.detail}`);
      }
    }
    return {};
  },
  async update(id: number, name: string, source: string, type: string) {
    try {
      const site = await sql `
        update sites
        set name = ${name},
          source = ${source},
          type = ${type},
          lastUpdated = current_timestamp
        where id = ${id}
      `
        return site;
    } catch (error) {
      if (error instanceof sql.PostgresError) {
        log.error(`siteDatabase.update:${error.name}:${error.code}:${error.detail}`);
      }
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
      if (error instanceof sql.PostgresError) {
        log.error(`siteDatabase.delete:${error.name}:${error.code}:${error.detail}`);
      }
    }
    return {};
  }
}