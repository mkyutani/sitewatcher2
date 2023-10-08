import { DirectoryParam } from "../model/directories.ts";
import { resourceRepository } from "../repository/resources.ts";
import { directoryRepository } from "../repository/directories.ts";
import { collectHtml } from "./htmlCollector.ts";

export const directoryService = {
  async get(id: string) {
    return await directoryRepository.get(id);
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    return await directoryRepository.getAll(name, strict_flag, sort);
  },
  async getResources(id: string) {
    return await resourceRepository.getAll(id);
  },
  async create({...reqBody}: DirectoryParam) {
    return await directoryRepository.create(reqBody as DirectoryParam);
  },
  async update(id: string, {...reqBody}: DirectoryParam) {
    return await directoryRepository.update(id, reqBody as DirectoryParam);
  },
  async collect(id: string) {
    const result = await directoryService.get(id);
    if (!result) return null;
    else if (Object.keys(result).length == 0) return { "count": 0 };

    const uriType = result.type.toLowerCase();
    const uri = result.uri;
    if (uriType.indexOf("html") == -1) {
      return { "count": 0 };
    }

    const resources =  await collectHtml(uri);
    if (!resources) {
      return { "count": 0 };
    }

    /*
    const count = await resourceRepository.createAll(id, resources);
    if (!count) return null;
    else {
      return { "count": parseInt(count.count, 10) };
    }
    */
  },
  async delete(id: string) {
    return await directoryRepository.delete(id);
  },
}