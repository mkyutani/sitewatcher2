import { resourceDatabase } from "../db/resources.ts";
import { siteDatabase } from "../db/sites.ts";
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
    return await siteDatabase.get(parseInt(id, 10));
  },
  async getAll() {
    return await siteDatabase.getAll();
  },
  async getLinks(id: string) {
    return await resourceDatabase.getAll(parseInt(id, 10));
  },
  async create({...reqBody}: createParam) {
    return await siteDatabase.create(reqBody.name, reqBody.source, reqBody.type);
  },
  async update(id: string, {...reqBody}: updateParam) {
    return await siteDatabase.update(parseInt(id, 10), reqBody.name, reqBody.source, reqBody.type);
  },
  async updateLinks(id: string) {
    const id_number = parseInt(id, 10);
    return await siteDatabase.get(id_number)
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
          resourceDatabase.update(id_number, linkInfo.link, linkInfo.name, linkInfo.longName);
        }
        return {};
      })
  },
  async delete(id: string) {
    return await siteDatabase.delete(parseInt(id, 10));
  }
}