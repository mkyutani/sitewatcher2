import sql from "./db.ts"
import { log } from "../deps.ts";

export const resourceRepository = {
  async get(site: number, uri: string) {
    try {
      const resource = await sql `
        select
          site, uri, name, longName
        from resources
        where site = ${site}
          and uri = ${uri}
      `
      if (resource.length > 0) {
        return resource[0];
      }
    } catch (error) {
      if (error instanceof sql.PostgresError) {
        log.error(`resourceRepository.get:${error.name}:${error.code}:${error.detail}`);
      }
    }
    return null;
  },
  async getAll(site: number) {
    try {
      const resources = await sql `
      select
        site, uri, name, longName
      from resources
      where site = ${site}
      `
      return resources;
    } catch (error) {
      if (error instanceof sql.PostgresError) {
        log.error(`resourceRepository.getAll:${error.name}:${error.code}:${error.detail}`);
      }
    }
  },
  async create(site: number, uri: string, name: string, longName: string) {
    return await this.update(site, uri, name, longName);
  },
  async update(site: number, uri: string, name: string, longName: string) {
    try {
      await sql `
        insert
        into resources (site, uri, name, longName, lastUpdated)
        values (${site}, ${uri}, ${name}, ${longName}, current_timestamp)
        on conflict (site, uri)
        do
          update
          set name = ${name},
            longName = ${longName},
            lastUpdated = current_timestamp
      `
    } catch (error) {
      if (error instanceof sql.PostgresError) {
        log.error(`resourceRepository.update:${error.name}:${error.code}:${error.detail}`);
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
      if (error instanceof sql.PostgresError) {
        log.error(`resourceRepository.delete:${error.name}:${error.code}:${error.detail}`);
      }
    }
    return {};
  }
}