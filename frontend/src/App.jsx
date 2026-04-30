import AdminPanel from "./components/AdminPanel";
import AuthPanel from "./components/AuthPanel";
import CartPanel from "./components/CartPanel";
import CatalogPanel from "./components/CatalogPanel";
import CheckoutPanel from "./components/CheckoutPanel";
import OrdersPanel from "./components/OrdersPanel";
import useAdmin from "./hooks/useAdmin";
import useAuth from "./hooks/useAuth";
import useCart from "./hooks/useCart";
import useCatalog from "./hooks/useCatalog";
import useOrders from "./hooks/useOrders";
import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Ready");
  const {
    token,
    user,
    registerForm,
    setRegisterForm,
    loginForm,
    setLoginForm,
    register,
    login,
    api,
  } = useAuth();
  const { categories, categoryId, setCategoryId, products, loadProducts } = useCatalog(api, setStatus);
  const { cart, subtotal, loadCart, addToCart, increment, remove } = useCart(api, token, setStatus);
  const { orders, checkoutForm, setCheckoutForm, loadOrders, checkout } = useOrders(api, token, setStatus);
  const {
    adminOrders,
    adminProductForm,
    setAdminProductForm,
    loadAdminOrders,
    createProduct,
    updateOrderStatus,
  } = useAdmin(api, user, setStatus);

  const refreshAll = async () => Promise.all([loadProducts(), loadCart(), loadOrders(), loadAdminOrders()]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-lg border bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">PERN Store MVP</h1>
          <p className="text-sm text-slate-600">
            {user ? `Logged in as ${user.email} (${user.role})` : "Not authenticated"}
          </p>
        </header>

        <main className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AuthPanel
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            onRegister={async (e) => {
              e.preventDefault();
              try {
                await register();
                setStatus("Registered.");
              } catch (err) {
                setStatus(err.message);
              }
            }}
            onLogin={async (e) => {
              e.preventDefault();
              try {
                await login();
                setStatus("Logged in.");
              } catch (err) {
                setStatus(err.message);
              }
            }}
          />

          <CatalogPanel
            categories={categories}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            products={products}
            onAddToCart={async (productId) => {
              if (!token) return setStatus("Please login first.");
              try {
                await addToCart(productId);
                setStatus("Added to cart.");
              } catch (err) {
                setStatus(err.message);
              }
            }}
          />

          <CartPanel
            token={token}
            cart={cart}
            subtotal={subtotal}
            onIncrement={async (item) => {
              try {
                await increment(item);
              } catch (err) {
                setStatus(err.message);
              }
            }}
            onRemove={async (productId) => {
              try {
                await remove(productId);
              } catch (err) {
                setStatus(err.message);
              }
            }}
          />

          <CheckoutPanel
            checkoutForm={checkoutForm}
            setCheckoutForm={setCheckoutForm}
            onCheckout={async (e) => {
              e.preventDefault();
              if (!token) return setStatus("Please login first.");
              try {
                const order = await checkout();
                setStatus(`Order #${order.id} placed.`);
                await refreshAll();
              } catch (err) {
                setStatus(err.message);
              }
            }}
          />

          <OrdersPanel token={token} orders={orders} />

          <AdminPanel
            user={user}
            adminProductForm={adminProductForm}
            setAdminProductForm={setAdminProductForm}
            adminOrders={adminOrders}
            onCreateProduct={async (e) => {
              e.preventDefault();
              if (user?.role !== "admin") return setStatus("Admin only.");
              try {
                await createProduct();
                setStatus("Product created.");
                await loadProducts();
              } catch (err) {
                setStatus(err.message);
              }
            }}
            onUpdateOrderStatus={async (orderId, orderStatus) => {
              try {
                await updateOrderStatus(orderId, orderStatus);
                setStatus("Order status updated.");
                await loadAdminOrders();
              } catch (err) {
                setStatus(err.message);
              }
            }}
          />
        </main>

        <p className="sticky bottom-0 rounded bg-slate-900 px-3 py-2 text-sm text-white">{status}</p>
      </div>
    </div>
  );
}
