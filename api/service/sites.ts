import { resourceRepository } from "../repository/resources.ts";
import { siteRepository } from "../repository/sites.ts";
import { collectHtml } from "./htmlCollector.ts";

export type createParam = {
  name: string,
  source: string,
  type: string
};

export type updateParam = {
  name: string,
  source: string,
  type: string
};

export const siteService = {
  async get(id: string) {
    return await siteRepository.get(parseInt(id, 10));
  },
  async getAll() {
    return await siteRepository.getAll();
  },
  async getLinks(id: string) {
    return await resourceRepository.getAll(parseInt(id, 10));
  },
  async create({...reqBody}: createParam) {
    return await siteRepository.create(reqBody.name, reqBody.source, reqBody.type);
  },
  async update(id: string, {...reqBody}: updateParam) {
    return await siteRepository.update(parseInt(id, 10), reqBody.name, reqBody.source, reqBody.type);
  },
  async updateLinks(id: string) {
    const id_number = parseInt(id, 10);
    return await siteRepository.get(id_number)
      .then((site) => {
        if (site) {
          const sourceType = site["type"].toLowerCase();
          const source = site["source"]
          if (sourceType == "html") {
            return collectHtml(source);
          }
        }
        return [];
      })
      .then((linkInfos) => {
        if (linkInfos.length > 0)
        for (const linkInfo of linkInfos) {
          resourceRepository.update(id_number, linkInfo.link, linkInfo.name, linkInfo.longName);
        }
        return {};
      })
  },
  async delete(id: string) {
    return await siteRepository.delete(parseInt(id, 10));
  }
}