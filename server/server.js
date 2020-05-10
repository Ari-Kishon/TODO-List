const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const tasks = [];
const addNewTask = (id, text) => tasks.push({
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
server.use(express.static('..'));
server.use(bodyParser.json());
// GET requests
server.get("/", (req, res) => res.sendFile(path.join(__dirname, '../app', 'index.html')));
server.get("/tasks", getAllTasksFromServer);
server.get("/tasks/:id", getTaskFromServer);
// POST requests
server.post("/", (req, res) => res.send("no path specified"));
server.post("/tasks", postTaskToServer);
server.post("/tasks/complete", toggleTaskInServer);
server.post("/tasks/rename", renameTaskInServer);
server.post("/tasks/remove", removeTaskFromServer);
// server action
server.listen(8080);


//
///
///// SERVER FUNCTIONS
///
//
function getTaskFromServer({
  params: {
    id
  }
}, res) {
  const task = tasks.find((obj) => obj.id === id);
  if (task) {
    res.send(task);
  } else {
    res.status(500).send(`task:"${id}" was not found`);
  }
}

function getAllTasksFromServer(req, res) {
  res.send((JSON.stringify(tasks)));
  res.end();
}

function postTaskToServer(req, res) {
  const text = req.body.Text;
  if (text) {
    const id = Date.now();
    addNewTask(id, text)
    res.send(`${id}`);
  } else {
    res.status(500);
    res.send("invalid request");
  }
  res.end();
}

function toggleTaskInServer(req, res) {
  const id = req.body.id;
  const task = tasks.find((obj) => obj.id === id);
  task.complete = !task.complete
  res.end(`${task.complete}`);
}

function renameTaskInServer(req, res) {
  const task = tasks.find((obj) => obj.id === req.body.id);
  if (task) {
    task.text = req.body.Text;
  } else {
    res.status(500).send(`task:"${id}" was not found`);
  }
  res.end();
}

function removeTaskFromServer(req, res) {
  const id = req.body.id;
  const index = tasks.findIndex((obj) => obj.id === id);
  if (index < 0) {
    throw new Error('could not remove task')
  }
  tasks.splice(index, 1);
  res.end();
}