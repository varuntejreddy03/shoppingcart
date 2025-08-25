// Product Data with Images
const products = [
  { id: "p1", name: "Laptop Model 1", price: 1452.75, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
  { id: "p2", name: "Console Model 2", price: 863.12, image: "https://images.unsplash.com/photo-1606813902919-30c6c6f74c3c?w=400" },
  { id: "p3", name: "Console Model 3", price: 451.89, image: "https://images.unsplash.com/photo-1606813902919-30c6c6f74c3c?w=400" },
];
// Promo Codes
const PROMO_CODES = {
  'SUMMER10': { type: 'percent', value: 0.10 },
  'FREESHIP': { type: 'fixed', value: 5.99 },
  'WELCOME20': { type: 'percent', value: 0.20, minSpend: 100 }
};

let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let filteredProducts = products;

// Render Products
function renderProducts() {
  const catalog = document.getElementById("product-catalog");
  catalog.innerHTML = "";
  filteredProducts.forEach(p => {
    const rating = (Math.random() * (5 - 3) + 3).toFixed(1); // random 3.0 - 5.0
    const reviews = Math.floor(Math.random() * 200) + 20;
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" 
           onerror="this.style.display='none'; this.insertAdjacentHTML('afterend','<div class=\\'no-img\\'>${p.name}</div>');">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <p class="rating">⭐ ${rating} (${reviews})</p>
      <button class="add-btn" onclick="addItem('${p.id}')">Add to Cart</button>
      <button class="wishlist-add" onclick="addToWishlist('${p.id}')">❤️ Save</button>
    `;
    catalog.appendChild(div);
  });
}

// Cart Functions
function addItem(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  saveCart();
  renderCart();
}
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}
function saveCart() {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Wishlist Functions
function addToWishlist(id) {
  const product = products.find(p => p.id === id);
  if (!wishlist.some(p => p.id === id)) {
    wishlist.push(product);
  }
  saveWishlist();
  renderWishlist();
}
function removeWishlist(index) {
  wishlist.splice(index, 1);
  saveWishlist();
  renderWishlist();
}
function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}
function renderWishlist() {
  const wishDiv = document.getElementById("wishlist-items");
  const emptyMsg = document.getElementById("empty-wishlist");
  wishDiv.innerHTML = "";

  if (wishlist.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
    wishlist.forEach((item, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <button onclick="addItem('${item.id}')">Add to Cart</button>
        <button onclick="removeWishlist(${index})">Remove</button>
      `;
      wishDiv.appendChild(div);
    });
  }
  document.getElementById("wishlist-count").innerText = wishlist.length;
}

// Render Cart
function renderCart() {
  const cartDiv = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart-message");
  cartDiv.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      `;
      cartDiv.appendChild(div);
    });
  }

  document.getElementById("cart-count").innerText = cart.length;
  calculateTotals();
}

// Calculate Totals
function calculateTotals() {
  let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;
  const code = document.getElementById("promo-code")?.value || "";
  if (PROMO_CODES[code]) {
    const promo = PROMO_CODES[code];
    if (promo.type === "percent" && (!promo.minSpend || subtotal >= promo.minSpend)) {
      discount = subtotal * promo.value;
    } else if (promo.type === "fixed") {
      discount = promo.value;
    }
  }
  let tax = (subtotal - discount) * 0.08;
  let total = subtotal - discount + tax;
  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("discount").innerText = discount.toFixed(2);
  document.getElementById("tax").innerText = tax.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

// Promo
document.getElementById("apply-promo").addEventListener("click", () => {
  const code = document.getElementById("promo-code").value;
  if (!PROMO_CODES[code]) {
    alert("Invalid promo code");
  }
  calculateTotals();
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
  document.getElementById("checkout-form").style.display = "flex";
});
document.getElementById("place-order-button").addEventListener("click", () => {
  const name = document.getElementById("full-name").value;
  if (!name) {
    alert("Please enter your details");
    return;
  }
  const total = document.getElementById("total").innerText;
  document.getElementById("receipt-content").innerHTML = `
    <div class="receipt-box">
      <h3>✅ Order Placed</h3>
      <p>Thank you, <b>${name}</b>!</p>
      <p>Total Paid: <b>$${total}</b></p>
    </div>
  `;
  document.getElementById("checkout-form").style.display = "none";
  cart = [];
  saveCart();
  renderCart();
});

// Toggles
function toggleCart() {
  const cartPopup = document.getElementById("cart-popup");
  cartPopup.style.display = cartPopup.style.display === "none" ? "block" : "none";
}
function toggleWishlist() {
  const popup = document.getElementById("wishlist-popup");
  popup.style.display = popup.style.display === "none" ? "block" : "none";
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Init Dark Mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// Filters & Search
function filterCategory(cat) {
  filteredProducts = (cat === "All") ? products : products.filter(p => p.name.startsWith(cat));
  renderProducts();
}
document.getElementById("search").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  filteredProducts = products.filter(p => p.name.toLowerCase().includes(query));
  renderProducts();
});

// Init
renderProducts();
renderCart();
renderWishlist();
