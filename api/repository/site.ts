import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteParam } from "../model/site.ts";

export const siteRepository = {
  async get(id: string) {
    try {
      const sites = await sql `
        select
          id, uri, name, directory, metadata, enabled, created, updated
        from site
        where id = ${id}
      `
      if (sites.length == 0) {
        return {};
      }
      const site = sites[0];
      if (site.metadata) {
        site.metadata = JSON.parse(site.metadata);
      }
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        log.warning(`siteRepository.get:${id}:${description}`);
        return {};
      }
      log.error(`siteRepository.get:${id}:${description}`);
      return null;
    }
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    try {
      if (sort && ["id", "uri", "name"].indexOf(sort) == -1) {
        return "Invalid sort key";
      }
      const sites = await sql `
        select
          id, uri, name, directory, metadata, enabled, created, updated
        from site
        ${(name && name.length > 0) ?
          (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``}
        ${sort === "uri" ?
          sql`order by uri` :
          sort === "name" ?
            sql`order by name` :
            sql`order by id`}
      `
      for (const site of sites) {
        if (site.metadata) {
          site.metadata = JSON.parse(site.metadata);
        }
      }
      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.getAll:${description}`);
      return null;
    }
  },
  async create(siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const directory = siteParam?.directory;
    const metadata = siteParam?.metadata;
    const enabled = siteParam?.enabled;
    try {
      const sites = await sql `
        insert
        into site (uri, name, directory, metadata, enabled, created, updated)
        values (${uri}, ${name}, ${directory}, ${JSON.stringify(metadata)}, ${enabled}, current_timestamp, current_timestamp)
        returning id
      `
      if (sites[0].metadata) {
        sites[0].metadata = JSON.parse(sites[0].metadata);
      }
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`siteRepository.create:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid directory id";
        }
      }
      log.error(`siteRepository.create:${description}`);
      return null;
    }
  },
  async update(id: string, siteParam: SiteParam) {
    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const directory = siteParam?.directory;
    const metadata = siteParam?.metadata;
    const enabled = siteParam?.enabled;
    try {
      const sites = await sql `
        update site
        set uri = ${uri ? uri : sql`uri`},
          name = ${name ? name : sql`name`},
          directory = ${directory ? directory : sql`directory`},
          metadata = ${metadata ? JSON.stringify(metadata) : sql`metadata`},
          enabled = ${(enabled !== void 0) ? enabled : sql`enabled`},
          updated = current_timestamp
        where id = ${id}
        returning *
      `
      if (sites.length == 0) {
        return {};
      }
      if (sites[0].metadata) {
        sites[0].metadata = JSON.parse(sites[0].metadata);
      }
    return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`siteRepository.update:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid directory id";
          }
      }
      log.error(`siteRepository.update:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string) {
    try {
      const sites = await sql `
        delete
        from site
        where id = ${id}
        returning id
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`siteRepository.delete:${id}:${description}`);
      return null;
    }
  }
}