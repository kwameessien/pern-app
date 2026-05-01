"use client";

import { useEffect, useState } from "react";
import TodoSidebar from "@/components/todos/TodoSidebar";
import TodoCalendarHeader from "@/components/todos/TodoCalendarHeader";
import TodoComposerPanel from "@/components/todos/TodoComposerPanel";
import TodoCalendarGrid from "@/components/todos/TodoCalendarGrid";

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
    <section className="mx-auto flex w-full max-w-[1280px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <TodoSidebar />

      <div className="flex min-h-[82vh] flex-1 flex-col">
        <TodoCalendarHeader />

        <div className="flex-1 bg-[#fafbfc] p-4 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
            <TodoComposerPanel
              todosCount={todos.length}
              newTitle={newTitle}
              onTitleChange={setNewTitle}
              onSubmit={handleCreateTodo}
              isSubmitting={isSubmitting}
              actionError={actionError}
              isLoading={isLoading}
              loadError={loadError}
              onRetryLoad={handleRetryLoad}
            />

            <TodoCalendarGrid
              todos={todos}
              activeTodoId={activeTodoId}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
