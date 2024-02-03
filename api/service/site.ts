import { SiteParam } from "../model/site.ts";
//import { resourceRepository } from "../repository/resources.ts";
import { siteRepository } from "../repository/site.ts";
//import { collectHtml } from "./htmlCollector.ts";

export const siteService = {
  async get(id: string) {
    return await siteRepository.get(id);
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    return await siteRepository.getAll(name, strict_flag, sort);
  },
  /*
  async getResources(id: string) {
    return await resourceRepository.getAll(id);
  },
  */
  async create({...reqBody}: SiteParam) {
    return await siteRepository.create(reqBody as SiteParam);
  },
  async update(id: string, {...reqBody}: SiteParam) {
    return await siteRepository.update(id, reqBody as SiteParam);
  },
  /*
  async updateResources(id: string) {
    const result = await siteService.get(id);
    if (!result) return null;
    else if (Object.keys(result).length == 0) return { "count": 0 };

    const uriType = result.type.toLowerCase();
    const uri = result.uri;
    if (uriType.indexOf("html") == -1) {
      return { "count": 0 };
    }

    const resources =  await collectHtml(uri);
    if (!resources) {
      return { "count": 0 };
    }

    const count = await resourceRepository.createAll(id, resources);
    if (!count) return null;
    else {
      return { "count": parseInt(count.count, 10) };
    }
  },
  */
  async delete(id: string) {
    return await siteRepository.delete(id);
  },
  /*
  async deleteResources(id: string) {
    return await resourceRepository.deleteAll(id);
  }
  */
}