import { DirectoryParam } from "../model/directories.ts";
import { directoryRepository } from "../repository/directories.ts";

export const directoryService = {
  async create({...reqBody}: DirectoryParam) {
    return await directoryRepository.create(reqBody as DirectoryParam);
  },
  async get(id: string) {
    return await directoryRepository.get(id);
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    return await directoryRepository.getAll(name, strict_flag, sort);
  },
  async update(id: string, {...reqBody}: DirectoryParam) {
    return await directoryRepository.update(id, reqBody as DirectoryParam);
  },
  async delete(id: string) {
    return await directoryRepository.delete(id);
  }
}