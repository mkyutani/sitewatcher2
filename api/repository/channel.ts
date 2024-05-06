import sql from "./db.ts"
import { log } from "../deps.ts";
import { ChannelDirectoryParam, ChannelParam } from "../model/channel.ts";

export const channelRepository = {
  async get(id: string) {
    const context = {
      name: "channelRepository.get"
    };

    try {
      context.name = "channelRepository.get.getChannel";
      const directories = await sql `
        select
          id, name, created, updated
        from channel
        where id = ${id}
      `
      if (directories.length == 0) {
        return {};
      }

      const channel = directories[0];

      context.name = "channelRepository.get.getDirectories";
      channel.directories = await sql `
        select
          cd.directory, d.name as directory_name, cd.title, cd.description, cd.created, cd.updated
        from channel_directory as cd
        inner join directory as d on cd.directory = d.id
        where cd.channel = ${id}
      `

      return channel;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        // Ignore invalid uuid
        log.warning(`${context.name}:${id}:${description}`);
        return {};
      } else {
        log.error(`${context.name}:${id}:${description}`);
        return null;
      }
    }
  },
  async list() {
    const context = {
      name: "channelRepository.list"
    };

    try {
      const directories = await sql `
        select
          id, name
        from channel
      `
      return directories;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${description}`);
      return null;
    }
  },
  async create(channelParam: ChannelParam) {
    const context = {
      name: "channelRepository.create"
    };

    const name = channelParam?.name;
    try {
      const directories = await sql `
        insert
        into channel (name,created, updated)
        values (${name}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning id
      `
      return directories[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
        log.error(`${context.name}:${description}`);
        return null;
      }
    }
  },
  async update(id: string, param: ChannelParam) {
    const context = {
      name: "channelRepository.update"
    };

    const name = param?.name;
    try {
      const directories = await sql `
        update channel
        set name = ${name ? name : sql`name`},
          updated = current_timestamp at time zone 'UTC'
        where id = ${id}
        returning id, name, created, updated
      `
      if (directories.length == 0) {
        return {};
      }
      return directories[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
        log.error(`${context.name}:${id}:${description}`);
        return null;
      }
    }
  },
  async delete(id: string) {
    const context = {
      name: "channelRepository.delete"
    };

    try {
      const directories = await sql `
        delete
        from channel
        where id = ${id}
        returning id
      `
      if (directories.length == 0) {
        return {};
      }
      return directories[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async addDirectory(id: string, directory_id: string, param: ChannelDirectoryParam) {
    const context = {
      name: "channelRepository.addDirectory"
    };

    const title = param?.title;
    const description = param?.description;
    try {
      const channel_directories = await sql `
        insert
        into channel_directory (channel, directory, title, description, created, updated)
        values (${id}, ${directory_id}, ${title}, ${description}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning channel, directory
      `
      return channel_directories[0];
    } catch (error) {
      if (error instanceof sql.PostgresError && parseInt(error.code, 10) == 23505) {
          return "Duplicated";
      } else {
        const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
        log.error(`${context.name}:${description}`);
        return null;
      }
    }
  },
  async updateDirectory(id: string, directory_id: string, param: ChannelDirectoryParam) {
    const context = {
      name: "channelRepository.updateDirectory"
    };

    const title = param?.title;
    const description = param?.description;
    try {
      const directories = await sql `
        update channel_directory
        set title = ${title ? title : sql`title`},
          description = ${description ? description : sql`description`},
          updated = current_timestamp at time zone 'UTC'
        where channel = ${id} and directory = ${directory_id}
        returning channel, directory, title, description, created, updated
      `
      if (directories.length == 0) {
        return {};
      }
      return directories[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async deleteDirectory(id: string, directory_id: string) {
    const context = {
      name: "channelRepository.deleteDirectory"
    };

    try {
      const directories = await sql `
        delete
        from channel_directory
        where channel = ${id} and directory = ${directory_id}
        returning channel, directory
      `
      if (directories.length == 0) {
        return {};
      }
      return directories[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  }
}