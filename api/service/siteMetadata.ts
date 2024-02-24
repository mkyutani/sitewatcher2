import { siteMetadataRepository } from "../repository/siteMetadata.ts";

export const siteMetadataService = {
  async create(id: string, key: string, value: string) {
    return await siteMetadataRepository.create(id, key, value);
  },
  async get(id: string, key: string | null) {
    return await siteMetadataRepository.get(id, key);
  },
  async delete(id: string, key: string | null) {
    return await siteMetadataRepository.delete(id, key);
  }
}