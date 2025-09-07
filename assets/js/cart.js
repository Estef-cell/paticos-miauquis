// assets/js/cart.js
import { PRODUCTS } from './products.js';

const CART_KEY = 'pm_cart';

// Helpers
const normId = (v) => String(v);
const readStore = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
const writeStore = (data) => {
  localStorage.setItem(CART_KEY, JSON.stringify(data));
};

// Estado
let cart = readStore();

// Persistencia + UI
const saveCart = () => {
  writeStore(cart);
  updateBadge();
};

// Badge del carrito
export const updateBadge = () => {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const totalItems = cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  el.textContent = String(totalItems);
};

// Obtener producto catálogo por id normalizado
const getProduct = (id) => PRODUCTS.find((p) => normId(p.id) === normId(id));

// API
export const addToCart = (id, qty = 1) => {
  const prod = getProduct(id);
  if (!prod) return;

  const q = Math.max(1, Number(qty) || 1);
  const pid = normId(id);

  const existing = cart.find((it) => normId(it.id) === pid);
  const maxQty = Math.max(1, Number(prod.stock) || 1);

  if (existing) {
    existing.qty = Math.min(existing.qty + q, maxQty);
  } else {
    cart.push({ id: pid, qty: Math.min(q, maxQty) });
  }
  saveCart();
};

export const removeFromCart = (id) => {
  const pid = normId(id);
  cart = cart.filter((it) => normId(it.id) !== pid);
  saveCart();
};

export const setQty = (id, qty) => {
  const prod = getProduct(id);
  if (!prod) return;

  const pid = normId(id);
  const it = cart.find((x) => normId(x.id) === pid);
  if (!it) return;

  const n = Number(qty);
  const maxQty = Math.max(1, Number(prod.stock) || 1);
  const valid = Math.max(1, Math.min(isNaN(n) ? 1 : n, maxQty));

  it.qty = valid;
  saveCart();
};

export const clear = () => {
  cart = [];
  saveCart();
};

// Vista de items enriquecidos
export const items = () => {
  return cart
    .map((c) => {
      const prod = getProduct(c.id);
      if (!prod) return null; // producto eliminado del catálogo
      const qty = Math.max(1, Number(c.qty) || 1);
      const price = Number(prod.price) || 0;
      return {
        ...prod,
        id: normId(prod.id),
        qty,
        subtotal: price * qty,
      };
    })
    .filter(Boolean);
};

// Total
export const total = () =>
  items().reduce((sum, it) => sum + (Number(it.subtotal) || 0), 0);

// Utilidades opcionales
export const count = () =>
  cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);

export const hasItem = (id) =>
  cart.some((it) => normId(it.id) === normId(id));

// Sincroniza badge al cargar
document.addEventListener('DOMContentLoaded', updateBadge);

// Sincroniza entre pestañas
window.addEventListener('storage', (e) => {
  if (e.key === CART_KEY) {
    cart = readStore();
    updateBadge();
  }
});
