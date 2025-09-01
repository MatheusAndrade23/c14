import express from "express";
import cors from "cors";
import CreateTaskUseCase from "./services/create-task.js";
import InMemoryTasksRepository from "./repositories/in-memory-tasks-repository.js";

const app = express();

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

  const repository = new InMemoryTasksRepository();
  const service = new CreateTaskUseCase(repository);

  const response = await service.execute(body.name, body.description);

  res.status(response.statusCode).json(response);
});

app.listen(3333, () => console.log("Server running"));
