import express from "express";
import cors from "cors";
import CreateTaskUseCase from "./services/create-task.js";
import DeleteTaskUseCase from "./services/delete-task.js";
import InMemoryTasksRepository from "./repositories/in-memory-tasks-repository.js";

const repository = new InMemoryTasksRepository();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "Server is healthy",
  });
});

app.post("/posts", async (req, res) => {
  const body = req.body;

  const service = new CreateTaskUseCase(repository);

  try {
    const response = await service.execute(body.name, body.description);
    res.status(response.statusCode).json(response);
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error;

      if (message === "Name and description are required") {
        return res.status(400).json({ message });
      }

      if (message === "A task with this name already exists") {
        return res.status(400).json({ message });
      }
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/posts", async (req, res) => {
  const { name } = req.body;

  const service = new DeleteTaskUseCase(repository);

  try {
    const response = await service.execute(name);
    res.status(response.statusCode).json(response);
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error;

      if (message === "Name is required") {
        return res.status(400).json({ message });
      }

      if (message === "A task with this name does not exists") {
        return res.status(404).json({ message });
      }
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3333, () => console.log("Server running"));
