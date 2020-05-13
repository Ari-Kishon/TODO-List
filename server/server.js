const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = 8080;

const tasks = [];
const addNewTask = (id, text) =>
  tasks.push({
    id,
    text,
    complete: false,
  });

const server = express();
server.use(express.static(path.join(__dirname, "..")));
server.use(bodyParser.json());
server.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../app", "index.html"))
);
server.get("/tasks", getAllTasks);
server.post("/", (req, res) => res.send("no path specified"));
server.post("/task", updateTask);
server.delete("/task", removeTask);
server.listen(PORT, () =>
  console.log(`The server is listening at: localhost:${PORT}`)
);

function getAllTasks(req, res) {
  res.send(JSON.stringify(tasks));
  res.status(200).end();
}

function updateTask(req, res) {
  const text = req.body.text;
  const id = req.body.id;
  const task = tasks.find((obj) => obj.id === id);
  if (task) {
    if (req.body.toggle) {
      task.complete = !task.complete;
      res.status(200).send(`${task.complete}`).end();
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

function removeTask(req, res) {
  const id = req.body.id;
  if (id) {
    const index = tasks.findIndex((obj) => obj.id === id);
    if (index < 0) {
      res.status(500).send(`task:"${id}" was not found`);
    }
    tasks.splice(index, 1);
    res.status(200);
  } else {
    res.status(500).send("invalid request");
  }
  res.end();
}