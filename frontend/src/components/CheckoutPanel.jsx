export default function CheckoutPanel({ checkoutForm, setCheckoutForm, onCheckout }) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">Checkout</h2>
      <form className="grid gap-2" onSubmit={onCheckout}>
        <input
          className="rounded border p-2"
          placeholder="Shipping Name"
          value={checkoutForm.shippingName}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingName: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Shipping Address"
          value={checkoutForm.shippingAddress}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value })}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Shipping Contact"
          value={checkoutForm.shippingContact}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingContact: e.target.value })}
          required
        />
        <select
          className="rounded border p-2"
          value={checkoutForm.paymentStatus}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentStatus: e.target.value })}
        >
          <option value="pending">pending</option>
          <option value="paid">paid</option>
        </select>
        <button className="rounded bg-indigo-600 px-3 py-2 text-white" type="submit">
          Place Order
        </button>
      </form>
    </section>
  );
}
