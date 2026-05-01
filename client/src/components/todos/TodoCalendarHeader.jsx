export default function TodoCalendarHeader({
  monthLabel,
  onPreviousMonth,
  onNextMonth,
}) {
  return (
    <header className="border-b border-zinc-200 px-5 py-4 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl">Calendar</h1>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={onPreviousMonth}
            className="rounded-full border border-zinc-200 px-2 py-1 text-zinc-500"
          >
            ‹
          </button>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={onNextMonth}
            className="rounded-full border border-zinc-200 px-2 py-1 text-zinc-500"
          >
            ›
          </button>
        </div>
      </div>
    </header>
  );
}
