import sql from "./db.ts"
import { log } from "../deps.ts";
import { ChannelParam } from "../model/channel.ts";

export const channelRepository = {
  async get(id: string) {
    try {
      const channels = await sql `
        select
          id, name, enabled, created, updated, referred
        from channels
        where id = ${id}
      `
      if (channels.length == 0) {
        return {};
      }
      return channels[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`Channel:${id}:${description}`);
        return {};
      } else {
        log.error(`Channel:${id}:${description}`);
        return null;
      }
    }
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    try {
      if (sort && ["id", "name"].indexOf(sort) == -1) {
        return "Invalid sort key";
      }
      const channels = await sql `
        select
          id, name, enabled, created, updated, referred
        from channels
        ${(name && name.length > 0) ?
          (strict_flag ? sql`where name = ${name}` : sql`where name ilike ${`%${name}%`}`) :
          sql``}
        ${sort === "name" ?
          sql`order by name` :
          sql`order by id`}
      `
      return channels;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Channel:${description}`);
      return null;
    }
  },
  async create(channelParam: ChannelParam) {
    const name = channelParam?.name;
    const enabled = channelParam?.enabled;
    try {
      const ids = await sql `
        insert
        into channels (name, enabled, created, updated, referred)
        values (${name}, ${enabled}, current_timestamp, current_timestamp, current_timestamp)
        returning id
      `
      return ids[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        log.error(`Channel:PG${error.code}:${error.message}:${name}`);
        return null;
      }
    }
  },
  async update(id: string, channelParam: ChannelParam) {
    const name = channelParam?.name;
    const enabled = channelParam?.enabled;
    try {
      const channels = await sql `
        update channels
        set name = ${name ? name : sql`name`},
          enabled = ${(enabled !== void 0) ? enabled : sql`enabled`},
          updated = current_timestamp
        where id = ${id}
        returning *
      `
      if (channels.length == 0) {
        return {};
      }
      return channels[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Channel:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string) {
    try {
      const ids = await sql `
        delete
        from channels
        where id = ${id}
        returning id
      `
      if (ids.length == 0) {
        return {};
      }
      return ids[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`Channel:${id}:${description}`);
      return null;
    }
  }
}