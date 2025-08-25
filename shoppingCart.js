// Dummy product data
const products = [
  { id: "1", name: "Laptop Pro", price: 999.99, image: "https://via.placeholder.com/100" },
  { id: "2", name: "Headphones", price: 199.99, image: "https://via.placeholder.com/100" },
  { id: "3", name: "Smartphone", price: 599.99, image: "https://via.placeholder.com/100" }
];

// Promo Codes
const PROMO_CODES = {
  'SUMMER10': { type: 'percent', value: 0.10 },
  'FREESHIP': { type: 'fixed', value: 5.99 },
  'WELCOME20': { type: 'percent', value: 0.20, minSpend: 100 }
};

let cart = [];

// Render Products
function renderProducts() {
  const catalog = document.getElementById("product-catalog");
  catalog.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button onclick="addItem('${p.id}')">Add to Cart</button>
    `;
    catalog.appendChild(div);
  });
}

// Add Item to Cart
function addItem(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  renderCart();
}

// Remove Item
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
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
      div.classList.add("product");
      div.innerHTML = `
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <button onclick="removeItem(${index})">Remove</button>
      `;
      cartDiv.appendChild(div);
    });
  }
  calculateTotals();
}

// Calculate Totals
function calculateTotals() {
  let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;

  const code = document.getElementById("promo-code").value.toUpperCase();
  if (PROMO_CODES[code]) {
    const promo = PROMO_CODES[code];
    if (promo.type === "percent" && (!promo.minSpend || subtotal >= promo.minSpend)) {
      discount = subtotal * promo.value;
    } else if (promo.type === "fixed") {
      discount = promo.value;
    }
  }

  let tax = (subtotal - discount) * 0.08; // 8% tax
  let total = subtotal - discount + tax;

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("discount").innerText = discount.toFixed(2);
  document.getElementById("tax").innerText = tax.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

// Apply Promo
document.getElementById("apply-promo").addEventListener("click", () => {
  const code = document.getElementById("promo-code").value.toUpperCase();
  if (!PROMO_CODES[code]) {
    alert("Invalid promo code");
  }
  calculateTotals();
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
  document.getElementById("checkout-form").style.display = "block";
});

// Shipping Continue
document.getElementById("shipping-continue").addEventListener("click", () => {
  alert("Proceeding to payment...");
});

// Place Order
document.getElementById("place-order-button").addEventListener("click", () => {
  const name = document.getElementById("full-name").value;
  const total = document.getElementById("total").innerText;

  document.getElementById("receipt").style.display = "block";
  document.getElementById("receipt-content").innerHTML = `
    <h3>Order Confirmation</h3>
    <p>Thank you, ${name}!</p>
    <p>Total Paid: $${total}</p>
  `;


  cart = [];
  renderCart();
});

// Initialize
renderProducts();
renderCart();
