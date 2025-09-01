import { assert, describe, it, beforeEach } from "poku";
import CreateTaskUseCase from "../../src/services/create-task";
import InMemoryTaskRepository from "../../src/repositories/in-memory-tasks-repository";
import { Task } from "../../src/interfaces/Task";

let sut: CreateTaskUseCase;
let inMemoryTaskRepository: InMemoryTaskRepository;

describe("[Unit Test] - CreateTaskUseCase", () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository();
    sut = new CreateTaskUseCase(inMemoryTaskRepository);
  });

  it("should create a task", async () => {
    const response = await sut.execute("Task name", "Task description");

    assert.equal(response.statusCode, 201);
    assert.equal(response.message, "Task created");
  });

  it("should fail if name is invalid", async () => {
    await assert.rejects(
      async () => {
        await sut.execute(" ", "Task description");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should fail if description is invalid", async () => {
    await assert.rejects(
      async () => {
        await sut.execute("Task name", "   ");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should fail if task with same name already exists", async () => {
    const existingTask = new Task({
      name: "Task name",
      description: "Task description",
    });

    inMemoryTaskRepository.items.push(existingTask);

    await assert.rejects(
      async () => {
        await sut.execute("Task name", "Task description");
      },
      {
        message: "Task with same name already exists",
      }
    );
  });
});
