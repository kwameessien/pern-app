const pool = require("../db");

async function createTodo(title, completed = false) {
  const query = `
    INSERT INTO todos (title, completed)
    VALUES ($1, $2)
    RETURNING id, title, completed, created_at
  `;
  const { rows } = await pool.query(query, [title, completed]);
  return rows[0];
}

async function getAllTodos() {
  const query = `
    SELECT id, title, completed, created_at
    FROM todos
    ORDER BY id ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getTodoById(id) {
  const query = `
    SELECT id, title, completed, created_at
    FROM todos
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function updateTodo(id, title, completed) {
  const query = `
    UPDATE todos
    SET title = $1, completed = $2
    WHERE id = $3
    RETURNING id, title, completed, created_at
  `;
  const { rows } = await pool.query(query, [title, completed, id]);
  return rows[0] || null;
}

async function deleteTodo(id) {
  const query = `
    DELETE FROM todos
    WHERE id = $1
    RETURNING id, title, completed, created_at
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
