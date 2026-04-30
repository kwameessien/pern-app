import { money } from "../lib/api";

export default function CatalogPanel({ categories, categoryId, setCategoryId, products, onAddToCart }) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">Catalog</h2>
      <select className="rounded border p-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="grid gap-2">
        {products.length ? (
          products.map((p) => (
            <div key={p.id} className="rounded border p-3">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-slate-700">{p.description}</p>
              <p className="text-sm text-slate-600">
                {p.category || "Uncategorized"} | {money(p.price_cents)} | Stock: {p.stock}
              </p>
              <button className="mt-2 rounded bg-blue-600 px-3 py-1.5 text-white" onClick={() => onAddToCart(p.id)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No products found.</p>
        )}
      </div>
    </section>
  );
}
