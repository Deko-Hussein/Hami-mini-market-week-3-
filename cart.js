// cart.js

import { saveCart, loadCart } from "./storage.js";

const TAX_RATE = 0.05; 
const DISCOUNT_THRESHOLD = 50;
const DISCOUNT_RATE = 0.1; 

export class Cart {
  constructor() {
    this.items = loadCart(); 
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    saveCart(this.items);
    this.listeners.forEach((fn) => fn(this));
  }

  _findIndex(id) {
    return this.items.findIndex((item) => item.id === id);
  }

  addItem(product, quantity = 1) {
    const index = this._findIndex(product.id);

    if (index === -1) {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        quantity,
      });
    } else {
      this.items[index].quantity += quantity;
    }

    this.notify();
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.notify();
  }

  updateQuantity(id, quantity) {
    const index = this._findIndex(id);
    if (index === -1) return;

    if (quantity <= 0) {
      this.removeItem(id);
    } else {
      this.items[index].quantity = quantity;
      this.notify();
    }
  }

  clear() {
    this.items = [];
    this.notify();
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTax() {
    return this.getSubtotal() * TAX_RATE;
  }

  getDiscount() {
    const subtotal = this.getSubtotal();
    if (subtotal > DISCOUNT_THRESHOLD) {
      return subtotal * DISCOUNT_RATE;
    }
    return 0;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const tax = this.getTax();
    const discount = this.getDiscount();
    return subtotal + tax - discount;
  }

  toJSON() {
    return {
      items: this.items,
      subtotal: this.getSubtotal(),
      tax: this.getTax(),
      discount: this.getDiscount(),
      total: this.getTotal(),
    };
  }
}
