import sql from "./db.ts"
import { log } from "../deps.ts";

export const siteMetadataRepository = {
  async create(id: string, key: string, value: string) {
    try {
      const metadata = await sql `
        insert
        into site_metadata (site, key, value, created, updated)
        values (${id}, ${key}, ${value}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning site, key, value, created, updated
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`siteMetadataRepository.create:${id}:${description}`);
        return "No such a site"
      } else {
        log.error(`siteMetadataRepository.create:${id}:${description}`);
        return null;
      }
    }
  },
  async get(id: string, key: string | null) {
    try {
      const metadata = await sql `
        select
          m.site, s.name as site_name, m.key, m.value, m.created, m.updated
        from site_metadata as m
        inner join site as s on m.site = s.id
        where m.site = ${id}
        ${key ?
          sql`and m.key = ${key}` :
          sql``
        }
      `
      return metadata;
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
  async delete(id: string, key: string | null) {
    try {
      const metadata = await sql `
        delete
        from site_metadata
        where site = ${id}
        ${key ?
          sql`and key = ${key}` :
          sql``
        }
        returning site, key
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`siteMetadataRepository.delete:${id}:${description}`);
        return "No such a site"
      } else {
        log.error(`siteMetadataRepository.delete:${id}:${description}`);
        return null;
      }
    }
  }
}