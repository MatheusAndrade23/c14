import { assert, describe, it, beforeEach } from "poku";
import CreateTaskUseCase from "../../src/services/create-task";
import InMemoryTaskRepository from "../../src/repositories/in-memory-tasks-repository";
import { Task } from "../../src/interfaces/Task";

let sut: CreateTaskUseCase;
let inMemoryTaskRepository: InMemoryTaskRepository;

describe("[Unit Test] - CreateTaskUseCase", () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository();
    inMemoryTaskRepository.items = [];
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
    const existingTask = new Task("Task name", "Task description");

    inMemoryTaskRepository.items.push(existingTask);

    await assert.rejects(
      async () => {
        await sut.execute("Task name", "Task description");
      },
      {
        message: "A task with this name already exists",
      }
    );
  });

  it("should create task with different case sensitivity", async () => {
    const existingTask = new Task("Task Name", "Task description");
    inMemoryTaskRepository.items.push(existingTask);

    const response = await sut.execute("task name", "Different description");

    assert.equal(response.statusCode, 201);
    assert.equal(response.message, "Task created");
  });

  it("should create task with special characters in name", async () => {
    const response = await sut.execute(
      "Task-123_ABC!@#",
      "Task description with symbols $%^"
    );

    assert.equal(response.statusCode, 201);
    assert.equal(response.message, "Task created");
  });

  it("should create task with unicode characters", async () => {
    const response = await sut.execute(
      "Tarefa com acentos: ção",
      "Descrição com emojis 🚀"
    );

    assert.equal(response.statusCode, 201);
    assert.equal(response.message, "Task created");
  });

  it("should trim whitespace but preserve internal spaces in name and description", async () => {
    const response = await sut.execute(
      "  Task with spaces  ",
      "  Description with   multiple spaces  "
    );

    assert.equal(response.statusCode, 201);
    assert.equal(response.message, "Task created");
  });

  it("should fail if both name and description are empty", async () => {
    await assert.rejects(
      async () => {
        await sut.execute("", "");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should fail if both name and description are whitespace", async () => {
    await assert.rejects(
      async () => {
        await sut.execute("   ", "   ");
      },
      {
        message: "Name and description are required",
      }
    );
  });
});
