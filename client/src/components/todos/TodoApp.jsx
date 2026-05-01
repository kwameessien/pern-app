"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTodosOnMount() {
      try {
        const response = await fetch(`${API_BASE_URL}/todos`);
        if (!response.ok) {
          throw new Error(`Failed to load todos (${response.status})`);
        }
        const payload = await response.json();
        if (!isMounted) return;
        setError("");
        setTodos(payload.data || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load todos");
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
      setError("");
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo (${response.status})`);
      }

      const payload = await response.json();
      setTodos((prev) => [...prev, payload.data]);
      setNewTitle("");
    } catch (err) {
      setError(err.message || "Failed to create todo");
    } finally {
      setIsSubmitting(false);
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

      {error ? (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className="text-sm text-zinc-500">No todos yet.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
              >
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
