import { directoryMetadataRepository } from "../repository/directoriesMetadata.ts";

export const directoryMetadataService = {
  async get(id: string, key: string) {
    return await directoryMetadataRepository.get(id, key);
  },
  async getAll(id: string) {
    return await directoryMetadataRepository.getAll(id);
  },
  async create(id: string, {...reqBody}: any) {
    return await directoryMetadataRepository.create(id, reqBody as any);
  },
  async update(id: string, {...reqBody}: any) {
    return await directoryMetadataRepository.update(id, reqBody as any);
  },
  async delete(id: string, key: string) {
    return await directoryMetadataRepository.delete(id, key);
  }
}