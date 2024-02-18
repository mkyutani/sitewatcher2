import sql from "./db.ts"
import { log } from "../deps.ts";

export const siteMetadataRepository = {
  async createOrUpdate(id: string | null, kvs: any, name: string | null, strict_flag : boolean | null) {
    const results: any[] = [];
    for (const key of Object.keys(kvs)) {
      if (typeof kvs[key] !== "string") {
        return "Invalid value type";
      }
      const value = kvs[key]
      try {
        const metadata = await sql `
          insert
          into site_metadata (site, key, value, created, updated)
          ${id ?
            sql`values (${id}, ${key}, ${value}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')` :
            sql`select id, ${key}, ${value}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC' from site
              ${(name && name.length > 0) ?
                (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
                sql``}
            `}
          on conflict (site, key)
          do update
            set value = ${value},
            updated = current_timestamp at time zone 'UTC'
          returning site, key, value, created, updated
        `
        if (metadata.length > 0) {
          for (const m of metadata) {
            results.push(m);
          }
        }
      } catch (error) {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
        if (error instanceof sql.PostgresError && error.code === "23503") {
          log.warning(`siteMetadataRepository.get:${id}:${description}`);
          return "No such a site"
        } else {
          log.error(`siteMetadataRepository.create:${id}:${description}`);
          return null;
        }
      }
    }
    return results;
  },
  async get(id: string | null, key: string, name: string | null, strict_flag : boolean | null) {
    try {
      const metadata = await sql `
        select
          site, key, value, m.created, m.updated
        from site_metadata as m
        ${id ?
          sql`where m.site = ${id}
            ${key ?
              sql`and m.key = ${key}` :
              sql``
            }
          ` :
          (name && name.length > 0) ?
            sql`join site as d on 
              ${strict_flag ?
                sql`name = ${name}` :
                sql`name ilike ${`%${name}%`}`
              }
              where m.site = d.id
              ${key ?
                sql`and m.key = ${key}` :
                sql``
              }
            ` :
            (key) ?
              sql`where m.key = ${key}` :
              sql``
        }
      `
      if (id) {
        if (metadata.length == 0) {
          return {};
        }
        return metadata[0];
      } else {
        if (metadata.length == 0) {
          return [];
        }
        return metadata;
      }
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`siteMetadataRepository.get:${id}:${description}`);
        return "No such a site"
      } else {
        log.error(`siteMetadataRepository.get:${id}:${description}`);
        return null;
      }
    }
  },
  async getAll(id: string) {
    try {
      const metadata = await sql `
        select
          site, key, value, created, updated
        from site_metadata
        where site = ${id}
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`siteMetadataRepository.get:${id}:${description}`);
        return "No such a site"
      } else {
        log.error(`siteMetadataRepository.getAll:${id}:${description}`);
        return null;
      }
    }
  },
  async delete(id: string | null, key: string, name: string | null, strict_flag : boolean | null) {
    try {
      const metadata = await sql `
        delete
        from site_metadata
        where key = ${`${key}`}
        ${id ?
          sql`and site = ${id}` :
          (name && name.length > 0) ?
            sql`and site in (select id from site where
              ${strict_flag ?
                sql`name = ${name}` :
                sql`name ilike ${`%${name}%`}`
              }
              )
            ` :
            sql``
        }
        returning site, key
      `
      if (metadata.length == 0) {
        return [];
      }
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`siteMetadataRepository.get:${id}:${description}`);
        return "No such a site"
      } else {
        log.error(`siteMetadataRepository.delete:${id}:${description}`);
        return null;
      }
    }
  },
  async deleteAll(id: string) {
    try {
      const metadata = await sql `
        delete
        from site_metadata
        where site = ${id}
        returning site
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`siteMetadataRepository.get:${id}:${description}`);
        return "No such a site"
      } else {
        log.error(`siteMetadataRepository.delete:${id}:${description}`);
        return null;
      }
    }
  }
}