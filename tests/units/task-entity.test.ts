import { assert, describe, it } from "poku";
import { Task } from "../../src/interfaces/Task";

describe("[Unit Test] - Task Entity", () => {
  it("should create a task with valid name and description", () => {
    const task = new Task("Valid Task Name", "Valid task description");

    assert.equal(task.name, "Valid Task Name");
    assert.equal(task.description, "Valid task description");
  });

  it("should fail to create task with empty name", () => {
    assert.throws(
      () => {
        new Task("", "Valid description");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should fail to create task with whitespace-only name", () => {
    assert.throws(
      () => {
        new Task("   ", "Valid description");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should fail to create task with empty description", () => {
    assert.throws(
      () => {
        new Task("Valid name", "");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should fail to create task with whitespace-only description", () => {
    assert.throws(
      () => {
        new Task("Valid name", "   ");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should fail to create task with both empty name and description", () => {
    assert.throws(
      () => {
        new Task("", "");
      },
      {
        message: "Name and description are required",
      }
    );
  });

  it("should create task with name and description containing only valid characters", () => {
    const task = new Task(
      "Task-123_ABC",
      "Description with numbers 456 and symbols!"
    );

    assert.equal(task.name, "Task-123_ABC");
    assert.equal(task.description, "Description with numbers 456 and symbols!");
  });

  it("should preserve whitespace in valid name and description", () => {
    const task = new Task(
      "Task with spaces",
      "Description with multiple   spaces"
    );

    assert.equal(task.name, "Task with spaces");
    assert.equal(task.description, "Description with multiple   spaces");
  });

  it("should handle unicode characters in name and description", () => {
    const task = new Task(
      "Tarefa com acentos: ção",
      "Descrição com emojis 🚀 e caracteres especiais ñ"
    );

    assert.equal(task.name, "Tarefa com acentos: ção");
    assert.equal(
      task.description,
      "Descrição com emojis 🚀 e caracteres especiais ñ"
    );
  });
});
