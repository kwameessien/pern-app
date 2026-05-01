const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require("../services/todoService");

function badRequest(message, details) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "BAD_REQUEST";
  error.details = details;
  return error;
}

function notFound(message, details) {
  const error = new Error(message);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  error.details = details;
  return error;
}

function parseTodoId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest("Todo id must be a positive integer", { id: rawId });
  }
  return id;
}

async function createTodoHandler(req, res, next) {
  try {
    const { title, completed = false } = req.body || {};
    if (typeof title !== "string" || title.trim() === "") {
      throw badRequest("Field 'title' is required", { field: "title" });
    }
    if (typeof completed !== "boolean") {
      throw badRequest("Field 'completed' must be a boolean", { field: "completed" });
    }

    const todo = await createTodo(title.trim(), completed);
    res.status(201).json({ status: "ok", data: todo });
  } catch (error) {
    next(error);
  }
}

async function getTodosHandler(_req, res, next) {
  try {
    const todos = await getAllTodos();
    res.status(200).json({ status: "ok", data: todos });
  } catch (error) {
    next(error);
  }
}

async function getTodoByIdHandler(req, res, next) {
  try {
    const id = parseTodoId(req.params.id);
    const todo = await getTodoById(id);

    if (!todo) {
      throw notFound("Todo not found", { id });
    }

    res.status(200).json({ status: "ok", data: todo });
  } catch (error) {
    next(error);
  }
}

async function updateTodoHandler(req, res, next) {
  try {
    const id = parseTodoId(req.params.id);
    const { title, completed } = req.body || {};

    if (typeof title !== "string" || title.trim() === "") {
      throw badRequest("Field 'title' is required", { field: "title" });
    }
    if (typeof completed !== "boolean") {
      throw badRequest("Field 'completed' must be a boolean", { field: "completed" });
    }

    const updatedTodo = await updateTodo(id, title.trim(), completed);
    if (!updatedTodo) {
      throw notFound("Todo not found", { id });
    }

    res.status(200).json({ status: "ok", data: updatedTodo });
  } catch (error) {
    next(error);
  }
}

async function deleteTodoHandler(req, res, next) {
  try {
    const id = parseTodoId(req.params.id);
    const deletedTodo = await deleteTodo(id);

    if (!deletedTodo) {
      throw notFound("Todo not found", { id });
    }

    res.status(200).json({ status: "ok", data: deletedTodo });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTodoHandler,
  getTodosHandler,
  getTodoByIdHandler,
  updateTodoHandler,
  deleteTodoHandler,
};
