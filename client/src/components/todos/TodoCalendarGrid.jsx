const dayColumns = [
  { key: "sun", label: "SUN 9" },
  { key: "mon", label: "MON 10" },
  { key: "tue", label: "TUE 11" },
  { key: "wed", label: "WED 12" },
];

const timeRows = ["All Day", "9 AM", "10 AM", "11 AM"];

export default function TodoCalendarGrid({ todos, activeTodoId, onToggleTodo, onDeleteTodo }) {
  const todosByColumn = todos.reduce(
    (acc, todo, index) => {
      const bucket = dayColumns[index % dayColumns.length].key;
      acc[bucket].push(todo);
      return acc;
    },
    { sun: [], mon: [], tue: [], wed: [] },
  );

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="grid grid-cols-[84px_repeat(4,minmax(0,1fr))] border-b border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-500">
        <div className="border-r border-zinc-200 px-3 py-3">PST</div>
        {dayColumns.map((col) => (
          <div
            key={col.key}
            className={`px-3 py-3 text-center ${col.key !== "wed" ? "border-r border-zinc-200" : ""}`}
          >
            {col.label}
          </div>
        ))}
      </div>

      {timeRows.map((row) => (
        <div
          key={row}
          className="grid grid-cols-[84px_repeat(4,minmax(0,1fr))] border-b border-zinc-100 last:border-b-0"
        >
          <div className="border-r border-zinc-200 px-3 py-4 text-xs text-zinc-500">{row}</div>
          {dayColumns.map((col, colIndex) => {
            const cards =
              row === "All Day"
                ? todosByColumn[col.key].filter((todo) => todo.completed)
                : todosByColumn[col.key].filter((todo) => !todo.completed);

            return (
              <div
                key={col.key + row}
                className={`min-h-[112px] px-2 py-2 ${colIndex < dayColumns.length - 1 ? "border-r border-zinc-100" : ""}`}
              >
                <div className="space-y-2">
                  {cards.length === 0 ? (
                    row === "All Day" ? null : (
                      <div className="h-10 rounded-lg border border-dashed border-zinc-200" />
                    )
                  ) : (
                    cards.map((todo) => (
                      <article
                        key={`${row}-${todo.id}`}
                        className={`rounded-xl border px-3 py-2 ${
                          todo.completed ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
                        }`}
                      >
                        <p className="line-clamp-2 text-xs font-semibold text-zinc-800">{todo.title}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {todo.completed ? "All day" : "9 AM - 10 AM"}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onToggleTodo(todo)}
                            disabled={activeTodoId === todo.id}
                            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] text-zinc-700 disabled:opacity-60"
                          >
                            {todo.completed ? "Reopen" : "Done"}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteTodo(todo.id)}
                            disabled={activeTodoId === todo.id}
                            className="rounded-md border border-red-300 bg-white px-2 py-1 text-[11px] text-red-700 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
