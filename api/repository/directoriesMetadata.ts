import sql from "./db.ts"
import { log } from "../deps.ts";

export const directoryMetadataRepository = {
  async get(id: string, key: string) {
    try {
      const metadata = await sql `
        select
          directory, key, value, created, updated
        from directory_metadata
        where directory = ${id}
        and key = ${key}
      `
      if (metadata.length == 0) {
        return {};
      }
      return metadata[0];
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
  async create(id: string, param: any) {
    if (param.length == 0) {
      return "No key-value pairs"
    } else if (param.length > 1) {
      return "Too many key-value pairs"
    }
    const key = Object.keys(param)[0]
    const value = Object.values(param)[0]
    try {
      const metadata = await sql `
        insert
        into directory_metadata (directory, key, value, created, updated)
        values (${id}, ${key}, ${value}, current_timestamp, current_timestamp)
        returning key
      `
      return metadata[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
        log.error(`directoryMetadataRepository.create:${id}:${description}`);
        return null;
      }
    }
  },
  async update(id: string, param: any) {
    if (param.length == 0) {
      return "No key-value pairs"
    } else if (param.length > 1) {
      return "Too many key-value pairs"
    }
    const key = Object.keys(param)[0]
    const value = Object.values(param)[0]
    try {
      const metadata = await sql `
        update directory_metadata
        set value = ${value},
          updated = current_timestamp
        where directory = ${id}
        and key = ${key}
        returning *
      `
      if (metadata.length == 0) {
        return {};
      }
      return metadata[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`directoryMetadataRepository.create:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string, key: string) {
    try {
      const metadata = await sql `
        delete
        from directory_metadata
        where directory = ${id}
        and key = ${key}
        returning directory, key
      `
      if (metadata.length == 0) {
        return {};
      }
      return metadata[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      log.error(`directoryMetadataRepository.delete:${id}:${description}`);
      return null;
    }
  }
}