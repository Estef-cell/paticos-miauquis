
import { PRODUCTS } from './products.js';

const CART_KEY = 'pm_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

const saveCart = () => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateBadge();
};

export const updateBadge = () => {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;
  }
};

export const addToCart = (id, qty = 1) => {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    const newQty = existingItem.qty + qty;
    existingItem.qty = Math.min(newQty, product.stock);
  } else {
    cart.push({ id, qty: Math.min(qty, product.stock) });
  }
  saveCart();
};

export const removeFromCart = (id) => {
  cart = cart.filter(item => item.id !== id);
  saveCart();
};

export const setQty = (id, qty) => {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const itemInCart = cart.find(item => item.id === id);
  if (itemInCart) {
    const validQty = Math.max(1, Math.min(qty, product.stock));
    itemInCart.qty = validQty;
    saveCart();
  }
};

export const clear = () => {
  cart = [];
  saveCart();
};

export const items = () => {
  return cart.map(cartItem => {
    const product = PRODUCTS.find(p => p.id === cartItem.id);
    return {
      ...product,
      qty: cartItem.qty,
      subtotal: product.price * cartItem.qty,
    };
  }).filter(item => item.id); // Filtra por si un producto fue eliminado de PRODUCTS
};

export const total = () => {
  return items().reduce((sum, item) => sum + item.subtotal, 0);
};

// Actualiza el badge al cargar cualquier página
document.addEventListener('DOMContentLoaded', updateBadge);
