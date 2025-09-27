import { assert, describe, it, beforeEach } from "poku";
import DeleteTaskUseCase from "../../src/services/delete-task";
import InMemoryTaskRepository from "../../src/repositories/in-memory-tasks-repository";
import { Task } from "../../src/interfaces/Task";

let sut: DeleteTaskUseCase;
let inMemoryTaskRepository: InMemoryTaskRepository;

describe("[Unit Test] - DeleteTaskUseCase", () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository();
    inMemoryTaskRepository.items = [];
    sut = new DeleteTaskUseCase(inMemoryTaskRepository);
  });

  it("should delete a task", async () => {
    const existingTask = new Task("Task to delete", "Task description");
    inMemoryTaskRepository.items.push(existingTask);

    const response = await sut.execute("Task to delete");

    assert.equal(response.statusCode, 204);
    assert.equal(response.message, "Task deleted successfully");
  });

  it("should fail if name is empty", async () => {
    await assert.rejects(
      async () => {
        await sut.execute("");
      },
      {
        message: "Name is required",
      }
    );
  });

  it("should fail if name is only whitespace", async () => {
    await assert.rejects(
      async () => {
        await sut.execute("   ");
      },
      {
        message: "Name is required",
      }
    );
  });

  it("should fail if task does not exist", async () => {
    await assert.rejects(
      async () => {
        await sut.execute("Non-existent task");
      },
      {
        message: "A task with this name does not exists",
      }
    );
  });

  it("should delete only the specified task when multiple tasks exist", async () => {
    const task1 = new Task("Task 1", "Description 1");
    const task2 = new Task("Task 2", "Description 2");
    const task3 = new Task("Task 3", "Description 3");

    inMemoryTaskRepository.items.push(task1, task2, task3);

    const response = await sut.execute("Task 2");

    assert.equal(response.statusCode, 204);
    assert.equal(response.message, "Task deleted successfully");
    assert.equal(inMemoryTaskRepository.items.length, 2);

    const remainingTasks = inMemoryTaskRepository.items.map(
      (task) => task.name
    );
    assert.ok(remainingTasks.includes("Task 1"));
    assert.ok(remainingTasks.includes("Task 3"));
    assert.ok(!remainingTasks.includes("Task 2"));
  });
});
