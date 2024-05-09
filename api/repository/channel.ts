import sql from "./db.ts"
import { log } from "../deps.ts";
import { ChannelDeviceParam, ChannelDirectoryParam, ChannelParam, ChannelSiteParam } from "../model/channel.ts";

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
          cd.directory as id, d.name as name, cd.title, cd.description, cd.created, cd.updated
        from channel_directory as cd
        inner join directory as d on cd.directory = d.id
        where cd.channel = ${id}
      `

      context.name = "channelRepository.get.getSites";
      channel.sites = await sql `
        select
          cs.site as id, s.name as name, cs.title, cs.description, cs.created, cs.updated
        from channel_site as cs
        inner join site as s on cs.site = s.id
        where cs.channel = ${id}
      `

      context.name = "channelRepository.get.getDevices";
      channel.devices = await sql `
        select
          device as name, interface, header, body, created, updated
        from channel_device
        where channel = ${id}
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
      const channels = await sql `
        select
          id, name
        from channel
      `
      return channels;
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
      const channels = await sql `
        insert
        into channel (name,created, updated)
        values (${name}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning id
      `
      return channels[0];
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
      const channels = await sql `
        update channel
        set name = ${name ? name : sql`name`},
          updated = current_timestamp at time zone 'UTC'
        where id = ${id}
        returning id, name, created, updated
      `
      if (channels.length == 0) {
        return {};
      }
      return channels[0];
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
      const channels = await sql `
        delete
        from channel
        where id = ${id}
        returning id
      `
      if (channels.length == 0) {
        return {};
      }
      return channels[0];
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
  },
  async addSite(id: string, site_id: string, param: ChannelSiteParam) {
    const context = {
      name: "channelRepository.addSite"
    };

    const title = param?.title;
    const description = param?.description;
    try {
      const channel_sites = await sql `
        insert
        into channel_site (channel, site, title, description, created, updated)
        values (${id}, ${site_id}, ${title}, ${description}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning channel, site
      `
      return channel_sites[0];
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
  async updateSite(id: string, site_id: string, param: ChannelSiteParam) {
    const context = {
      name: "channelRepository.updateSite"
    };

    const title = param?.title;
    const description = param?.description;
    try {
      const channel_sites = await sql `
        update channel_site
        set title = ${title ? title : sql`title`},
          description = ${description ? description : sql`description`},
          updated = current_timestamp at time zone 'UTC'
        where channel = ${id} and site = ${site_id}
        returning channel, site, title, description, created, updated
      `
      if (channel_sites.length == 0) {
        return {};
      }
      return channel_sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async deleteSite(id: string, site_id: string) {
    const context = {
      name: "channelRepository.deleteSite"
    };

    try {
      const channel_sites = await sql `
        delete
        from channel_site
        where channel = ${id} and site = ${site_id}
        returning channel, site
      `
      if (channel_sites.length == 0) {
        return {};
      }
      return channel_sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async addDevice(id: string, device_name: string, param: ChannelDeviceParam) {
    const context = {
      name: "channelRepository.addDevice"
    };

    const inf = param?.interface;
    const header = param?.header;
    const body = param?.body;
    try {
      const channel_devices = await sql `
        insert
        into channel_device (channel, device, interface, header, body, created, updated)
        values (${id}, ${device_name}, ${inf}, ${header}, ${body}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning channel, device
      `
      return channel_devices[0];
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
  async updateDevice(id: string, device_name: string, param: ChannelDeviceParam) {
    const context = {
      name: "channelRepository.updateDevice"
    };

    const inf = param?.interface;
    const header = param?.header;
    const body = param?.body;
    try {
      const channel_devices = await sql `
        update channel_device
        set interface = ${inf ? inf : sql`interface`},
          header = ${header ? header : sql`header`},
          body = ${body ? body : sql`body`},
          updated = current_timestamp at time zone 'UTC'
        where channel = ${id} and device = ${device_name}
        returning channel, device, interface, header, body, created, updated
      `
      if (channel_devices.length == 0) {
        return {};
      }
      return channel_devices[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}`;
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async deleteDevice(id: string, device_name: string) {
    const context = {
      name: "channelRepository.deleteDevice"
    };

    try {
      const channel_devices = await sql `
        delete
        from channel_device
        where channel = ${id} and device = ${device_name}
        returning channel, device
      `
      if (channel_devices.length == 0) {
        return {};
      }
      return channel_devices[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  }
}