import { directoryMetadataRepository } from "../repository/directoryMetadata.ts";

export const directoryMetadataService = {
  async create(id: string, key: string, value: string) {
    return await directoryMetadataRepository.create(id, key, value);
  },
  async get(id: string, key: string | null) {
    return await directoryMetadataRepository.get(id, key);
  },
  async delete(id: string, key: string | null) {
    return await directoryMetadataRepository.delete(id, key);
  }
}