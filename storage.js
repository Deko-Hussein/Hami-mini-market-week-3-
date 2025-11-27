// storage.js
// Handles saving/loading cart state from localStorage

const CART_KEY = "hami_minimarket_cart";

export function saveCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load cart from localStorage", err);
    return [];
  }
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}