import { IOkResponse } from '../interfaces/OkResponse.js';
import { Task } from '../interfaces/Task.js';
import { ITasksRepository } from '../repositories/ITasksRepository.js';

export default class CreateTaskUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(name: string, description: string): Promise<IOkResponse> {
    if (!name.trim()) {
      throw new Error('Name and description are required');
    }

    const task = new Task({
      name,
      description,
    });

    await this.tasksRepository.create(task);

    return {
      statusCode: 201,
      message: 'Task created',
    };
  }
}
