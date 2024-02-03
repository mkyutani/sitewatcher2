import { taskRepository } from "../repository/task.ts";

export const taskService = {
  async get(id: string) {
    return await taskRepository.get(id);
  },
  async getAll() {
    return await taskRepository.getAll();
  },
  async delete(id: string) {
    return await taskRepository.delete(id);
  }
}