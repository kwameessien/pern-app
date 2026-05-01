export default function TodoComposerPanel({
  todosCount,
  newTitle,
  onTitleChange,
  onSubmit,
  isSubmitting,
  actionError,
  isLoading,
  loadError,
  onRetryLoad,
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">Add Todo</h2>
        <span className="text-xs text-zinc-500">{todosCount} total</span>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="New task title..."
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "..." : "Add"}
        </button>
      </form>

      {actionError ? (
        <p className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-3 text-sm text-zinc-500">Loading todos...</p>
      ) : loadError ? (
        <div className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-3">
          <p className="text-sm text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={onRetryLoad}
            className="mt-2 rounded-md border border-red-300 bg-white px-3 py-1 text-xs text-red-700"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs font-medium text-zinc-700">Legend</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          Pending
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Completed
        </div>
      </div>
    </div>
  );
}
