// main.js

import { initProducts, filterProducts } from "./product.js";
import { Cart } from "./cart.js";

// Menu toggle
const menuIcon = document.querySelector(".menu i");
const navLinks = document.querySelector("nav .nav-links");

if (menuIcon && navLinks) {
  menuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-xmark");
  });

  document.querySelectorAll("nav .nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuIcon.classList.add("fa-bars");
        menuIcon.classList.remove("fa-xmark");
      }
    });
  });
}

// Cart dropdown toggle
const cartContainer = document.querySelector(".cart-container");
const cartDropdown = document.getElementById("cartDropdown");
const cartCountEl = document.getElementById("cartCount");

if (cartContainer && cartDropdown) {
  cartContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle("show");
  });

  document.body.addEventListener("click", () => {
    cartDropdown.classList.remove("show");
  });

  // Prevent dropdown click from closing itself
  cartDropdown.addEventListener("click", (e) => e.stopPropagation());
}

// Toast
const toastEl = document.getElementById("toast");
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2000);
}

// Filters
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");

function applyFilters() {
  const search = searchInput ? searchInput.value : "";
  const category = categoryFilter ? categoryFilter.value : "all";
  const maxPrice = priceFilter ? parseFloat(priceFilter.value) : Infinity;
  filterProducts(search, category, maxPrice);
}

if (priceFilter && priceValue) {
  priceFilter.addEventListener("input", () => {
    priceValue.textContent = `$${priceFilter.value}`;
    applyFilters();
  });
}
if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}
if (categoryFilter) {
  categoryFilter.addEventListener("change", applyFilters);
}

// Cart instance
const cart = new Cart();

// Render cart dropdown UI
function renderCartDropdown(cartInstance) {
  if (!cartDropdown || !cartCountEl) return;

  const c = cartInstance || cart;

  // Update count
  cartCountEl.textContent = c.getItemCount();

  // Clear content
  cartDropdown.innerHTML = "";

  if (!c.items.length) {
    const p = document.createElement("p");
    p.className = "empty-cart";
    p.textContent = "Your cart is empty";
    cartDropdown.appendChild(p);
    return;
  }

  // Items
  c.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item cart-item-animate";

    row.innerHTML = `
      <img src="${item.image || ""}" alt="${item.name}" />
      <div class="cart-info">
        <p>${item.name}</p>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-actions">
        <input
          type="number"
          min="1"
          value="${item.quantity}"
          data-id="${item.id}"
          class="cart-qty-input"
        />
        <button class="remove-item" data-id="${item.id}">&times;</button>
      </div>
    `;

    cartDropdown.appendChild(row);
  });

  // Summary
  const summary = document.createElement("div");
  summary.className = "cart-summary";
  summary.innerHTML = `
    <div class="cart-row">
      <span>Subtotal:</span>
      <span>$${c.getSubtotal().toFixed(2)}</span>
    </div>
    <div class="cart-row">
      <span>Tax (5%):</span>
      <span>$${c.getTax().toFixed(2)}</span>
    </div>
    <div class="cart-row">
      <span>Discount (10% &gt; $50):</span>
      <span>-$${c.getDiscount().toFixed(2)}</span>
    </div>
    <div class="cart-row cart-total-row">
      <span>Total:</span>
      <span>$${c.getTotal().toFixed(2)}</span>
    </div>
    <a href="order.html" class="view-order-btn">View Order Summary</a>
  `;
  cartDropdown.appendChild(summary);

  // Listeners for quantity change
  cartDropdown.querySelectorAll(".cart-qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = Number(e.target.dataset.id);
      const value = Number(e.target.value);
      if (!Number.isNaN(value)) {
        cart.updateQuantity(id, value);
      }
    });
  });

  // Listeners for remove
  cartDropdown.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      cart.removeItem(id);
    });
  });
}

// Subscribe UI to cart changes
cart.subscribe(renderCartDropdown);

// Add-to-cart handler (used by product.js)
function handleAddToCart(product) {
  cart.addItem(product, 1);
  showToast(`${product.name} added to cart`);
}

// Init products module & filters
initProducts(handleAddToCart);
applyFilters(); 
renderCartDropdown(cart); 
