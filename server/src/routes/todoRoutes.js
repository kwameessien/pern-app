const express = require("express");
const {
  createTodoHandler,
  getTodosHandler,
  getTodoByIdHandler,
  updateTodoHandler,
  deleteTodoHandler,
} = require("../controllers/todoController");

const router = express.Router();

router.post("/", createTodoHandler);
router.get("/", getTodosHandler);
router.get("/:id", getTodoByIdHandler);
router.put("/:id", updateTodoHandler);
router.delete("/:id", deleteTodoHandler);

module.exports = router;
