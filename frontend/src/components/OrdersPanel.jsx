import { money } from "../lib/api";

export default function OrdersPanel({ token, orders }) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">My Orders</h2>
      {!token ? (
        <p className="text-sm text-slate-600">Login to view your orders.</p>
      ) : orders.length ? (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="rounded border p-3 text-sm">
              #{o.id} | {o.order_status} | {o.payment_status} | {money(o.total_cents)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">No orders yet.</p>
      )}
    </section>
  );
}
