import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteResourceParam } from "../model/siteResource.ts";

export const siteResourceRepository = {
  async create(site: string, siteResourceParam: SiteResourceParam, initial: boolean | null) {
    const uri = siteResourceParam?.uri;
    const name = siteResourceParam?.name;
    const reason = siteResourceParam?.reason;
    try {
      const resources = await sql `
        insert
        into site_resource (uri, site, name, reason, tm)
        values (
          ${uri}, ${site}, ${name}, ${reason},
          ${initial ?
            sql`'epoch'` :
            sql`current_timestamp at time zone 'UTC'`
          }
        )
        returning uri, site, name, reason, tm
      `
      return resources[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`siteResourceRepository.create:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid directory id";
        }
      }
      log.error(`siteResourceRepository.create:${description}`);
      return null;
    }
  },
  async getAll(site: string) {
    try {
      const sites = await sql `
        select
          r.uri, r.name, r.site, s.name as site_name, r.reason, r.tm as time
        from site_resource as r
        inner join site as s on r.site = s.id
        where r.site = ${site}
      `
      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteResourceRepository.getAll:${description}`);
      return null;
    }
  }
}