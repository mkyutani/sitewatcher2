import sql from "./db.ts"
import { log } from "../deps.ts";

export const directoryMetadataRepository = {
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
          into directory_metadata (directory, key, value, created, updated)
          ${id ?
            sql`values (${id}, ${key}, ${value}, current_timestamp, current_timestamp)` :
            sql`select id, ${key}, ${value}, current_timestamp, current_timestamp from directory
              ${(name && name.length > 0) ?
                (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
                sql``}
            `}
          on conflict (directory, key)
          do update
            set value = ${value},
            updated = current_timestamp
          returning directory, key, value, created, updated
        `
        if (metadata.length > 0) {
          for (const m of metadata) {
            results.push(m);
          }
        }
      } catch (error) {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
        if (error instanceof sql.PostgresError && error.code === "23503") {
          log.warning(`directoryMetadataRepository.get:${id}:${description}`);
          return "No such a directory"
        } else {
          log.error(`directoryMetadataRepository.create:${id}:${description}`);
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
          directory, key, value, m.created, m.updated
        from directory_metadata as m
        ${id ?
          sql`where m.directory = ${id}
            ${key ?
              sql`and m.key = ${key}` :
              sql``
            }
          ` :
          (name && name.length > 0) ?
            sql`join directory as d on 
              ${strict_flag ?
                sql`name = ${name}` :
                sql`name ilike ${`%${name}%`}`
              }
              where m.directory = d.id
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
        log.warning(`directoryMetadataRepository.get:${id}:${description}`);
        return "No such a directory"
      } else {
        log.error(`directoryMetadataRepository.get:${id}:${description}`);
        return null;
      }
    }
  },
  async getAll(id: string) {
    try {
      const metadata = await sql `
        select
          directory, key, value, created, updated
        from directory_metadata
        where directory = ${id}
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`directoryMetadataRepository.get:${id}:${description}`);
        return "No such a directory"
      } else {
        log.error(`directoryMetadataRepository.getAll:${id}:${description}`);
        return null;
      }
    }
  },
  async delete(id: string | null, key: string, name: string | null, strict_flag : boolean | null) {
    try {
      const metadata = await sql `
        delete
        from directory_metadata
        where key = ${`${key}`}
        ${id ?
          sql`and directory = ${id}` :
          (name && name.length > 0) ?
            sql`and directory in (select id from directory where
              ${strict_flag ?
                sql`name = ${name}` :
                sql`name ilike ${`%${name}%`}`
              }
              )
            ` :
            sql``
        }
        returning directory, key
      `
      if (metadata.length == 0) {
        return [];
      }
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`directoryMetadataRepository.get:${id}:${description}`);
        return "No such a directory"
      } else {
        log.error(`directoryMetadataRepository.delete:${id}:${description}`);
        return null;
      }
    }
  },
  async deleteAll(id: string) {
    try {
      const metadata = await sql `
        delete
        from directory_metadata
        where directory = ${id}
        returning directory
      `
      return metadata;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "23503") {
        log.warning(`directoryMetadataRepository.get:${id}:${description}`);
        return "No such a directory"
      } else {
        log.error(`directoryMetadataRepository.delete:${id}:${description}`);
        return null;
      }
    }
  }
}