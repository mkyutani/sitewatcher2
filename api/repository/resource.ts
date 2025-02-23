import sql from "./db.ts"
import { log } from "../deps.ts";

export const resourceRepository = {
  async get(id: string) {
    const context = {
      name: "resourceRepository.get"
    };

    try {
      const resources = await sql `
        select
          d.id as directory, d.name as directory_name,
          s.id as site, s.name as site_name, s.uri as site_uri,
          r.id as resource, r.uri as resource_uri
        from resource as r
        inner join site as s on s.id = r.site
        inner join directory as d on d.id = s.directory
        where r.id=${id}
      `

      if (resources.length == 0) {
        return {};
      }

      const resource = resources[0];

      context.name = "resourceRepository.get.collectKeyValues";
      resource.kv = await sql `
        select r.key, r.value
        from resource_property as r
        where r.resource = ${id}
      `
      return resource;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        log.warning(`${context.name}:${id}:${description}`);
        return {};
      }
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  }
}