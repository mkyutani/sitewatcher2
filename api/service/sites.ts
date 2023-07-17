import { log } from "../deps.ts";
import { resourceRepository } from "../repository/resources.ts";
import { siteRepository } from "../repository/sites.ts";
import { collectHtml } from "./htmlCollector.ts";

export type createParam = {
  name: string,
  source: string,
  type: string,
  enabled: boolean
};

export type updateParam = {
  name: string,
  source: string,
  type: string,
  enabled: boolean
};

export const siteService = {
  async get(id: string) {
    const result = await siteRepository.get(parseInt(id, 10));
    if (!result) {
      return 500;
    } else if (Object.keys(result).length == 0) {
      return 404;
    }
    return result;
  },
  async getAll() {
    const result = await siteRepository.getAll();
    if (!result) {
      return 500;
    }
    return result;
  },
  async getResources(id: string) {
    const result = await resourceRepository.getAll(parseInt(id, 10));
    if (!result) {
      return 500;
    }
    return result;
  },
  async create({...reqBody}: createParam) {
    const result = await siteRepository.create(reqBody.name, reqBody.source, reqBody.type, reqBody.enabled);
    if (!result) {
      return 500;
    }
    return result;
  },
  async update(id: string, {...reqBody}: updateParam) {
    const result = await siteRepository.update(parseInt(id, 10), reqBody.name, reqBody.source, reqBody.type, reqBody.enabled);
    if (!result) {
      return 500;
    } else if (Object.keys(result).length == 0) {
      return 404;
    }
    return result;
  },
  async updateResources(id: string) {
    const site = await siteService.get(id);
    if (typeof site === "number") {
      return site;
    }
    const sourceType = site["type"].toLowerCase();
    const source = site["source"];
    if (sourceType.indexOf("html") == -1) {
      return 403;
    }

    const linkInfos =  await collectHtml(source);
    const id_number = parseInt(id, 10);
    const failures = [];
    if (!resourceRepository.markAll(id_number, '')) {
      failures.push("marking");
    }
    for (const linkInfo of linkInfos) {
      if (!resourceRepository.update(id_number, linkInfo.link, linkInfo.name, linkInfo.longName, true, 'm')) {
        failures.push(linkInfo.link);
      }
    }
    if (!resourceRepository.removeAll(id_number, '')) {
      failures.push("removing");
    }
    if (failures.length > 0) {
      log.error(`Error occurred during update resources: ${failures}`);
      return 500;
    }
    return {};
  },
  async delete(id: string) {
    const result = await siteRepository.delete(parseInt(id, 10));
    if (!result) {
      return 500;
    }
    return result;
  },
  async deleteResources(id: string) {
    const result = await resourceRepository.deleteAll(parseInt(id, 10));
    if (!result) {
      return 500;
    }
    return result;
  }
}