// product.js
let productsCache = [];
function readProductsFromDOM() {
  const cards = document.querySelectorAll(".product-card");
  productsCache = [];

  cards.forEach((card) => {
    const id = Number(card.dataset.id);
    const name = card.dataset.name;
    const category = card.dataset.category;
    const price = parseFloat(card.dataset.price);
    const img = card.querySelector("img")?.src || "";
    const button = card.querySelector(".add-to-cart-btn");

    productsCache.push({
      id,
      name,
      category,
      price,
      image: img,
      cardElement: card,
      buttonElement: button,
    });
  });
}

/**
 * Initializes products module: read DOM & attach add-to-cart handlers.
 * @param {(product) => void} onAddToCart
 */
export function initProducts(onAddToCart) {
  readProductsFromDOM();

  productsCache.forEach((p) => {
    if (!p.buttonElement) return;
    p.buttonElement.addEventListener("click", (e) => {
      e.stopPropagation();
      onAddToCart({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
      });
    });
  });
}

export function filterProducts(searchTerm, category, maxPrice) {
  const term = (searchTerm || "").toLowerCase();
  const cat = category || "all";
  const max = isNaN(maxPrice) ? Infinity : maxPrice;

  if (!productsCache.length) {
    readProductsFromDOM();
  }

  productsCache.forEach((p) => {
    const matchesSearch = p.name.toLowerCase().includes(term);
    const matchesCategory = cat === "all" || p.category === cat;
    const matchesPrice = p.price <= max;

    p.cardElement.style.display =
      matchesSearch && matchesCategory && matchesPrice ? "block" : "none";
  });
}


export function getProducts() {
  return productsCache.map(({ cardElement, buttonElement, ...rest }) => rest);
}
