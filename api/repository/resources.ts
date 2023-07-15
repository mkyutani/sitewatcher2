import sql from "./db.ts"
import { log } from "../deps.ts";

export const resourceRepository = {
  async get(site: number, uri: string) {
    try {
      const resource = await sql `
        select
          site, uri, name, longName, enabled, lastUpdated
        from resources
        where site = ${site}
          and uri = ${uri}
      `
      if (resource.length > 0) {
        return resource[0];
      }
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.get:${description}`);
    }
    return null;
  },
  async getAll(site: number) {
    try {
      const resources = await sql `
      select
        site, uri, name, longName, enabled, lastUpdated
      from resources
      where site = ${site}
      `
      return resources;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.getAll:${description}`);
    }
  },
  async create(site: number, uri: string, name: string, longName: string, enabled: boolean) {
    return await this.update(site, uri, name, longName, enabled);
  },
  async update(site: number, uri: string, name: string, longName: string, enabled: boolean) {
    try {
      await sql `
        insert
        into resources (site, uri, name, longName, enabled, lastUpdated)
        values (${site}, ${uri}, ${name}, ${longName}, ${enabled}, current_timestamp)
        on conflict (site, uri)
        do
          update
          set name = ${name},
            longName = ${longName},
            lastUpdated = current_timestamp
      `
    } catch (error) {
      if (error instanceof sql.PostgresError) {
        log.error(`resourceRepository.create:PG${error.code}:${error.message}`);
        log.error(`
        insert
        into resources (site, uri, name, longName, lastUpdated)
        values (${site}, ${uri}, ${name}, ${longName}, current_timestamp)
        on conflict (site, uri)
        do
          update sites
            set name = ${name},
              longName = ${longName},
              lastUpdated = current_timestamp
            where site = ${site}
              and uri = ${uri}
      `)
      }
    }
    return {};
  },
  async delete(site: number, uri: string) {
    try {
      await sql `
        delete
        from resources
        where site = ${site}
          and uri = ${uri}
      `
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.delete:${description}`);
    }
    return {};
  }
}