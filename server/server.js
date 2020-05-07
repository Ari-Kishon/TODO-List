const express = require("express");
const bodyParser = require("body-parser");

const tasks = [];
const getTaskByID = (id) => tasks.find((obj) => obj.id === id);

const server = express();
server.use(bodyParser.urlencoded({
  extended: true
}));
server.get("/", (req, res) => res.send("no path specified"));
server.get("/tasks", (req, res) => res.send(JSON.stringify(tasks)));
server.get("/tasks/:id", getTaskFromServer);
server.listen(8080);

function getTaskFromServer({
  params: {
    id
  }
}, res) {
  const task = tasks.find((obj) => obj.id === id);
  if (task) {
    res.send(task.task);
  } else {
    res.status(500).send(`task:"${id}" was not found`);
  }
}