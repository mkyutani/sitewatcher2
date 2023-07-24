import sql from "./db.ts"
import { log } from "../deps.ts";
import { ResourceParam } from "../model/resources.ts";

export const resourceRepository = {
  async getAll(site: number) {
    try {
      const resources = await sql `
        select
          site, uri, name, longName, created
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
  async createAll(site: number, resourceParams : ResourceParam[]) {
    try {
      const options = "transaction isolation level serializable"
      const transaction = await sql.begin(options, async sql => {
        await sql`
          delete
          from resources
          where site = ${site}
        `;
        for (const resourceParam of resourceParams) {
          await sql`
            insert
            into resources (site, uri, name, longName, created)
            values (${site}, ${resourceParam.uri}, ${resourceParam.name}, ${resourceParam.longName}, current_timestamp)
          `;
        }
        const resources = await sql`
          select
            uri
          from resources
          where site = ${site}
        `;
        return resources;
      })
      return transaction;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Failed to create resource of site ${site}: ${description}`);
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