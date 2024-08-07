import sql from "./db.ts"
import { log } from "../deps.ts";
import { SiteParam, SiteResourceParam, SiteRuleParam } from "../model/site.ts";

export const siteRepository = {
  async create(siteParam: SiteParam) {
    const context = {
      name: "siteRepository.create"
    };

    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const directory = siteParam?.directory;
    try {
      const sites = await sql `
        insert
        into site (uri, name, directory, created, updated)
        values (${uri}, ${name}, ${directory}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning id
      `
      return sites[0];
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
  async get(id: string) {
    const context = {
      name: "siteRepository.get"
    };

    try {
      const site = await sql.begin(async sql => {
        context.name = "siteRepository.get.getSites";
        const sites = await sql `
          select
            s.id, s.uri, s.name, s.directory, d.name as directory_name, s.created, s.updated
          from site as s
          inner join directory as d on s.directory = d.id
          where s.id = ${id}
        `
        if (sites.length == 0) {
          return {};
        }

        const site = sites[0];

        context.name = "siteRepository.get.getRules";
        const rules = await sql `
          select
            sr.id, src.name as rule_category_name, sr.weight, sr.value, sr.created, sr.updated
          from site_rule as sr
          inner join site_rule_category as src on sr.category = src.id
          where sr.site = ${id}
          order by src.name, sr.weight
        `

        site.rule_category_names = [];
        for (const rule of rules) {
          if (!site[rule.rule_category_name]) {
            site[rule.rule_category_name] = [];
          }
          site[rule.rule_category_name].push(rule);
          if (!site.rule_category_names.some((name: string) => name === rule.rule_category_name)) {
            site.rule_category_names.push(rule.rule_category_name)
          }
          delete rule.rule_category_name;
        }

        return site;
      });
      return site;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError && error.code === "22P02") {
        log.warning(`${context.name}:${id}:${description}`);
        return {};
      }
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async list() {
    const context = {
      name: "siteRepository.list"
    };

    try {
      const sites = await sql `
        select
          id, name
        from site
      `
      return sites;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${description}`);
      return null;
    }
  },
  async update(id: string, siteParam: SiteParam) {
    const context = {
      name: "siteRepository.update"
    };

    const uri = siteParam?.uri;
    const name = siteParam?.name;
    const directory = siteParam?.directory;
    try {
      const sites = await sql `
        update site
        set uri = ${uri ? uri : sql`uri`},
          name = ${name ? name : sql`name`},
          directory = ${directory ? directory : sql`directory`},
          updated = current_timestamp at time zone 'UTC'
        where id = ${id}
        returning *
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
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
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async delete(id: string) {
    const context = {
      name: "siteRepository.delete"
    };

    try {
      const sites = await sql `
        delete
        from site
        where id = ${id}
        returning id
      `
      if (sites.length == 0) {
        return {};
      }
      return sites[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${id}:${description}`);
      return null;
    }
  },
  async registerResource(site: string, siteResourceParam: SiteResourceParam) {
    const context = {
      name: "siteResourceRepository.registerResource"
    };

    const uri = siteResourceParam?.uri;
    const properties = siteResourceParam?.properties;

    try {
      context.name = "siteResourceRepository.registerResource.map"
      const properties_kv = Object.keys(properties).map(key => {
        return {
          key: key,
          value: properties[key]
        };
      });

      context.name = "siteResourceRepository.registerResource.startTransaction"
      const resource = await sql.begin(async sql => {
        context.name = "siteResourceRepository.registerResource.insertResource"
        const new_resources = await sql`
          insert
          into resource (uri, site, timestamp)
          values (${uri}, ${site}, to_char(current_timestamp at time zone 'UTC', 'YYYYMMDDHH24MISSUS'))
          returning id, uri, site, timestamp
        `
        const new_resource = new_resources[0];

        context.name = `siteResourceRepository.registerResource.insertProperty`
        properties_kv.push({ key: "timestamp", value: new_resource.timestamp });
        properties_kv.forEach(async (property) => {
          await sql`
            insert
            into resource_property (resource, key, value)
            values
              (${new_resource.id}, ${property.key}, ${property.value})
          `
        });

        context.name = `siteResourceRepository.registerResource.getSiteName`
        const site_names = await sql`
          select name
          from site
          where id = ${new_resource.site}
        `
        const site_name = site_names[0]

        return {
          id: new_resource.id,
          uri: new_resource.uri,
          site: new_resource.site,
          site_name: site_name.name,
          timestamp: new_resource.timestamp,
          properties: properties_kv
        };
      });

      return resource;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        switch (parseInt(error.code, 10)) {
        case 23505:
          return {}
        case 23503:
          return "Invalid directory id";
        }
      }
      log.error(`${context.name}:${description}`);
      return null;
    }
  },
  async getAllResources(site: string) {
    const context = {
      name: "siteResourceRepository.getAll"
    };

    try {
      context.name = "siteResourceRepository.getAll.getResources";
      const resources = await sql `
        select
          r.id, r.uri, r.site, s.name as site_name, r.timestamp
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
  },
  async createRule(site: string, name: string, siteRuleParam: SiteRuleParam) {
    const context = {
      name: "siteResourceRepository.createRule"
    };

    const weight = siteRuleParam?.weight;
    const value = siteRuleParam?.value;
    try {
      const site_rules = await sql `
        insert
        into site_rule (site, category, weight, value, created, updated)
        values (${site}, (select id from site_rule_category where name=${name}), ${weight}, ${value}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        returning id
      `
      return site_rules[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`${context.name}:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid site id";
        }
      }
      log.error(`${context.name}:${description}`);
      return null;
    }
  },
  async updateRule(site: string, name: string, weight: number, siteRuleParam: SiteRuleParam) {
    const context = {
      name: "siteResourceRepository.createRule"
    };

    const new_weight = siteRuleParam?.weight;
    const value = siteRuleParam?.value;
    try {
      const site_rules = await sql `
        update site_rule as sr
        set weight = ${weight ? weight : sql`weight`},
          value = ${value ? value : sql`value`},
          updated = current_timestamp at time zone 'UTC'
        from site_rule_category as src
        where sr.site = ${site} and sr.category = src.id and src.name = ${name} and sr.weight = ${weight}
        returning sr.id, sr.site, src.name, sr.weight, sr.value, sr.created, sr.updated
      `
      if (site_rules.length == 0) {
        return {};
      }
      return site_rules[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`${context.name}:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23505:
          return "Duplicated";
        case 23503:
          return "Invalid site id";
          }
      }
      log.error(`${context.name}:${site}.${name}.${weight}:${description}`);
      return null;
    }
  },
  async deleteRule(site: string, name: string, weight: number) {
    const context = {
      name: "siteResourceRepository.createRule"
    };

    try {
      const site_rules = await sql `
        delete
        from site_rule
        where site = ${site} and category = (select id from site_rule_category where name = ${name}) and weight = ${weight}
        returning id
      `
      if (site_rules.length == 0) {
        return {};
      }
      return site_rules[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${site}.${name}.${weight}:${description}`);
      return null;
    }
  }
}