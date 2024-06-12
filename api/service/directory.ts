import { DirectoryParam } from "../model/directory.ts";
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
  }
}