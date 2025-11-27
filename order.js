// order.js
import { Cart } from "./cart.js";
import { clearCart } from "./storage.js";

const cart = new Cart();

// Header elements
const cartDropdown = document.getElementById("cartDropdown");
const cartCountEl = document.getElementById("cartCount");

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
      navLinks.classList.remove("active");
      menuIcon.classList.add("fa-bars");
      menuIcon.classList.remove("fa-xmark");
    });
  });
}

const cartContainer = document.querySelector(".cart-container");
if (cartContainer && cartDropdown) {
  cartContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle("show");
  });

  document.body.addEventListener("click", () => {
    cartDropdown.classList.remove("show");
  });

  cartDropdown.addEventListener("click", (e) => e.stopPropagation());
}

// Render mini-cart in header
function renderHeaderCart(c) {
  if (!cartDropdown || !cartCountEl) return;

  cartCountEl.textContent = c.getItemCount();
  cartDropdown.innerHTML = "";

  if (!c.items.length) {
    cartDropdown.innerHTML = "<p class='empty-cart'>Your cart is empty</p>";
    return;
  }

  c.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}"/>
      <div class="cart-info">
        <p>${item.name}</p>
        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
      </div>
    `;
    cartDropdown.appendChild(row);
  });

  const summary = document.createElement("div");
  summary.className = "cart-summary";
  summary.innerHTML = `
    <div class="cart-row">
      <span>Total:</span>
      <span>$${c.getTotal().toFixed(2)}</span>
    </div>
  `;
  cartDropdown.appendChild(summary);
}

cart.subscribe(renderHeaderCart);
renderHeaderCart(cart);

// Order summary page elements
const orderItemsEl = document.getElementById("order-items");
const subtotalEl = document.getElementById("order-subtotal");
const taxEl = document.getElementById("order-tax");
const discountEl = document.getElementById("order-discount");
const totalEl = document.getElementById("order-total");
const confirmBtn = document.getElementById("confirm-order-btn");

function renderOrder() {
  const items = cart.items || [];
  orderItemsEl.innerHTML = "";

  if (!items.length) {
    orderItemsEl.innerHTML =
      "<p class='empty-cart'>Your cart is empty. Go back and add items.</p>";
  } else {
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "order-item";
      row.innerHTML = `
        <div class="item-left">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h3>${item.name}</h3>
            <p>Unit price: $${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div class="item-right">
          <p>Qty: ${item.quantity}</p>
          <p>Line total: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
      orderItemsEl.appendChild(row);
    });
  }

  subtotalEl.textContent = `$${cart.getSubtotal().toFixed(2)}`;
  taxEl.textContent = `$${cart.getTax().toFixed(2)}`;
  discountEl.textContent = `-$${cart.getDiscount().toFixed(2)}`;
  totalEl.textContent = `$${cart.getTotal().toFixed(2)}`;
}

// Popup function
function showPopup(title, message) {
  const popup = document.createElement("div");
  popup.className = "custom-popup";
  popup.innerHTML = `
    <div class="custom-popup-content">
      <i class="fa-solid fa-circle-check popup-icon"></i>
      <h2>${title}</h2>
      <p>${message}</p>
      <button id="popup-close-btn">Continue Shopping</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("popup-close-btn").addEventListener("click", () => {
    popup.remove();
    // go to products section
    window.location.href = "index.html#products";
  });
}

// Confirm button
confirmBtn.addEventListener("click", () => {
  if (!cart.items || !cart.items.length) {
    showPopup("Error", "Your cart is empty.");
    return;
  }

  showPopup("Success!", "Your order has been confirmed!");

  // clear storage + cart object
  clearCart();
  cart.clear();
  renderOrder();
});

// initial render
renderOrder();
