import PageShell from "@/components/layout/PageShell";

export default function Home() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">PERN Todo App</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Frontend is ready. Next step: connect this UI to the Express API.
      </p>
    </PageShell>
  );
}
