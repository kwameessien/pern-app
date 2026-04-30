import { money } from "../lib/api";

export default function CartPanel({ token, cart, subtotal, onIncrement, onRemove }) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">Cart</h2>
      {!token ? (
        <p className="text-sm text-slate-600">Login to view your cart.</p>
      ) : cart.length ? (
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.product_id} className="rounded border p-3">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">
                {money(item.price_cents)} x {item.quantity}
              </p>
              <div className="mt-2 flex gap-2">
                <button className="rounded bg-emerald-600 px-2 py-1 text-white" onClick={() => onIncrement(item)}>
                  +1
                </button>
                <button className="rounded bg-rose-600 px-2 py-1 text-white" onClick={() => onRemove(item.product_id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <p className="text-sm font-medium">Subtotal: {money(subtotal)}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Your cart is empty.</p>
      )}
    </section>
  );
}
