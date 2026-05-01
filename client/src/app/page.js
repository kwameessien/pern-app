import PageShell from "@/components/layout/PageShell";
import TodoApp from "@/components/todos/TodoApp";
import { APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="mt-3 text-sm text-zinc-600">Create and view your todos.</p>
      <TodoApp />
    </PageShell>
  );
}
