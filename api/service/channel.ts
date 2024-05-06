import { ChannelDirectoryParam, ChannelParam } from "../model/channel.ts";
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
/*
  async getDirectory(id: string, directory_id: string) {
    return await channelRepository.get(id, directory_id);
  },
  async listDirectories(id: string) {
    return await channelRepository.list(id);
  },
*/
  async updateDirectory(id: string, directory_id: string, {...reqBody}: ChannelDirectoryParam) {
    return await channelRepository.updateDirectory(id, directory_id, reqBody as ChannelDirectoryParam);
  },
  async deleteDirectory(id: string, directory_id: string) {
    return await channelRepository.deleteDirectory(id, directory_id);
  }
}