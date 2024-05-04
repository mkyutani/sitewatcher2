import { ChannelParam } from "../model/channel.ts";
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
  async getResources(id: string, last: number) {
    return await channelRepository.getResources(id, last);
  },
  async update(id: string, {...reqBody}: ChannelParam) {
    return await channelRepository.update(id, reqBody as ChannelParam);
  },
  async delete(id: string) {
    return await channelRepository.delete(id);
  }
}