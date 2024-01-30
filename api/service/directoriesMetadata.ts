import { directoryMetadataRepository } from "../repository/directoriesMetadata.ts";

export const directoryMetadataService = {
  async create(id: string | null, {...reqBody}: any) {
    return await directoryMetadataRepository.createOrUpdate(id, reqBody as any);
  },
  async get(id: string | null, key: string) {
    return await directoryMetadataRepository.get(id, key);
  },
  async getAll(id: string) {
    return await directoryMetadataRepository.getAll(id);
  },
  async update(id: string | null, {...reqBody}: any) {
    return await directoryMetadataRepository.createOrUpdate(id, reqBody as any);
  },
  async delete(id: string | null, key: string) {
    return await directoryMetadataRepository.delete(id, key);
  },
  async deleteAll(id: string) {
    return await directoryMetadataRepository.deleteAll(id);
  }
}