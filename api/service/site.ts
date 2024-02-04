import { SiteParam } from "../model/site.ts";
import { siteRepository } from "../repository/site.ts";

export const siteService = {
  async create({...reqBody}: SiteParam) {
    return await siteRepository.create(reqBody as SiteParam);
  },
  async get(id: string) {
    return await siteRepository.get(id);
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    return await siteRepository.getAll(name, strict_flag, sort);
  },
  async update(id: string, {...reqBody}: SiteParam) {
    return await siteRepository.update(id, reqBody as SiteParam);
  },
  async delete(id: string) {
    return await siteRepository.delete(id);
  }
}