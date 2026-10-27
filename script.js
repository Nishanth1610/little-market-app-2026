// Product data: prices stay numeric; formatting happens only when displayed.
const products = [
  { id: "mug-01", name: "Sunday Ceramic Mug", category: "Home", price: 499, emoji: "☕", color: "#ead9c6", tag: "BESTSELLER", description: "Your favourite slow-morning companion." },
  { id: "plant-02", name: "Tiny Happy Plant", category: "Home", price: 349, emoji: "🪴", color: "#dbe7d0", tag: "FRESH PICK", description: "A little green friend for your desk." },
  { id: "notebook-03", name: "Daily Notes Book", category: "Desk", price: 279, emoji: "📔", color: "#e8d9e7", tag: "MADE FOR IDEAS", description: "For lists, plans, doodles and daydreams." },
  { id: "lamp-04", name: "Warm Glow Lamp", category: "Home", price: 899, emoji: "💡", color: "#f4e5b9", tag: "COZY FAVOURITE", description: "A softer glow for your evening corner." },
  { id: "tote-05", name: "Everyday Canvas Tote", category: "Desk", price: 399, emoji: "👜", color: "#eadbc8", tag: "EVERYDAY HERO", description: "Room for your essentials and extras." },
  { id: "candle-06", name: "Calm Day Candle", category: "Self-care", price: 429, emoji: "🕯️", color: "#f1d5c7", tag: "SLOW DOWN", description: "A gentle scent for a reset moment." },
  { id: "bottle-07", name: "Sip & Go Bottle", category: "Desk", price: 599, emoji: "🧴", color: "#d3e5e4", tag: "ON THE GO", description: "Keep your water close all day." },
  { id: "mask-08", name: "Soft Sunday Eye Mask", category: "Self-care", price: 249, emoji: "😴", color: "#e4dff0", tag: "REST EASY", description: "A tiny reminder to take a break." }
];

// Cart state maps stable product IDs to quantities.
const cart = new Map();
const money = amount => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartSummary = document.getElementById("cartSummary");
const toast = document.getElementById("toast");
let toastTimer;

function renderProducts(category = "All") {
  const visible = category === "All" ? products : products.filter(product => product.category === category);
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-visual" style="background:${product.color}">
        <span class="product-tag">${product.tag}</span>
        <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button>
        </div>
      </div>
    </article>`).join("");
}

function getCartDetails() {
  const lines = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    return product ? { ...product, quantity, lineTotal: product.price * quantity } : null;
  }).filter(Boolean);
  const itemCount = lines.reduce((sum, item) => sum + item.quantity, 0);
  const total = lines.reduce((sum, item) => sum + item.lineTotal, 0);
  return { lines, itemCount, total };
}

function updateCartBadge() {
  const { itemCount } = getCartDetails();
  cartCount.textContent = itemCount;
  document.getElementById("drawerCount").textContent = `(${itemCount})`;
}

function renderCart() {
  const { lines, itemCount, total } = getCartDetails();
  updateCartBadge();
  emptyCart.hidden = itemCount !== 0;
  cartSummary.hidden = itemCount === 0;
  cartItems.innerHTML = lines.map(item => `
    <div class="cart-line">
      <div class="cart-thumb" style="background:${item.color}" aria-hidden="true">${item.emoji}</div>
      <div>
        <div class="cart-line-name">${item.name}</div>
        <div class="cart-line-price">${money(item.price)} each</div>
        <div class="quantity-controls">
          <button data-quantity="${item.id}" data-change="-1" aria-label="Decrease ${item.name} quantity">−</button>
          <span>${item.quantity}</span>
          <button data-quantity="${item.id}" data-change="1" aria-label="Increase ${item.name} quantity">+</button>
        </div>
      </div>
      <div class="line-end"><div class="line-total">${money(item.lineTotal)}</div><button class="remove-button" data-remove="${item.id}">Remove</button></div>
    </div>`).join("");
  document.getElementById("subtotal").textContent = money(total);
  document.getElementById("total").textContent = money(total); // Delivery is free in this demo.
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
}

function openCart() {
  renderCart();
  cartOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("closeCart").focus();
}
function closeCart() {
  cartOverlay.hidden = true;
  document.body.style.overflow = "";
  document.getElementById("openCart").focus();
}

function openCheckoutPreview() {
  const { lines, itemCount, total } = getCartDetails();
  if (!itemCount) return;
  document.getElementById("checkoutItems").innerHTML = lines.map(item =>
    `<div class="checkout-item"><span>${item.name} × ${item.quantity}</span><strong>${money(item.lineTotal)}</strong></div>`
  ).join("");
  document.getElementById("checkoutTotal").textContent = money(total);
  cartOverlay.hidden = true;
  document.getElementById("checkoutModal").hidden = false;
  document.getElementById("closeCheckout").focus();
}
function closeCheckout() {
  document.getElementById("checkoutModal").hidden = true;
  document.body.style.overflow = "";
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  if (!products.some(product => product.id === id)) return;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast("Added to your little cart ✦");
});

document.querySelectorAll(".filter-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.category);
  });
});

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart.delete(removeButton.dataset.remove);
  } else if (quantityButton) {
    const id = quantityButton.dataset.quantity;
    const nextQuantity = (cart.get(id) || 0) + Number(quantityButton.dataset.change);
    if (nextQuantity <= 0) cart.delete(id); // Removing the final item returns to the empty-cart state.
    else cart.set(id, nextQuantity);
  } else return;
  renderCart();
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", openCheckoutPreview);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
document.getElementById("finishPreview").addEventListener("click", closeCheckout);
cartOverlay.addEventListener("click", event => { if (event.target === cartOverlay) closeCart(); });
document.getElementById("checkoutModal").addEventListener("click", event => { if (event.target.id === "checkoutModal") closeCheckout(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (!document.getElementById("checkoutModal").hidden) closeCheckout();
    else if (!cartOverlay.hidden) closeCart();
  }
});

renderProducts();
renderCart();
