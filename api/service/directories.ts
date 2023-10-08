import { DirectoryParam } from "../model/directories.ts";
import { directoryRepository } from "../repository/directories.ts";
import { TaskParam } from "../model/tasks.ts";
import { taskRepository } from "../repository/tasks.ts";

export const directoryService = {
  async get(id: string) {
    return await directoryRepository.get(id);
  },
  async getAll(name: string | null, strict_flag: boolean | null, sort: string | null) {
    return await directoryRepository.getAll(name, strict_flag, sort);
  },
  async create({...reqBody}: DirectoryParam) {
    return await directoryRepository.create(reqBody as DirectoryParam);
  },
  async update(id: string, {...reqBody}: DirectoryParam) {
    return await directoryRepository.update(id, reqBody as DirectoryParam);
  },
  async delete(id: string) {
    return await directoryRepository.delete(id);
  },
  async getCollector(id: string) {
    return await taskRepository.get(id);
  },
  async getCollectorByTarget(target: string) {
    return await taskRepository.getByTarget(target);
  },
  async createCollector(target: string) {
    return await taskRepository.create({ target: target, type: "directory", method: "collect" } as TaskParam);
  },
  async deleteCollector(id: string) {
    return await taskRepository.delete(id);
  },
  async deleteCollectorByTarget(target: string) {
    return await taskRepository.deleteByTarget(target);
  }
}