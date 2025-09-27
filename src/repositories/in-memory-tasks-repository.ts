import { Task } from "../interfaces/Task.js";
import { ITasksRepository } from "./ITasksRepository.js";

export default class InMemoryTasksRepository implements ITasksRepository {
  public items: Task[] = [];

  create(newTask: Task): Promise<void> {
    this.items.push(newTask);

    return Promise.resolve();
  }

  findByName(name: string): Promise<Task | null> {
    const existingTask = this.items.find(
      (existingTask) => existingTask.name === name
    );

    if (!existingTask) {
      return Promise.resolve(null);
    }

    return Promise.resolve(existingTask);
  }

  deleteByName(name: string): Promise<void> {
    const taskIndex = this.items.findIndex(
      (existingTask) => existingTask.name === name
    );

    if (taskIndex !== -1) {
      this.items.splice(taskIndex, 1);
    }

    return Promise.resolve();
  }
}
