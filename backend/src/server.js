require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const db = require("./db");
const { requireAuth, requireAdmin } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../frontend")));

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

app.post("/api/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });
  const { name, email, password } = parsed.data;

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      "INSERT INTO users(name, email, password_hash) VALUES($1,$2,$3) RETURNING id,name,email,role",
      [name, email, hash]
    );
    const user = result.rows[0];
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (_e) {
    res.status(409).json({ error: "Email already exists." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });
  const { email, password } = parsed.data;

  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials." });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials." });

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(safeUser, process.env.JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token, user: safeUser });
});

app.get("/api/categories", async (_req, res) => {
  const result = await db.query("SELECT id, name FROM categories ORDER BY name");
  res.json(result.rows);
});

app.get("/api/products", async (req, res) => {
  const page = Number(req.query.page || 1);
  const size = Number(req.query.size || 12);
  const category = req.query.category ? Number(req.query.category) : null;
  const offset = (page - 1) * size;

  const baseWhere = "WHERE p.is_archived = FALSE";
  const where = category ? `${baseWhere} AND p.category_id = $1` : baseWhere;
  const params = category ? [category, size, offset] : [size, offset];
  const limitIx = category ? 2 : 1;
  const offsetIx = category ? 3 : 2;

  const result = await db.query(
    `SELECT p.id, p.name, p.description, p.image_url, p.price_cents, p.stock, c.name AS category
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT $${limitIx} OFFSET $${offsetIx}`,
    params
  );
  res.json(result.rows);
});

app.get("/api/products/:id", async (req, res) => {
  const result = await db.query(
    `SELECT p.id, p.name, p.description, p.image_url, p.price_cents, p.stock, c.name AS category
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1 AND p.is_archived = FALSE`,
    [req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "Product not found." });
  return res.json(result.rows[0]);
});

app.get("/api/cart", requireAuth, async (req, res) => {
  const result = await db.query(
    `SELECT ci.product_id, ci.quantity, p.name, p.image_url, p.price_cents
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1 AND p.is_archived = FALSE`,
    [req.user.id]
  );
  res.json(result.rows);
});

app.post("/api/cart", requireAuth, async (req, res) => {
  const parsed = z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });

  const { productId, quantity } = parsed.data;
  await db.query(
    `INSERT INTO cart_items(user_id, product_id, quantity)
     VALUES($1,$2,$3)
     ON CONFLICT (user_id, product_id) DO UPDATE
     SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [req.user.id, productId, quantity]
  );
  res.json({ success: true });
});

app.patch("/api/cart/:productId", requireAuth, async (req, res) => {
  const parsed = z.object({ quantity: z.number().int().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });
  await db.query("UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3", [
    parsed.data.quantity,
    req.user.id,
    req.params.productId,
  ]);
  res.json({ success: true });
});

app.delete("/api/cart/:productId", requireAuth, async (req, res) => {
  await db.query("DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2", [req.user.id, req.params.productId]);
  res.json({ success: true });
});

app.post("/api/orders", requireAuth, async (req, res) => {
  const parsed = z.object({
    shippingName: z.string().min(1),
    shippingAddress: z.string().min(1),
    shippingContact: z.string().min(1),
    paymentStatus: z.enum(["pending", "paid"]).default("pending"),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });

  const cart = await db.query(
    "SELECT ci.product_id, ci.quantity, p.price_cents FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = $1",
    [req.user.id]
  );
  if (!cart.rows.length) return res.status(400).json({ error: "Cart is empty." });

  const subtotal = cart.rows.reduce((sum, row) => sum + row.quantity * row.price_cents, 0);
  const shipping = subtotal > 10000 ? 0 : 799;
  const total = subtotal + shipping;

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    const orderResult = await client.query(
      `INSERT INTO orders(
        user_id, shipping_name, shipping_address, shipping_contact, payment_status, subtotal_cents, shipping_cents, total_cents
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        req.user.id,
        parsed.data.shippingName,
        parsed.data.shippingAddress,
        parsed.data.shippingContact,
        parsed.data.paymentStatus,
        subtotal,
        shipping,
        total,
      ]
    );
    const order = orderResult.rows[0];

    for (const row of cart.rows) {
      await client.query(
        "INSERT INTO order_items(order_id, product_id, quantity, unit_price_cents) VALUES($1,$2,$3,$4)",
        [order.id, row.product_id, row.quantity, row.price_cents]
      );
      await client.query("UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id = $2", [row.quantity, row.product_id]);
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    await client.query("COMMIT");
    res.status(201).json(order);
  } catch (_err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Failed to place order." });
  } finally {
    client.release();
  }
});

app.get("/api/orders/me", requireAuth, async (req, res) => {
  const orders = await db.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
  res.json(orders.rows);
});

app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
  if (!order.rows[0]) return res.status(404).json({ error: "Order not found." });
  const items = await db.query("SELECT * FROM order_items WHERE order_id = $1", [req.params.id]);
  res.json({ ...order.rows[0], items: items.rows });
});

app.get("/api/admin/orders", requireAuth, requireAdmin, async (_req, res) => {
  const orders = await db.query(
    "SELECT o.*, u.email FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC"
  );
  res.json(orders.rows);
});

app.patch("/api/admin/orders/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const parsed = z.object({ orderStatus: z.enum(["pending", "processing", "shipped", "delivered"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });
  const updated = await db.query("UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *", [
    parsed.data.orderStatus,
    req.params.id,
  ]);
  res.json(updated.rows[0]);
});

app.post("/api/admin/products", requireAuth, requireAdmin, async (req, res) => {
  const parsed = z.object({
    categoryId: z.number().int().positive().nullable(),
    name: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().url(),
    priceCents: z.number().int().min(0),
    stock: z.number().int().min(0),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });

  const result = await db.query(
    `INSERT INTO products(category_id, name, description, image_url, price_cents, stock)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      parsed.data.categoryId,
      parsed.data.name,
      parsed.data.description,
      parsed.data.imageUrl,
      parsed.data.priceCents,
      parsed.data.stock,
    ]
  );
  res.status(201).json(result.rows[0]);
});

app.patch("/api/admin/products/:id", requireAuth, requireAdmin, async (req, res) => {
  const parsed = z.object({
    categoryId: z.number().int().positive().nullable(),
    name: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().url(),
    priceCents: z.number().int().min(0),
    stock: z.number().int().min(0),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload." });

  const result = await db.query(
    `UPDATE products SET category_id = $1, name = $2, description = $3, image_url = $4, price_cents = $5, stock = $6
     WHERE id = $7 RETURNING *`,
    [
      parsed.data.categoryId,
      parsed.data.name,
      parsed.data.description,
      parsed.data.imageUrl,
      parsed.data.priceCents,
      parsed.data.stock,
      req.params.id,
    ]
  );
  res.json(result.rows[0]);
});

app.delete("/api/admin/products/:id", requireAuth, requireAdmin, async (req, res) => {
  await db.query("UPDATE products SET is_archived = TRUE WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/index.html"));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
