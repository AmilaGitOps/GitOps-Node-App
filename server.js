/**
 * Simple Service API (CRUD) with in-memory database
 * Run: node server.js
 */

const express = require("express");
const app = express();

app.use(express.json());

// In-memory database
let services = [
  {
    id: 1,
    name: "Basic Support",
    description: "Email support within business hours",
    price: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 2;

// Helpers
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isNonNegativeNumber(v) {
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
}

function parseId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * CREATE: POST /services
 */
app.post("/services", (req, res) => {
  const { name, description, price } = req.body ?? {};

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: "name is required" });
  }

  if (!isNonNegativeNumber(price)) {
    return res.status(400).json({ error: "price must be a non-negative number" });
  }

  const now = new Date().toISOString();

  const newService = {
    id: nextId++,
    name: name.trim(),
    description: description?.trim() || undefined,
    price,
    createdAt: now,
    updatedAt: now,
  };

  services.push(newService);
  res.status(201).json(newService);
});

/**
 * READ ALL: GET /services
 */
app.get("/services", (req, res) => {
  const q = typeof req.query.q === "string"
    ? req.query.q.trim().toLowerCase()
    : "";

  const result = q
    ? services.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          (s.description?.toLowerCase().includes(q) ?? false)
      )
    : services;

  res.json({ count: result.length, data: result });
});

/**
 * READ ONE: GET /services/:id   ← NEW ENDPOINT
 */
app.get("/services/:id", (req, res) => {
  const id = parseId(req);

  if (!id) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const service = services.find(s => s.id === id);

  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.json(service);
});

/**
 * UPDATE: PUT /services/:id
 */
app.put("/services/:id", (req, res) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  const idx = services.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Service not found" });

  const { name, description, price } = req.body ?? {};

  if (name !== undefined && !isNonEmptyString(name)) {
    return res.status(400).json({ error: "name must be non-empty string" });
  }

  if (price !== undefined && !isNonNegativeNumber(price)) {
    return res.status(400).json({ error: "price must be non-negative number" });
  }

  const existing = services[idx];

  const updated = {
    ...existing,
    name: name !== undefined ? name.trim() : existing.name,
    description:
      description === null
        ? undefined
        : description !== undefined
        ? description.trim()
        : existing.description,
    price: price !== undefined ? price : existing.price,
    updatedAt: new Date().toISOString(),
  };

  services[idx] = updated;
  res.json(updated);
});

/**
 * DELETE: DELETE /services/:id
 */
app.delete("/services/:id", (req, res) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  const idx = services.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Service not found" });

  const deleted = services.splice(idx, 1)[0];
  res.json({ message: "Deleted", deleted });
});

/**
 * Health check endpoint
 */
app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Service API running at http://localhost:${PORT}`);
});

