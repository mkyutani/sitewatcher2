import { SiteParam } from "../model/site.ts";
import { siteRepository } from "../repository/site.ts";

export const siteService = {
  async create({...reqBody}: SiteParam) {
    return await siteRepository.create(reqBody as SiteParam);
  },
  async get(id: string) {
    return await siteRepository.get(id);
  },
  async getAll(name: string | null, directory_id: string | null, strict: boolean | null, all: boolean | null, metadata: boolean | null) {
    return await siteRepository.getAll(name, directory_id, strict, all, metadata);
  },
  async update(id: string, {...reqBody}: SiteParam) {
    return await siteRepository.update(id, reqBody as SiteParam);
  },
  async delete(id: string) {
    return await siteRepository.delete(id);
  }
}