import { Task } from "../interfaces/Task.js";

export interface ITasksRepository {
  create(task: Task): Promise<void>;
}
