import { money } from "../lib/api";

export default function AdminPanel({
  user,
  adminProductForm,
  setAdminProductForm,
  adminOrders,
  onCreateProduct,
  onUpdateOrderStatus,
}) {
  return (
    <>
      <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Admin Product Create</h2>
        <form className="grid gap-2" onSubmit={onCreateProduct}>
          <input className="rounded border p-2" placeholder="Name" value={adminProductForm.name} onChange={(e) => setAdminProductForm({ ...adminProductForm, name: e.target.value })} required />
          <input className="rounded border p-2" placeholder="Description" value={adminProductForm.description} onChange={(e) => setAdminProductForm({ ...adminProductForm, description: e.target.value })} required />
          <input className="rounded border p-2" placeholder="Image URL" value={adminProductForm.imageUrl} onChange={(e) => setAdminProductForm({ ...adminProductForm, imageUrl: e.target.value })} required />
          <input className="rounded border p-2" placeholder="Price (cents)" type="number" value={adminProductForm.priceCents} onChange={(e) => setAdminProductForm({ ...adminProductForm, priceCents: e.target.value })} required />
          <input className="rounded border p-2" placeholder="Stock" type="number" value={adminProductForm.stock} onChange={(e) => setAdminProductForm({ ...adminProductForm, stock: e.target.value })} required />
          <input className="rounded border p-2" placeholder="Category ID (optional)" type="number" value={adminProductForm.categoryId} onChange={(e) => setAdminProductForm({ ...adminProductForm, categoryId: e.target.value })} />
          <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">
            Create Product
          </button>
        </form>
      </section>

      <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3 lg:col-span-2">
        <h2 className="text-lg font-semibold">Admin Orders</h2>
        {!user || user.role !== "admin" ? (
          <p className="text-sm text-slate-600">Admin only.</p>
        ) : adminOrders.length ? (
          <div className="grid gap-2">
            {adminOrders.map((o) => (
              <div key={o.id} className="rounded border p-3">
                <p className="font-medium">
                  #{o.id} - {o.email}
                </p>
                <p className="text-sm text-slate-600">
                  {o.order_status} | {money(o.total_cents)}
                </p>
                <select
                  className="mt-2 rounded border p-2"
                  value={o.order_status}
                  onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                >
                  {["pending", "processing", "shipped", "delivered"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">No orders.</p>
        )}
      </section>
    </>
  );
}
