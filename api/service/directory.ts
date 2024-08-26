import { DirectoryParam, DirectoryRuleParam } from "../model/directory.ts";
import { directoryRepository } from "../repository/directory.ts";

export const directoryService = {
  async create({...reqBody}: DirectoryParam) {
    return await directoryRepository.create(reqBody as DirectoryParam);
  },
  async get(id: string) {
    return await directoryRepository.get(id);
  },
  async list() {
    return await directoryRepository.list();
  },
  async update(id: string, {...reqBody}: DirectoryParam) {
    return await directoryRepository.update(id, reqBody as DirectoryParam);
  },
  async delete(id: string) {
    return await directoryRepository.delete(id);
  },
  async createRule(id: string, name: string, {...reqBody}: DirectoryRuleParam) {
    return await directoryRepository.createRule(id, name, reqBody);
  },
  async updateRule(id: string, name: string, tag: string, {...reqBody}: DirectoryRuleParam) {
    return await directoryRepository.updateRule(id, name, tag, reqBody);
  },
  async deleteRule(id: string, name: string, tag: string) {
    return await directoryRepository.deleteRule(id, name, tag);
  }
}