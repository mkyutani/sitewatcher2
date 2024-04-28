import sql from "./db.ts"
import { log } from "../deps.ts";

export const directoryMetadataRepository = {
  async create(id: string, key: string, value: string) {
    try {
      const metadata = await sql `
        insert
        into directory_metadata (directory, key, value, created, updated)
        values (${id}, ${key}, ${value}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning directory, key, value, created, updated
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`directoryMetadataRepository.create:${id}:${description}`);
        return "No such a directory"
      } else {
        log.error(`directoryMetadataRepository.create:${id}:${description}`);
        return null;
      }
    }
  },
  async get(id: string, key: string | null) {
    try {
      const metadata = await sql `
        select
          m.directory, d.name as directory_name, m.key, m.value, m.created, m.updated
        from directory_metadata as m
        inner join directory as d on m.directory = d.id
        where m.directory = ${id}
        ${key ?
          sql`and m.key = ${key}` :
          sql``
        }
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`directoryMetadataRepository.get:${id}:${description}`);
        return "No such a directory"
      } else {
        log.error(`directoryMetadataRepository.get:${id}:${description}`);
        return null;
      }
    }
  },
  async delete(id: string, key: string | null) {
    try {
      const metadata = await sql `
        delete
        from directory_metadata
        where directory = ${id}
        ${key ?
          sql`and key = ${key}` :
          sql``
        }
        returning directory, key
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`directoryMetadataRepository.delete:${id}:${description}`);
        return "No such a directory"
      } else {
        log.error(`directoryMetadataRepository.delete:${id}:${description}`);
        return null;
      }
    }
  }
}