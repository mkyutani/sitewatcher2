import sql from "./db.ts"
import { log } from "../deps.ts";
import { DirectoryParam } from "../model/directory.ts";

export const directoryRepository = {
  async get(id: string) {
    const context = {
      name: "directoryRepository.get"
    };

    try {
      context.name = "directoryRepository.get.getDirectory";
      const directories = await sql `
        select
          id, name, created, updated
        from directory
        where id = ${id}
      `
      if (directories.length == 0) {
        return {};
      }

      const directory = directories[0];

      context.name = "directoryRepository.get.getSites";
      directory.sites = await sql `
        select
          s.id, s.name, s.uri, s.directory, d.name as directory_name, s.created, s.updated
        from site as s
        inner join directory as d on s.directory = d.id
        where s.directory = ${directory.id}
      `

      context.name = "directoryRepository.get.getRules";
      for (let i = 0; i < directory.sites.length; i++) {
        const site = directory.sites[i];
        context.name = "siteRepository.get.getRules";
        const rules = await sql `
          select
            sr.id, src.name as rule_category_name, sr.tag, sr.value, sr.created, sr.updated
          from site_rule as sr
          inner join rule_category as src on sr.category = src.id
          where sr.site = ${site['id']}
          order by src.name, sr.tag
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
      }

      return directory;
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
      name: "directoryRepository.search"
    };

    try {
      const directories = await sql `
        select
          id, name
        from directory
      `
      return directories;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${description}`);
      return null;
    }
  },
  async create(DirectoryParam: DirectoryParam) {
    const context = {
      name: "directoryRepository.create"
    };

    const name = DirectoryParam?.name;
    try {
      const directories = await sql `
        insert
        into directory (name,created, updated)
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
  async update(id: string, param: DirectoryParam) {
    const context = {
      name: "directoryRepository.update"
    };

    const name = param?.name;
    try {
      const directories = await sql `
        update directory
        set name = ${name ? name : sql`name`},
          updated = current_timestamp at time zone 'UTC'
        where id = ${id}
        returning *
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
      name: "directoryRepository.delete"
    };

    try {
      const directories = await sql `
        delete
        from directory
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
  }
}