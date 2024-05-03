import { SiteResourceParam } from "../model/siteResource.ts";
import { siteResourceRepository } from "../repository/siteResource.ts";

export const siteResourceService = {
  async create(site: string, {...reqBody}: SiteResourceParam) {
    return await siteResourceRepository.create(site, reqBody as SiteResourceParam);
  },
  async getAll(site: string) {
    return await siteResourceRepository.getAll(site);
  }
}