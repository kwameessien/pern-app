"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getApiErrorMessage(response, fallbackMessage) {
  try {
    const payload = await response.json();
    return payload?.error?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  async function loadTodos() {
    setIsLoading(true);
    setLoadError("");

    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      const message = await getApiErrorMessage(
        response,
        `Failed to load todos (${response.status})`,
      );
      throw new Error(message);
    }

    const payload = await response.json();
    setTodos(payload.data || []);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadTodosOnMount() {
      try {
        await loadTodos();
        if (!isMounted) return;
      } catch (err) {
        if (!isMounted) return;
        setLoadError(err.message || "Failed to load todos");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    loadTodosOnMount();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateTodo(event) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    try {
      setIsSubmitting(true);
      setActionError("");
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(
          response,
          `Failed to create todo (${response.status})`,
        );
        throw new Error(message);
      }

      const payload = await response.json();
      setTodos((prev) => [...prev, payload.data]);
      setNewTitle("");
    } catch (err) {
      setActionError(err.message || "Failed to create todo");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleTodo(todo) {
    try {
      setActiveTodoId(todo.id);
      setActionError("");
      const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: todo.title,
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(
          response,
          `Failed to update todo (${response.status})`,
        );
        throw new Error(message);
      }

      const payload = await response.json();
      setTodos((prev) =>
        prev.map((item) => (item.id === todo.id ? payload.data : item)),
      );
    } catch (err) {
      setActionError(err.message || "Failed to update todo");
    } finally {
      setActiveTodoId(null);
    }
  }

  async function handleDeleteTodo(todoId) {
    try {
      setActiveTodoId(todoId);
      setActionError("");
      const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(
          response,
          `Failed to delete todo (${response.status})`,
        );
        throw new Error(message);
      }

      setTodos((prev) => prev.filter((item) => item.id !== todoId));
    } catch (err) {
      setActionError(err.message || "Failed to delete todo");
    } finally {
      setActiveTodoId(null);
    }
  }

  async function handleRetryLoad() {
    try {
      setLoadError("");
      await loadTodos();
    } catch (err) {
      setLoadError(err.message || "Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-8 w-full max-w-2xl">
      <form onSubmit={handleCreateTodo} className="flex gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="Add a new todo..."
          className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>

      {actionError ? (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading todos...</p>
        ) : loadError ? (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-3">
            <p className="text-sm text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={handleRetryLoad}
              className="mt-2 rounded-md border border-red-300 bg-white px-3 py-1 text-xs text-red-700"
            >
              Retry
            </button>
          </div>
        ) : todos.length === 0 ? (
          <p className="text-sm text-zinc-500">No todos yet.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTodo(todo)}
                    disabled={activeTodoId === todo.id}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs disabled:opacity-60"
                  >
                    {todo.completed ? "Mark pending" : "Mark done"}
                  </button>
                  <span className="text-sm">{todo.title}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      todo.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTodo(todo.id)}
                  disabled={activeTodoId === todo.id}
                  className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 disabled:opacity-60"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
