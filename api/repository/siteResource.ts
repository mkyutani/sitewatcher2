import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteResourceParam } from "../model/siteResource.ts";

export const siteResourceRepository = {
  async create(site: string, siteResourceParam: SiteResourceParam) {
    const context = {
      name: "siteResourceRepository.create"
    };

    const uri = siteResourceParam?.uri;
    const properties = siteResourceParam?.properties;

    context.name = "siteResourceRepository.create.map"
    const properties_kv = Object.keys(properties).map(key => {
      return {
        key: key,
        value: properties[key]
      };
    });

    try {
      const resource = await sql.begin(async sql => {
        context.name = "siteResourceRepository.create.insertResource"
        const new_resources = await sql`
          insert
          into resource (uri, site, tm)
          values (${uri}, ${site}, current_timestamp at time zone 'UTC')
          returning id, uri, site, tm
        `
        const new_resource = new_resources[0];

        context.name = `siteResourceRepository.create.insertProperty`
        properties_kv.forEach(async (property) => {
          await sql`
            insert
            into resource_property (resource, key, value)
            values
              (${new_resource.id}, ${property.key}, ${property.value})
          `
        });

        return {
          id: new_resource.id,
          uri: new_resource.uri,
          site: new_resource.site,
          tm: new_resource.tm,
          properties: properties_kv
        };
      });

      return resource;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`${context.name}:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid directory id";
        }
      }
      log.error(`${context.name}:${description}`);
      return null;
    }
  },
  async getAll(site: string) {
    const context = {
      name: "siteResourceRepository.getAll"
    };

    try {
      context.name = "siteResourceRepository.getAll.getResources";
      const resources = await sql `
        select
          r.id, r.uri, r.site, r.tm
        from resource as r
        inner join site as s on r.site = s.id
        where r.site = ${site}
      `

      context.name = "siteResourceRepository.getAll.getProperties";
      for (const resource of resources) {
        const properties = await sql `
          select
            key, value
          from resource_property
          where resource = ${resource.id}
        `
        resource.properties = properties;
      }

      return resources;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${description}`);
      return null;
    }
  }
}