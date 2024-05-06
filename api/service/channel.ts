import { ChannelDirectoryParam, ChannelParam, ChannelSiteParam } from "../model/channel.ts";
import { channelRepository } from "../repository/channel.ts";

export const channelService = {
  async create({...reqBody}: ChannelParam) {
    return await channelRepository.create(reqBody as ChannelParam);
  },
  async get(id: string) {
    return await channelRepository.get(id);
  },
  async list() {
    return await channelRepository.list();
  },
/*
  async getResources(id: string, last: number) {
    return await channelRepository.getResources(id, last);
  },
*/
  async update(id: string, {...reqBody}: ChannelParam) {
    return await channelRepository.update(id, reqBody as ChannelParam);
  },
  async delete(id: string) {
    return await channelRepository.delete(id);
  },
  async addDirectory(id: string, directory_id: string, {...reqBody}: ChannelDirectoryParam) {
    return await channelRepository.addDirectory(id, directory_id, reqBody as ChannelDirectoryParam);
  },
  async updateDirectory(id: string, directory_id: string, {...reqBody}: ChannelDirectoryParam) {
    return await channelRepository.updateDirectory(id, directory_id, reqBody as ChannelDirectoryParam);
  },
  async deleteDirectory(id: string, directory_id: string) {
    return await channelRepository.deleteDirectory(id, directory_id);
  },
  async addSite(id: string, site_id: string, {...reqBody}: ChannelSiteParam) {
    return await channelRepository.addSite(id, site_id, reqBody as ChannelSiteParam);
  },
  async updateSite(id: string, site_id: string, {...reqBody}: ChannelSiteParam) {
    return await channelRepository.updateSite(id, site_id, reqBody as ChannelSiteParam);
  },
  async deleteSite(id: string, site_id: string) {
    return await channelRepository.deleteSite(id, site_id);
  }
}