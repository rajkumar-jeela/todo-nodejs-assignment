//====================================================================//

const { server, appLib } = require("./appLib.js");

const {
  filterQuery,
  getTodo,
  getTodos,
  valiDate,
  valiDateTodo,
  createTodo,
} = appLib;
const { updateTodo, valiDatePutTodo, deleteTodo } = appLib;

//==========================SERVER CODE===============================//

server.get("/todos/", filterQuery, getTodos, async (request, response) => {});
server.get("/todos/:todoId/", getTodo, async (request, response) => {});
server.get("/agenda/", valiDate, getTodos, async (request, response) => {});
server.post(
  "/todos/",
  valiDateTodo,
  createTodo,
  async (request, response) => {}
);
server.put(
  "/todos/:todoId/",
  valiDatePutTodo,
  updateTodo,
  async (request, response) => {}
);
server.delete("/todos/:todoId/", deleteTodo, async (request, response) => {});

//==========================SERVER CODE===============================//

module.exports = server;

//====================================================================//
