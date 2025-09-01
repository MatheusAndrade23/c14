import { Task } from "../interfaces/Task.js";
import { ITasksRepository } from "./ITasksRepository.js";

export default class InMemoryTasksRepository implements ITasksRepository {
  public items: Task[] = [];

  create(newTask: Task): Promise<void> {
    const existingTask = this.items.find(
      (existingTask) => existingTask.name === newTask.name
    );

    if (existingTask) {
      throw new Error("Task with same name already exists");
    }

    this.items.push(newTask);

    return Promise.resolve();
  }
}
