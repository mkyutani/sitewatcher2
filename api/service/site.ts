import { SiteParam, SiteResourceParam, SiteRuleParam } from "../model/site.ts";
import { siteRepository } from "../repository/site.ts";

export const siteService = {
  async create({...reqBody}: SiteParam) {
    return await siteRepository.create(reqBody as SiteParam);
  },
  async get(id: string) {
    return await siteRepository.get(id);
  },
  async list() {
    return await siteRepository.list();
  },
  async update(id: string, {...reqBody}: SiteParam) {
    return await siteRepository.update(id, reqBody as SiteParam);
  },
  async delete(id: string) {
    return await siteRepository.delete(id);
  },
  async registerResource(site: string, {...reqBody}: SiteResourceParam) {
    return await siteRepository.registerResource(site, reqBody as SiteResourceParam);
  },
  async updateResource(site: string, {...reqBody}: SiteResourceParam) {
    return await siteRepository.updateResource(site, reqBody as SiteResourceParam);
  },
  async deleteResource(site: string, {...reqBody}: SiteResourceParam) {
    return await siteRepository.deleteResource(site, reqBody as SiteResourceParam);
  },
  async getAllResources(site: string) {
    return await siteRepository.getAllResources(site);
  },
  async createOrUpdateRule(id: string, category: string, weight: number, {...reqBody}: SiteRuleParam) {
    return await siteRepository.createOrUpdateRule(id, category, weight, reqBody);
  },
  async deleteRule(id: string, category: string, min: number, max: number) {
    return await siteRepository.deleteRule(id, category, min, max);
  },
  async deleteRules(id: string, category: string) {
    return await siteRepository.deleteRules(id, category);
  }
}