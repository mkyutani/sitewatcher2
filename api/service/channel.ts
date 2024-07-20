import { log } from "../deps.ts";
import { ChannelDeviceParam, ChannelDirectoryParam, ChannelParam, ChannelSiteParam } from "../model/channel.ts";
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
  },
  async addDevice(id: string, device_name: string, {...reqBody}: ChannelDeviceParam) {
    return await channelRepository.addDevice(id, device_name, reqBody as ChannelDeviceParam);
  },
  async updateDevice(id: string, device_name: string, {...reqBody}: ChannelDeviceParam) {
    return await channelRepository.updateDevice(id, device_name, reqBody as ChannelDeviceParam);
  },
  async deleteDevice(id: string, device_name: string) {
    return await channelRepository.deleteDevice(id, device_name);
  },
  async collectResources(id: string) {
    return await channelRepository.collectResources(id);
  },
  async getResourcesByDevice(id: string, device_name: string, logFlag: boolean | null) {
    return await channelRepository.getResourcesByDevice(id, device_name, logFlag);
  },
  async getResources(id: string) {
    return await channelRepository.getResources(id);
  }
}