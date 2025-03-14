import sql from "./db.ts"
import { log } from "../deps.ts";
import { DirectoryParam, DirectoryRuleParam } from "../model/directory.ts";

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

      context.name = "directoryRepository.get.getDirectoryRules";
      const rules = await sql `
        select
          dr.id, drc.name as rule_category_name, dr.weight, dr.op, dr.dst, dr.src, dr.value, dr.created, dr.updated
        from directory_rule as dr
        inner join rule_category as drc on dr.category = drc.id
        where dr.directory = ${directory['id']}
        order by drc.name, dr.weight
      `

      directory.rule_category_names = [];
      for (const rule of rules) {
        if (!rule.op) delete rule.op;
        if (!rule.dst) delete rule.dst;
        if (!rule.src) delete rule.src;
        if (!rule.value) rule.value = "";
        if (!directory[rule.rule_category_name]) {
          directory[rule.rule_category_name] = [];
        }
        directory[rule.rule_category_name].push(rule);
        if (!directory.rule_category_names.some((name: string) => name === rule.rule_category_name)) {
          directory.rule_category_names.push(rule.rule_category_name)
        }
        delete rule.rule_category_name;
      }

      context.name = "directoryRepository.get.getSiteRules";
      for (let i = 0; i < directory.sites.length; i++) {
        const site = directory.sites[i];
        context.name = "directoryRepository.get.getRules";
        const rules = await sql `
          select
            sr.id, src.name as rule_category_name, sr.weight, sr.op, sr.dst, sr.src, sr.value, sr.created, sr.updated
          from site_rule as sr
          inner join rule_category as src on sr.category = src.id
          where sr.site = ${site['id']}
          order by src.name, sr.weight
        `

        site.rule_category_names = [];
        for (const rule of rules) {
          if (!rule.op) delete rule.op;
          if (!rule.dst) delete rule.dst;
          if (!rule.src) delete rule.src;
          if (!rule.value) delete rule.value;
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
  },
  async createOrUpdateRule(directory: string, category: string, weight: number, directoryRuleParam: DirectoryRuleParam) {
    const context = {
      name: "directoryResourceRepository.createOrUpdateRule"
    };

    const op = directoryRuleParam.op ? directoryRuleParam.op : null;
    const src = directoryRuleParam.src ? directoryRuleParam.src : null;
    const dst = directoryRuleParam.dst ? directoryRuleParam.dst : null;
    const value = directoryRuleParam.value ? directoryRuleParam.value : null;
    try {
      const directory_rules = await sql `
        insert
        into directory_rule (directory, category, weight, op, src, dst, value, created, updated)
        values (${directory}, (select id from rule_category where name=${category}), ${weight}, ${op}, ${src}, ${dst}, ${value}, current_timestamp at time zone 'UTC', current_timestamp at time zone 'UTC')
        on conflict (directory, category, weight)
        do update
        set
          op = ${op},
          src = ${src},
          dst = ${dst},
          value = ${value},
          updated = current_timestamp at time zone 'UTC'
        returning id, directory, ${category} as category_name, weight, op, src, dst, value, created, updated
      `
      if (directory_rules.length == 0) {
        return {};
      }
      return directory_rules[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      if (error instanceof sql.PostgresError) {
        log.warning(`${context.name}:PG${error.code}:${error.message}`);
        switch (parseInt(error.code, 10)) {
        case 23503:
          return "Invalid directory id";
        case 23502:
          return "Invalid category name";
        }
      }
      log.error(`${context.name}:${directory}.${category}.${weight}:${description}`);
      return null;
    }
  },
  async deleteRule(directory: string, category: string, min: number, max: number) {
    const context = {
      name: "directoryRepository.deleteRule"
    };

    try {
      const directory_rules = await sql `
        delete
        from directory_rule
        where directory = ${directory} and category = (select id from rule_category where name = ${category})
        ${min > 0 ? sql`and weight >= ${min}`: sql``}
        ${max > 0 ? sql`and weight <= ${max}`: sql``}
        returning id
      `
      if (directory_rules.length == 0) {
        return {};
      }
      return directory_rules[0];
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${directory}.${category}.${min}-${max}:${description}`);
      return null;
    }
  },
  async deleteRules(directory: string, category: string) {
    const context = {
      name: "directoryRepository.deleteRules"
    };

    try {
      const directory_rules = await sql `
        delete
        from directory_rule
        where directory = ${directory} and category = (select id from rule_category where name = ${category})
        returning id
      `
      if (directory_rules.length == 0) {
        return {};
      }
      return directory_rules;
    } catch (error) {
      const description = (error instanceof sql.PostgresError) ? `PG${error.code}:${error.message}` : `${error.name}:${error.message}` 
      log.error(`${context.name}:${directory}.${category}:${description}`);
      return null;
    }
  }
}