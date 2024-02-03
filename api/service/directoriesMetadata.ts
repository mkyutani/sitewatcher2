import { directoryMetadataRepository } from "../repository/directoriesMetadata.ts";

export const directoryMetadataService = {
  async create(id: string | null, {...reqBody}: any, name: string | null, strict_flag: boolean | null) {
    return await directoryMetadataRepository.createOrUpdate(id, reqBody as any, name, strict_flag);
  },
  async get(id: string | null, key: string, name: string | null, strict_flag : boolean | null) {
    return await directoryMetadataRepository.get(id, key, name, strict_flag);
  },
  async getAll(id: string) {
    return await directoryMetadataRepository.getAll(id);
  },
  async update(id: string | null, {...reqBody}: any, name: string | null, strict_flag: boolean | null) {
    return await directoryMetadataRepository.createOrUpdate(id, reqBody as any, name, strict_flag);
  },
  async delete(id: string | null, key: string, name: string | null, strict_flag : boolean | null) {
    return await directoryMetadataRepository.delete(id, key, name, strict_flag);
  },
  async deleteAll(id: string) {
    return await directoryMetadataRepository.deleteAll(id);
  }
}