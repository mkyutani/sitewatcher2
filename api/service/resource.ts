import { resourceRepository } from "../repository/resource.ts";

export const resourceService = {
  async get(id: string) {
    return await resourceRepository.get(id);
  }
}