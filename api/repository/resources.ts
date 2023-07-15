import sql from "./db.ts"
import { log } from "../deps.ts";

export const resourceRepository = {
  async get(site: number, uri: string) {
    try {
      const resource = await sql `
        select
          site, uri, name, longName, hash, status, mark, enabled, lastUpdated
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
        site, uri, name, longName, hash, status, mark, enabled, lastUpdated
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
  async markAllAsRemoving(site: number) {
    try {
      await sql `
        update resources
        set mark = 'NOTFOUND',
          lastUpdated = current_timestamp
        where site = ${site}
      `
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.markAllAsRemoving:${description}`);
    }
    return {};
  },
  async completeMarkedAsRemoving(site: number) {
    try {
      await sql `
        update resources
        set status = 'REMOVED',
          mark = '',
          lastUpdated = current_timestamp
        where site = ${site}
          and mark = 'NOTFOUND'
      `
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.completeMarkedAsRemoving:${description}`);
    }
    return {};
  },
  async update(site: number, uri: string, name: string, longName: string, enabled: boolean) {
    try {
      const resource = await sql `
        insert
        into resources (site, uri, name, longName, hash, status, mark, enabled, lastUpdated)
        values (${site}, ${uri}, ${name}, ${longName}, '', 'NEW', 'FOUND', ${enabled}, current_timestamp)
        on conflict (site, uri)
        do
          update
          set status = 'UPDATED',
            mark = 'FOUND',
            lastUpdated = current_timestamp
          where resources.site = ${site}
            and resources.uri = ${uri}
            and resources.mark = 'NOTFOUND'
        returning *
      `
      log.info(resource);
      return resource;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.update:${description}`);
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
  },
  async deleteAll(site: number) {
    try {
      await sql `
        delete
        from resources
        where site = ${site}
      `
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.delete:${description}`);
    }
    return {};
  }
}