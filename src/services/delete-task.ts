import { IOkResponse } from "../interfaces/OkResponse.js";
import { ITasksRepository } from "../repositories/ITasksRepository.js";

export default class DeleteTaskUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(name: string): Promise<IOkResponse> {
    if (!name.trim()) {
      throw new Error("Name is required");
    }

    const task = await this.tasksRepository.findByName(name);

    if (!task) {
      throw new Error("A task with this name does not exists");
    }

    await this.tasksRepository.deleteByName(name);

    return {
      statusCode: 204,
      message: "Task deleted successfully",
    };
  }
}
