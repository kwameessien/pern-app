import { APP_NAME } from "@/lib/constants";

export default function TodoSidebar() {
  return (
    <aside className="hidden w-72 border-r border-zinc-200 bg-[#f8f9fb] p-5 lg:block">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
          T
        </div>
        <p className="font-semibold text-zinc-900">{APP_NAME}</p>
      </div>
      <input
        type="text"
        placeholder="Search"
        className="mb-5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
        readOnly
      />
      <nav className="space-y-2">
        <button className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-left text-sm text-white">
          Todo Board
        </button>
        <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100">
          Overview
        </button>
        <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100">
          Settings
        </button>
      </nav>
    </aside>
  );
}
