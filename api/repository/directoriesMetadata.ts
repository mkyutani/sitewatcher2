import sql from "./db.ts"
import { log } from "../deps.ts";

export const directoryMetadataRepository = {
  async createOrUpdate(id: string | null, kvs: any) {
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
          ${id ? sql`values (${id}, ${key}, ${value}, current_timestamp, current_timestamp)` : sql`select id, ${key}, ${value}, current_timestamp, current_timestamp from directory`}
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
        log.error(`directoryMetadataRepository.create:${id}:${description}`);
        return null;
      }
    }
    return results;
  },
  async get(id: string | null, key: string) {
    try {
      const metadata = await sql `
        select
          directory, key, value, created, updated
        from directory_metadata
        where ${id ? sql`directory = ${id} and key = ${key}` : sql`key = ${key}`}
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
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`directoryMetadataRepository.get:${id}:${description}`);
        return {};
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
      log.error(`directoryMetadataRepository.getAll:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string | null, key: string) {
    try {
      const metadata = await sql `
        delete
        from directory_metadata
        where ${id ? sql`directory = ${id} and key = ${key}` : sql`key = ${key}`}
        returning directory, key
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
      log.error(`directoryMetadataRepository.delete:${id}:${description}`);
      return null;
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
      log.error(`directoryMetadataRepository.delete:${id}:${description}`);
      return null;
    }
  }
}