//====================================================================//

let requestBody = null;
let queryParameters = null;
let databaseQuery = null;
let databaseResponseBody = null;
let responseBody = null;
let appLibFunctions = null;

//====================================================================//

const { server, getConnection } = require("./server.js");

//=========================SERVER FUNCTION============================//

const filterQuery = async (request, response, next) => {
  queryParameters = request.query;
  const { status, priority, category } = queryParameters;
  const statusList = ["TO DO", "IN PROGRESS", "DONE"];
  const priorityList = ["HIGH", "MEDIUM", "LOW"];
  const categoryList = ["WORK", "HOME", "LEARNING"];
  if ("status" in queryParameters && !statusList.includes(status)) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (
    "priority" in queryParameters &&
    !priorityList.includes(priority)
  ) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (
    "category" in queryParameters &&
    !categoryList.includes(category)
  ) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    next();
  }
};

//=========================SERVER FUNCTION============================//

const getTodos = async (request, response, next) => {
  queryParameters = request.query;
  let date = request.userDate;
  const { status, priority, category, dueDate, search_q } = queryParameters;
  if (status !== undefined && priority !== undefined) {
    databaseQuery = `SELECT * FROM todo WHERE status = '${status}' AND priority = '${priority}'`;
    databaseResponseBody = await databaseConnection.all(databaseQuery);
    response.send(databaseResponseBody.map((a) => statusTodo(a)));
  } else if (status !== undefined && priority === undefined) {
    databaseQuery = `SELECT * FROM todo WHERE status = '${status}'`;
    databaseResponseBody = await databaseConnection.all(databaseQuery);
    response.send(databaseResponseBody.map((a) => statusTodo(a)));
  } else if (status === undefined && priority !== undefined) {
    databaseQuery = `SELECT * FROM todo WHERE priority = '${priority}'`;
    databaseResponseBody = await databaseConnection.all(databaseQuery);
    response.send(databaseResponseBody.map((a) => statusTodo(a)));
  } else if (status !== undefined && category !== undefined) {
    databaseQuery = `SELECT * FROM todo WHERE status = '${status}' AND category = '${category}'`;
    databaseResponseBody = await databaseConnection.all(databaseQuery);
    response.send(databaseResponseBody.map((a) => oneTodo(a)));
  } else if (status === undefined && category !== undefined) {
    databaseQuery = `SELECT * FROM todo WHERE category = '${category}'`;
    databaseResponseBody = await databaseConnection.all(databaseQuery);
    response.send(databaseResponseBody.map((a) => oneTodo(a)));
  } else if (search_q !== undefined) {
    databaseQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`;
    databaseResponseBody = await databaseConnection.all(databaseQuery);
    response.send(databaseResponseBody.map((a) => oneTodo(a)));
  } else if (date !== undefined) {
    databaseQuery = `SELECT * FROM todo WHERE due_date = '${date}'`;
    databaseResponseBody = await databaseConnection.all(databaseQuery);
    response.send(databaseResponseBody.map((a) => oneTodo(a)));
  }
};

//=========================SERVER FUNCTION============================//

const getTodo = async (request, response, next) => {
  const { todoId } = request.params;
  databaseQuery = `SELECT * FROM todo WHERE id = ${todoId}`;
  databaseResponseBody = await databaseConnection.get(databaseQuery);
  response.send(oneTodo(databaseResponseBody));
};

//=========================SERVER FUNCTION============================//

const createTodo = async (request, response, next) => {
  const { id, todo, priority, status, category } = request.body;
  let dueDate = request.userDate;
  databaseQuery = `INSERT INTO todo(id, todo, priority, status, category, due_date) VALUES(${id},'${todo}','${priority}','${status}','${category}','${dueDate}')`;
  databaseResponseBody = await databaseConnection.run(databaseQuery);
  response.send("Todo Successfully Added");
};

//=========================SERVER FUNCTION============================//

const updateTodo = async (request, response, next) => {
  requestBody = request.body;
  const { todoId } = request.params;
  const userDate = request.userDate;
  const { todo, status, priority, category, dueDate } = requestBody;
  if (status !== undefined) {
    databaseQuery = `UPDATE todo SET status = '${status}' WHERE id = ${todoId}`;
    await databaseConnection.run(databaseQuery);
    console.log(databaseQuery);
    response.send("Status Updated");
  } else if (todo !== undefined) {
    databaseQuery = `UPDATE todo SET todo = '${todo}' WHERE id = ${todoId}`;
    await databaseConnection.run(databaseQuery);
    response.send("Todo Updated");
  } else if (priority !== undefined) {
    databaseQuery = `UPDATE todo SET priority = '${priority}' WHERE id = ${todoId}`;
    await databaseConnection.run(databaseQuery);
    response.send("Priority Updated");
  } else if (category !== undefined) {
    databaseQuery = `UPDATE todo SET category = '${category}' WHERE id = ${todoId}`;
    await databaseConnection.run(databaseQuery);
    response.send("Category Updated");
  } else if (dueDate !== undefined) {
    databaseQuery = `UPDATE todo SET due_date = '${userDate}' WHERE id = ${todoId}`;
    await databaseConnection.run(databaseQuery);
    response.send("Due Date Updated");
  }
};

//=========================SERVER FUNCTION============================//

const valiDate = async (request, response, next) => {
  const { date } = request.query;
  const format = require("date-fns/format");
  const isValid = require("date-fns/isValid");
  let userDate = new Date(date);
  if (isValid(userDate)) {
    userDate = format(userDate, "yyyy-MM-dd");
    request.userDate = userDate;
    next();
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
};

//=========================SERVER FUNCTION============================//

const valiDateTodo = async (request, response, next) => {
  queryParameters = request.body;
  const { status, priority, category, dueDate } = queryParameters;
  const statusList = ["TO DO", "IN PROGRESS", "DONE"];
  const priorityList = ["HIGH", "MEDIUM", "LOW"];
  const categoryList = ["WORK", "HOME", "LEARNING"];
  const format = require("date-fns/format");
  const isValid = require("date-fns/isValid");
  let userDate = new Date(dueDate);
  if ("status" in queryParameters && !statusList.includes(status)) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (
    "priority" in queryParameters &&
    !priorityList.includes(priority)
  ) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (
    "category" in queryParameters &&
    !categoryList.includes(category)
  ) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if ("dueDate" in queryParameters && !isValid(userDate)) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    userDate = format(userDate, "yyyy-MM-dd");
    request.userDate = userDate;
    next();
  }
};

//=========================SERVER FUNCTION============================//

const valiDatePutTodo = async (request, response, next) => {
  queryParameters = request.body;
  const { status, priority, category, dueDate } = queryParameters;
  const statusList = ["TO DO", "IN PROGRESS", "DONE"];
  const priorityList = ["HIGH", "MEDIUM", "LOW"];
  const categoryList = ["WORK", "HOME", "LEARNING"];
  if ("status" in queryParameters && !statusList.includes(status)) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (
    "priority" in queryParameters &&
    !priorityList.includes(priority)
  ) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (
    "category" in queryParameters &&
    !categoryList.includes(category)
  ) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if ("dueDate" in queryParameters) {
    const format = require("date-fns/format");
    const isValid = require("date-fns/isValid");
    let userDate = new Date(dueDate);
    if (isValid(userDate)) {
      userDate = format(userDate, "yyyy-MM-dd");
      request.userDate = userDate;
      next();
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    next();
  }
};

//=========================SERVER FUNCTION============================//

const deleteTodo = async (request, response, next) => {
  const { todoId } = request.params;
  databaseQuery = `DELETE FROM todo WHERE id = ${todoId}`;
  databaseResponseBody = await databaseConnection.run(databaseQuery);
  response.send("Todo Deleted");
};

//=========================SERVER FUNCTION============================//

const statusTodo = (todoObj) => {
  return {
    id: todoObj.id,
    todo: todoObj.todo,
    priority: todoObj.priority,
    category: todoObj.category,
    status: todoObj.status,
    dueDate: todoObj.due_date,
  };
};

//=========================SERVER FUNCTION============================//

const oneTodo = (todoObj) => {
  return {
    id: todoObj.id,
    todo: todoObj.todo,
    priority: todoObj.priority,
    status: todoObj.status,
    category: todoObj.category,
    dueDate: todoObj.due_date,
  };
};

//=========================SERVER FUNCTION============================//

appLib = {
  filterQuery: filterQuery,
  getTodos: getTodos,
  getTodo: getTodo,
  valiDate: valiDate,
  createTodo: createTodo,
  valiDateTodo: valiDateTodo,
  updateTodo: updateTodo,
  valiDatePutTodo: valiDatePutTodo,
  deleteTodo: deleteTodo,
};

//====================================================================//

getConnection("todoApplication.db").then((connection) => {
  databaseConnection = connection;
});

//====================================================================//

exports.server = server;
exports.appLib = appLib;

//====================================================================//
