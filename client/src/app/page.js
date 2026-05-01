import PageShell from "@/components/layout/PageShell";
import TodoApp from "@/components/todos/TodoApp";

export default function Home() {
  return (
    <PageShell>
      <TodoApp />
    </PageShell>
  );
}
