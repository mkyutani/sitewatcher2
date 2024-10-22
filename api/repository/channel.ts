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
          cd.directory as id, d.name as name, cd.title, cd.description, cd.priority, cd.created, cd.updated
        from channel_directory as cd
        inner join directory as d on cd.directory = d.id
        where cd.channel = ${id}
        order by cd.priority
      `

      context.name = "channelRepository.get.getSites";
      channel.sites = await sql `
        select
          cs.site as id, s.name as name, cs.title, cs.description, cs.priority, cs.created, cs.updated
        from channel_site as cs
        inner join site as s on cs.site = s.id
        where cs.channel = ${id}
        order by cs.priority
      `

      context.name = "channelRepository.get.getDevices";
      const devices = await sql `
        select
          name, interface, apikey, tag, template, created, updated
        from channel_device
        where channel = ${id}
      `
      channel.devices = {};
      for (const device of devices) {
        channel.devices[device.name] = device;
      }

      context.name = "channelRepository.get.getDeviceLogs";
      const device_logs = await sql `
        select
          cd.name, cdl.timestamp
        from channel_device_log as cdl
        inner join channel_device as cd on cd.id = cdl.device
        where cdl.device in (
          select id
          from channel_device
          where channel = ${id}
        )
        order by cdl.timestamp
      `
      for (const device_log of device_logs) {
        if (!channel.devices[device_log.name].timestamps) {
          channel.devices[device_log.name].timestamps = [];
        }
        channel.devices[device_log.name].timestamps.push(device_log.timestamp);
      }

      context.name = "channelRepository.get.getTimestamps";
      const timestamps = await sql `
        select distinct timestamp
        from channel_history
        where channel = ${id}
        order by timestamp
      `
      channel.timestamps = [];
      for (const timestamp of timestamps) {
        channel.timestamps.push(timestamp.timestamp);
      }

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
        into channel_directory (channel, directory, title, description, priority, created, updated)
        values (${id}, ${directory_id}, ${title}, ${description},
          to_char(current_timestamp at time zone 'UTC', 'YYYYMMDDHH24MISSUS')||'0000',
          current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
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
    const priority = param?.priority;
    try {
      const directories = await sql `
        update channel_directory
        set title = ${title ? title : sql`title`},
          description = ${description ? description : sql`description`},
          priority = ${priority ? priority : sql`priority`},
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
        into channel_site (channel, site, title, description, priority, created, updated)
        values (${id}, ${site_id}, ${title}, ${description},
          to_char(current_timestamp at time zone 'UTC', 'YYYYMMDDHH24MISSUS')||'0000',
          current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
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
    const priority = param?.priority;
    try {
      const channel_sites = await sql `
        update channel_site
        set title = ${title ? title : sql`title`},
          description = ${description ? description : sql`description`},
          priority = ${priority ? priority : sql`priority`},
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
    const tag = param?.tag;
    const apikey = param?.apikey;
    const template = param?.template;
    try {
      const channel_devices = await sql `
        insert
        into channel_device (channel, name, interface, tag, apikey, template, created, updated)
        values (${id}, ${device_name}, ${inf}, ${tag}, ${apikey}, ${template}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning channel, name
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
    const tag = param?.tag;
    const apikey = param?.apikey;
    const template = param?.template;
    try {
      const channel_devices = await sql `
        update channel_device
        set interface = ${inf ? inf : sql`interface`},
          tag = ${tag ? tag : sql`tag`},
          apikey = ${apikey ? apikey : sql`apikey`},
          template = ${template ? template : sql`template`},
          updated = current_timestamp at time zone 'UTC'
        where channel = ${id} and name = ${device_name}
        returning channel, name, interface, tag, apikey, template, created, updated
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
        where channel = ${id} and name = ${device_name}
        returning channel, name
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
  },
  async collectResources(id: string) {
    const context = {
      name: "channelRepository.collectResources"
    };

    try {
      const history_items = await sql `
        insert into channel_history (channel, uri, resource, timestamp)
          select u.channel, u.uri, u.resource, to_char(current_timestamp at time zone 'UTC', 'YYYYMMDDHH24MISSUS') as timestamp
          from (
            select s.channel, r.uri, s.site, s.site_name, r.id as resource, r.timestamp as timestamp
            from (
              select cd.channel, s1.id, s1.id as site, s1.name as site_name, cd.priority
              from channel_directory as cd
              inner join site as s1 on s1.directory = cd.directory
              where cd.channel = ${id}
              union
              select cs.channel, s2.id, s2.id as site, s2.name as site_name, cs.priority
              from channel_site as cs
              inner join site as s2 on s2.id = cs.site
              where cs.channel = ${id}
            ) as s
            inner join resource as r on r.site = s.id
            order by s.priority
          ) as u
          where not exists (
            select uri
            from channel_history as ch
            where ch.channel = ${id}
            and u.uri = ch.uri
          )
          and u.timestamp > (
            select timestamp
            from channel_history
            where channel = ${id}
            union
            select '00000000000000000000' as timestamp
            group by timestamp
            order by timestamp desc
            limit 1
          )
        on conflict do nothing
        returning channel, uri, resource, timestamp
      `
      return history_items;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async getResourcesByDevice(id: string, device_name: string, timestamp: string | null, logging: boolean) {
    const context = {
      name: "channelRepository.getResourcesByDevice"
    };

    try {
      const history_items = await sql.begin(async sql => {
        context.name = "channelRepository.getResourcesByDevice.getDevice";
        const channel_devices = await sql `
          select id
          from channel_device
          where channel = ${id} and name = ${device_name}
        `
        if (channel_devices.length === 0) {
          return "No such a device";
        }
        const channel_device_id = channel_devices[0].id;

        const latest_timestamp = await (async () => {
          context.name = "channelRepository.getResourcesByDevice.getLatestTimestamp";
          if (timestamp) {
            return null;
          } else {
            const latest_device_log = await sql `
              select max(timestamp) as timestamp
              from channel_device_log
              where device = ${channel_device_id}
            `

            if (latest_device_log.length === 0) {
              return null;
            } else {
              return latest_device_log[0].timestamp;
            }
          }
        })();

        if (!timestamp && !latest_timestamp) {
          if (logging) {
            context.name = "channelRepository.getResourcesByDevice.setOnlyLogOnInitialCall";
            const updated_timestamps = await sql `
              insert into channel_device_log (device, timestamp)
              values (${channel_device_id}, to_char(current_timestamp at time zone 'UTC', 'YYYYMMDDHH24MISSUS'))
            `
          }
          return [];
        }

        context.name = "channelRepository.getResourcesByDevice.getLatestResources";
        const history_items = await sql `
          select ch.channel, c.name as channel_name, ch.resource, ch.uri, s.id as site, s.name as site_name, s.uri as site_uri, d.id as directory, d.name as directory_name, ch.timestamp
          from channel_history as ch
          inner join channel as c on c.id = ch.channel
          inner join resource as r on r.id = ch.resource
          inner join site as s on s.id = r.site
          inner join directory as d on d.id = s.directory
          inner join (
            select site, min(timestamp) as initial_update_timestamp
            from resource
            group by site
          ) as ir on ir.site = r.site
          where ch.channel = ${id}
          ${timestamp ? sql`
            and ch.timestamp = ${timestamp}
          ` : sql`
            and ${latest_timestamp} > ir.initial_update_timestamp
            and ch.timestamp > ${latest_timestamp}
            order by ch.timestamp desc
          `}
        `

        context.name = "channelRepository.getResources.collectKeyValues";
        for (const history_item of history_items) {
          history_item.kv = await sql `
            select r.key, r.value
            from resource_property as r
            where r.resource = ${history_item.resource}
          `
        }

        if (!timestamp && latest_timestamp !== null && history_items.length > 0) {
          if (logging) {
            context.name = "channelRepository.getResourcesByDevice.setLatestTimestamp";
            const updated_timestamps = await sql `
              insert into channel_device_log (device, timestamp)
              values (${channel_device_id}, to_char(current_timestamp at time zone 'UTC', 'YYYYMMDDHH24MISSUS'))
            `
          }
        }

        return history_items;
      });
      return history_items;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async getResources(id: string, timestamp: string | null) {
    const context = {
      name: "channelRepository.getResources"
    };

    try {
      const history_items = await sql `
        select ch.channel, c.name as channel_name, ch.resource, ch.uri, s.id as site, s.name as site_name, s.uri as site_uri, d.id as directory, d.name as directory_name, ch.timestamp
        from channel_history as ch
        inner join channel as c on c.id = ch.channel
        inner join resource as r on r.id = ch.resource
        inner join site as s on s.id = r.site
        inner join directory as d on d.id = s.directory
        where c.id = ${id}
        ${timestamp ? sql`
          and ch.timestamp = ${timestamp}
        ` : sql`
          order by ch.timestamp desc
        `}
      `

      context.name = "channelRepository.getResources.collectKeyValues";
      for (const history_item of history_items) {
        history_item.kv = await sql `
          select r.key, r.value
          from resource_property as r
          where r.resource = ${history_item.resource}
        `
      }

      return history_items;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  }
}