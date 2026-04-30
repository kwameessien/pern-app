import { useEffect, useMemo, useState } from "react";

export default function useCart(api, token, onError) {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    if (!token) {
      setCart([]);
      return;
    }
    setCart(await api("/api/cart"));
  };

  useEffect(() => {
    loadCart().catch((err) => onError(err.message));
  }, [token]);

  async function addToCart(productId, quantity = 1) {
    await api("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId: Number(productId), quantity }),
    });
    await loadCart();
  }

  async function increment(item) {
    await api(`/api/cart/${item.product_id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: item.quantity + 1 }),
    });
    await loadCart();
  }

  async function remove(productId) {
    await api(`/api/cart/${productId}`, { method: "DELETE" });
    await loadCart();
  }

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price_cents * item.quantity, 0),
    [cart]
  );

  return {
    cart,
    subtotal,
    loadCart,
    addToCart,
    increment,
    remove,
  };
}
