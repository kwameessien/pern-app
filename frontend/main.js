const state = {
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),
  products: [],
};

const statusEl = document.querySelector("#status");
const sessionEl = document.querySelector("#session");

function notify(msg) {
  statusEl.textContent = msg;
}

function money(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function syncSession() {
  localStorage.setItem("token", state.token || "");
  localStorage.setItem("user", JSON.stringify(state.user || null));
  sessionEl.textContent = state.user
    ? `Logged in as ${state.user.email} (${state.user.role})`
    : "Not authenticated";
}

async function loadCategories() {
  const categories = await api("/api/categories");
  const select = document.querySelector("#category-filter");
  select.innerHTML = `<option value="">All Categories</option>` + categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
}

async function loadProducts() {
  const categoryId = document.querySelector("#category-filter").value;
  const q = categoryId ? `?category=${categoryId}` : "";
  state.products = await api(`/api/products${q}`);
  const productsEl = document.querySelector("#products");
  productsEl.innerHTML = state.products.length
    ? state.products
        .map(
          (p) => `<div class="card">
      <strong>${p.name}</strong>
      <div>${p.description}</div>
      <div>${p.category || "Uncategorized"} | ${money(p.price_cents)} | Stock: ${p.stock}</div>
      <button data-add="${p.id}">Add to Cart</button>
    </div>`
        )
        .join("")
    : "<p>No products found.</p>";

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.onclick = async () => {
      if (!state.token) return notify("Please login first.");
      await api("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: Number(btn.dataset.add), quantity: 1 }),
      });
      notify("Added to cart.");
      await loadCart();
    };
  });
}

async function loadCart() {
  const cartEl = document.querySelector("#cart");
  if (!state.token) {
    cartEl.innerHTML = "<p>Login to view your cart.</p>";
    return;
  }
  const items = await api("/api/cart");
  cartEl.innerHTML = items.length
    ? items
        .map(
          (i) => `<div class="card">
      <strong>${i.name}</strong>
      <div>${money(i.price_cents)} x ${i.quantity}</div>
      <button data-inc="${i.product_id}">+1</button>
      <button data-del="${i.product_id}">Remove</button>
    </div>`
        )
        .join("")
    : "<p>Your cart is empty.</p>";

  document.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.inc);
      const item = items.find((x) => x.product_id === id);
      await api(`/api/cart/${id}`, { method: "PATCH", body: JSON.stringify({ quantity: item.quantity + 1 }) });
      await loadCart();
    };
  });
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = async () => {
      await api(`/api/cart/${Number(btn.dataset.del)}`, { method: "DELETE" });
      await loadCart();
    };
  });
}

async function loadOrders() {
  const ordersEl = document.querySelector("#orders");
  if (!state.token) {
    ordersEl.innerHTML = "<p>Login to view your orders.</p>";
    return;
  }
  const orders = await api("/api/orders/me");
  ordersEl.innerHTML = orders.length
    ? orders
        .map((o) => `<div class="card">#${o.id} ${o.order_status} | ${o.payment_status} | ${money(o.total_cents)}</div>`)
        .join("")
    : "<p>No orders yet.</p>";
}

async function loadAdminOrders() {
  const root = document.querySelector("#admin-orders");
  if (!state.user || state.user.role !== "admin") {
    root.innerHTML = "<p>Admin only.</p>";
    return;
  }
  const orders = await api("/api/admin/orders");
  root.innerHTML = orders.length
    ? orders
        .map(
          (o) => `<div class="card">
      <strong>#${o.id} - ${o.email}</strong>
      <div>${o.order_status} | ${money(o.total_cents)}</div>
      <select data-status="${o.id}">
        ${["pending", "processing", "shipped", "delivered"]
          .map((s) => `<option value="${s}" ${s === o.order_status ? "selected" : ""}>${s}</option>`)
          .join("")}
      </select>
    </div>`
        )
        .join("")
    : "<p>No orders.</p>";

  document.querySelectorAll("[data-status]").forEach((select) => {
    select.onchange = async () => {
      await api(`/api/admin/orders/${select.dataset.status}/status`, {
        method: "PATCH",
        body: JSON.stringify({ orderStatus: select.value }),
      });
      notify("Order status updated.");
      await loadAdminOrders();
    };
  });
}

document.querySelector("#category-filter").addEventListener("change", loadProducts);

document.querySelector("#register-form").onsubmit = async (e) => {
  e.preventDefault();
  try {
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const res = await api("/api/auth/register", { method: "POST", body: JSON.stringify(data) });
    state.token = res.token;
    state.user = res.user;
    syncSession();
    notify("Registered.");
    await Promise.all([loadCart(), loadOrders(), loadAdminOrders()]);
  } catch (err) {
    notify(err.message);
  }
};

document.querySelector("#login-form").onsubmit = async (e) => {
  e.preventDefault();
  try {
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const res = await api("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
    state.token = res.token;
    state.user = res.user;
    syncSession();
    notify("Logged in.");
    await Promise.all([loadCart(), loadOrders(), loadAdminOrders()]);
  } catch (err) {
    notify(err.message);
  }
};

document.querySelector("#checkout-form").onsubmit = async (e) => {
  e.preventDefault();
  if (!state.token) return notify("Please login first.");
  try {
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const order = await api("/api/orders", { method: "POST", body: JSON.stringify(data) });
    notify(`Order #${order.id} placed.`);
    await Promise.all([loadCart(), loadOrders(), loadAdminOrders()]);
  } catch (err) {
    notify(err.message);
  }
};

document.querySelector("#admin-product-form").onsubmit = async (e) => {
  e.preventDefault();
  if (!state.user || state.user.role !== "admin") return notify("Admin only.");
  try {
    const form = new FormData(e.target);
    const raw = Object.fromEntries(form.entries());
    const payload = {
      name: raw.name,
      description: raw.description,
      imageUrl: raw.imageUrl,
      priceCents: Number(raw.priceCents),
      stock: Number(raw.stock),
      categoryId: raw.categoryId ? Number(raw.categoryId) : null,
    };
    await api("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
    notify("Product created.");
    await loadProducts();
  } catch (err) {
    notify(err.message);
  }
};

async function init() {
  syncSession();
  await loadCategories();
  await loadProducts();
  await loadCart();
  await loadOrders();
  await loadAdminOrders();
}

init().catch((err) => notify(err.message));
