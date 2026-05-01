export default function PageShell({ children }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16">
      {children}
    </main>
  );
}
