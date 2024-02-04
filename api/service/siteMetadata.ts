import { siteMetadataRepository } from "../repository/siteMetadata.ts";

export const siteMetadataService = {
  async create(id: string | null, {...reqBody}: any, name: string | null, strict_flag: boolean | null) {
    return await siteMetadataRepository.createOrUpdate(id, reqBody as any, name, strict_flag);
  },
  async get(id: string | null, key: string, name: string | null, strict_flag : boolean | null) {
    return await siteMetadataRepository.get(id, key, name, strict_flag);
  },
  async getAll(id: string) {
    return await siteMetadataRepository.getAll(id);
  },
  async update(id: string | null, {...reqBody}: any, name: string | null, strict_flag: boolean | null) {
    return await siteMetadataRepository.createOrUpdate(id, reqBody as any, name, strict_flag);
  },
  async delete(id: string | null, key: string, name: string | null, strict_flag : boolean | null) {
    return await siteMetadataRepository.delete(id, key, name, strict_flag);
  },
  async deleteAll(id: string) {
    return await siteMetadataRepository.deleteAll(id);
  }
}