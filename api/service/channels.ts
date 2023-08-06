import { ChannelParam } from "../model/channels.ts";
import { channelRepository } from "../repository/channels.ts";

export const channelService = {
  async get(id: string) {
    return await channelRepository.get(id);
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    return await channelRepository.getAll(name, strict_flag, sort);
  },
  async create({...reqBody}: ChannelParam) {
    return await channelRepository.create(reqBody as ChannelParam);
  },
  async update(id: string, {...reqBody}: ChannelParam) {
    return await channelRepository.update(id, reqBody as ChannelParam);
  },
  async delete(id: string) {
    return await channelRepository.delete(id);
  },
}