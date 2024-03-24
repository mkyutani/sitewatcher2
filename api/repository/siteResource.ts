import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteResourceParam } from "../model/siteResource.ts";

export const siteResourceRepository = {
  async create(site: string, siteResourceParam: SiteResourceParam, initial: boolean | null) {
    const uri = siteResourceParam?.uri;
    const name = siteResourceParam?.name;
    const sections = siteResourceParam?.sections;
    const reason = siteResourceParam?.reason;

    const sections_max = sections ? (sections.length < 6 ? sections.length : 6) : 0;
    for (let sections_ctr = sections_max; sections_ctr < 6; sections_ctr++) {
      sections.push(null)
    }
    try {
      const resources = await sql `
        insert
        into site_resource (uri, site, name, reason, section1, section2, section3, section4, section5, section6, tm)
        values (
          ${uri}, ${site}, ${name}, ${reason},
          ${sections[0]}, ${sections[1]}, ${sections[2]}, ${sections[3]}, ${sections[4]}, ${sections[5]},
          ${initial ?
            sql`'epoch'` :
            sql`current_timestamp at time zone 'UTC'`
          }
        )
        returning uri, site, name, reason, section1, section2, section3, section4, section5, section6, tm
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
          r.uri, r.name, r.site, s.name as site_name, r.reason,
          r.section1, r.section2, r.section3, r.section4, r.section5, r.section6,  
          r.tm as time
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