import sql from "./db.ts"
import { log } from "../deps.ts";

export const resourceRepository = {
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
      log.error(`Failed to get all resources of site ${site}: ${description}`);
      return null;
    }
  },
  async update(site: number, uri: string, name: string, longName: string, enabled: boolean, mark: string) {
    try {
      const resources = await sql `
        insert
        into resources (site, uri, name, longName, hash, status, mark, enabled, lastUpdated)
        values (${site}, ${uri}, ${name}, ${longName}, '', 'NEW', ${mark}, ${enabled}, current_timestamp)
        on conflict (site, uri)
        do
          update
          set status = 'UPDATED',
            mark = ${mark},
            lastUpdated = current_timestamp
          where resources.site = ${site}
            and resources.uri = ${uri}
            and resources.mark <> ${mark}
        returning *
      `;
      if (resources.length == 0) {
        return {};
      }
      if (resources[0]["status"] == "NEW") {
        log.info(`New resource: ${site} ${uri}`)
      }
      return resources[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to update resources of site ${site}: ${description}`);
      return null;
    }
  },
  async markAll(site: number, mark: string) {
    try {
      await sql `
        update resources
        set mark = ${mark},
          lastUpdated = current_timestamp
        where site = ${site}
      `
      return {};
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to mark all resources of site ${site}: ${description}`);
      return null;
    }
  },
  async removeAll(site: number, mark: string) {
    try {
      await sql `
        update resources
        set status = 'REMOVED',
          lastUpdated = current_timestamp
        where site = ${site}
          and mark = ${mark}
      `
      return {};
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`resourceRepository.completeMarkedAsRemoving:${description}`);
      return null;
    }
  },
  async deleteAll(site: number) {
    try {
      await sql `
        delete
        from resources
        where site = ${site}
      `
      return {};
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to delete resources of site ${site}: ${description}`);
      return null;
    }
  }
}