import sql from "./db.ts"
import { log } from "../deps.ts";
import { ResourceParam } from "../model/resource.ts";

export const resourceRepository = {
  async getAll(site: string) {
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
      log.error(`${description} Site#${site}`);
      return null;
    }
  },
  async createAll(site: string, resourceParams : ResourceParam[]) {
    try {
      const options = "transaction isolation level serializable"
      const result = await sql.begin(options, async sql => {
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
            on conflict(site, uri)
            do nothing
          `;
        }
        const counts = await sql`
          select
            count(*)
          from resources
          where site = ${site}
        `;
        return counts[0]
      })
      return result;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${description} Site#${site}`);
      return null;
    }
  },
  async deleteAll(site: string) {
    try {
      await sql `
        delete
        from resources
        where site = ${site}
      `
      return {};
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${description} Site#${site}`);
      return null;
    }
  }
}