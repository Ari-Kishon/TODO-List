import express from "express";
import type { Request, Response } from "express";
import type { Task, Tasks } from "../../types";
import bodyParser from "body-parser";
import path from "path";

const PORT = 8080;

const tasks: Tasks = [];

const addNewTask = (id: number, text: string) =>
  tasks.push({
    id,
    text,
    complete: false,
  });

const server = express();
server.use(express.static(path.join(__dirname, "../../..")));
server.use(bodyParser.json());
server.get("/", (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "../../../static", "index.html"))
);
server.get("/tasks", getAllTasks);
server.post("/", (req: Request, res: Response) =>
  res.send("no path specified")
);
server.post("/task", updateTask);
server.delete("/task", removeTask);
server.listen(PORT, () =>
  console.log(`The server is listening at: localhost:${PORT}`)
);

function getAllTasks(req: Request, res: Response) {
  res.send(JSON.stringify(tasks));
  res.status(200).end();
}

function updateTask(req: Request, res: Response) {
  const text: string = req.body.text;
  const id: number = req.body.id;
  const completed: boolean = req.body.completed;
  const task = tasks.find((task: Task) => task.id === id);
  if (task) {
    if (completed !== undefined) {
      task.complete = completed;
      res.status(200).send(`${completed}`).end();
    } else if (text !== undefined) {
      task.text = text;
      res.status(200).end();
    }
  } else {
    const id = Date.now();
    addNewTask(id, text);
    res.status(200).send(`${id}`).end();
  }
}

function removeTask(req: Request, res: Response) {
  const id: number = req.body.id;
  if (id) {
    const index = tasks.findIndex((task: Task) => task.id === id);
    if (index < 0) {
      res.status(500).send(`task:"${id}" was not found`);
    } else {
      tasks.splice(index, 1);
      res.status(200);
    }
  } else {
    res.status(500).send("invalid request");
  }
  res.end();
}
