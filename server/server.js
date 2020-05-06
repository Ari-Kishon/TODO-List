const http = require("http");
const express = require("express");

const tasks = [];

const server = express();
server.get("/", (req, res) => res.send("no path specified"));
server.get("/tasks", (req, res) => res.send(JSON.stringify(tasks)));
server.get("/tasks/:id", function (req, res) {
  const id = req.params.id;
  const task = tasks.find((obj) => obj.id == id);
  if (task) {
    res.send(task.task);
  } else {
    res.send(`task:"${id}" was not found`);
  }
});
server.listen(8080);
