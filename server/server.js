const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const D_PORT = 8080;

const tasks = [];
const addNewTask = (id, text) =>
  tasks.push({
    id,
    text,
    complete: false,
  });

//
////
////// SERVER
////
//
// server setup
const server = express();
server.use(express.static(path.join(__dirname, "..")));
server.use(bodyParser.json());
// GET requests
server.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../app", "index.html"))
);
server.get("/tasks", getAllTasks);
server.get("/tasks/:id", getTask);
// POST requests
server.post("/", (req, res) => res.send("no path specified"));
server.post("/tasks", saveTask);
server.post("/tasks/complete", toggleTask);
server.post("/tasks/rename", renameTask);
server.post("/tasks/remove", removeTask);
// server action
server.listen(D_PORT, () =>
  console.log(`The server is listening on port :${D_PORT}`)
);

//
///
///// SERVER FUNCTIONS
///
//
function getTask({ params: { id } }, res) {
  const task = tasks.find((obj) => obj.id === id);
  if (task) {
    res.status(200).send(task);
  } else {
    res.status(500).send(`task:"${id}" was not found`);
  }
  res.end();
}

function getAllTasks(req, res) {
  res.send(JSON.stringify(tasks));
  res.status(200).end();
}

function saveTask(req, res) {
  const text = req.body.Text;
  if (text) {
    const id = Date.now();
    addNewTask(id, text);
    res.status(200).send(`${id}`);
  } else {
    res.status(500).send("invalid request");
  }
  res.end();
}

function toggleTask(req, res) {
  const id = req.body.id;
  const task = tasks.find((obj) => obj.id === id);
  if (task) {
    task.complete = !task.complete;
    res.status(200).send(`${task.complete}`);
  } else {
    res.status(500).send(`task:"${id}" was not found`);
  }
  res.end();
}

function renameTask(req, res) {
  const task = tasks.find((obj) => obj.id === req.body.id);
  if (task) {
    task.text = req.body.Text;
    res.status(200);
  } else {
    res.status(500).send(`task:"${id}" was not found`);
  }
  res.end();
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
