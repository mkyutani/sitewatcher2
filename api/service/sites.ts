import { log } from "../deps.ts";
import { SiteParam } from "../model/sites.ts";
import { resourceRepository } from "../repository/resources.ts";
import { siteRepository } from "../repository/sites.ts";
import { collectHtml } from "./htmlCollector.ts";

export const siteService = {
  async get(id: string) {
    return await siteRepository.get(parseInt(id, 10));
  },
  async getAll() {
    return await siteRepository.getAll();
  },
  async getResources(id: string) {
    return await resourceRepository.getAll(parseInt(id, 10));
  },
  async create({...reqBody}: SiteParam) {
    return await siteRepository.create(reqBody as SiteParam);
  },
  async update(id: string, {...reqBody}: SiteParam) {
    return await siteRepository.update(parseInt(id, 10), reqBody as SiteParam);
  },
  async updateResources(id: string) {
    const result = await siteService.get(id);
    if (!result) return null;
    else if (Object.keys(result).length == 0) return -1;

    const uriType = result.type.toLowerCase();
    const uri = result.uri;
    if (uriType.indexOf("html") == -1) {
      return 0;
    }

    const linkInfos =  await collectHtml(uri);
    const id_number = parseInt(id, 10);
    const failures = [];
    if (!await resourceRepository.markAll(id_number, '-')) {
      failures.push("marking");
    }
    for (const linkInfo of linkInfos) {
      if (!await resourceRepository.update(id_number, linkInfo.link, linkInfo.name, linkInfo.longName, true, 'm')) {
        failures.push(linkInfo.link);
      }
    }
    if (!await resourceRepository.removeAll(id_number, '-')) {
      failures.push("removing");
    }
    if (failures.length > 0) {
      log.error(`Error occurred during update resources: ${failures}`);
      return null;
    }
    return linkInfos.length;
  },
  async delete(id: string) {
    return await siteRepository.delete(parseInt(id, 10));
  },
  async deleteResources(id: string) {
    return await resourceRepository.deleteAll(parseInt(id, 10));
  }
}