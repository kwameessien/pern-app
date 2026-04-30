import { useEffect, useState } from "react";

export default function useAdmin(api, user, onError) {
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminProductForm, setAdminProductForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    priceCents: "",
    stock: "",
    categoryId: "",
  });

  const loadAdminOrders = async () => {
    if (user?.role !== "admin") {
      setAdminOrders([]);
      return;
    }
    setAdminOrders(await api("/api/admin/orders"));
  };

  useEffect(() => {
    loadAdminOrders().catch((err) => onError(err.message));
  }, [user]);

  async function createProduct() {
    return api("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({
        ...adminProductForm,
        priceCents: Number(adminProductForm.priceCents),
        stock: Number(adminProductForm.stock),
        categoryId: adminProductForm.categoryId ? Number(adminProductForm.categoryId) : null,
      }),
    });
  }

  async function updateOrderStatus(orderId, orderStatus) {
    return api(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ orderStatus }),
    });
  }

  return {
    adminOrders,
    adminProductForm,
    setAdminProductForm,
    loadAdminOrders,
    createProduct,
    updateOrderStatus,
  };
}
