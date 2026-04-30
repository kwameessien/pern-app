import { useEffect, useState } from "react";

export default function useOrders(api, token, onError) {
  const [orders, setOrders] = useState([]);
  const [checkoutForm, setCheckoutForm] = useState({
    shippingName: "",
    shippingAddress: "",
    shippingContact: "",
    paymentStatus: "pending",
  });

  const loadOrders = async () => {
    if (!token) {
      setOrders([]);
      return;
    }
    setOrders(await api("/api/orders/me"));
  };

  useEffect(() => {
    loadOrders().catch((err) => onError(err.message));
  }, [token]);

  async function checkout() {
    return api("/api/orders", {
      method: "POST",
      body: JSON.stringify(checkoutForm),
    });
  }

  return {
    orders,
    checkoutForm,
    setCheckoutForm,
    loadOrders,
    checkout,
  };
}
