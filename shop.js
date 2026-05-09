const CHICWAY_CART_KEY = "chicwayCart";

const PRODUCTS = [
  {
    id: "soothe-portable",
    name: "Soothe Portable Sound Machine",
    price: 32.99,
    image: "assets/products/white-noise-sound-machine-1.jpg",
    short: "Responsive white noise, lullabies, and parental voice playback in one nursery-ready speaker.",
    details: "A premium portable sound machine for families who want reliable rest at home, during naps, and while traveling.",
    tags: ["AI cry detection", "Portable", "Voice playback"],
    features: [
      "Directional sound field for focused sleep-zone audio.",
      "Parent voice recording with gentle playback.",
      "Rechargeable design for nursery, stroller, and travel use."
    ]
  },
  {
    id: "sleep-hub",
    name: "5-in-1 Sleep Hub",
    price: 189,
    image: "assets/products/nava-white.jpg",
    short: "A fuller bedside hub with Fragrance Diffuser, White Noise, Galaxy Projector, Night Light, and Bluetooth audio.",
    details: "Built for parents who want one quiet device to manage bedtime, wake windows, and room ambience.",
    tags: ["Night light", "Bluetooth", "Bedside hub"],
    features: [
      "Warm dimmable light for feeds and check-ins.",
      "Expanded speaker chamber for richer room-filling audio.",
      "Simple bedtime controls for repeatable sleep routines."
    ]
  },
  {
    id: "travel-mini",
    name: "Soothe Travel Mini",
    price: 79,
    image: "assets/utility/travel-morning.png",
    short: "A compact sound companion for hotels, grandparents' homes, and stroller naps.",
    details: "Small enough for the diaper bag, tuned for consistent sleep cues wherever the day takes you.",
    tags: ["Travel", "Compact", "USB-C"],
    features: [
      "Lightweight shell with soft-touch controls.",
      "Loop-free rest sounds for unfamiliar rooms.",
      "USB-C charging and long weekend battery life."
    ]
  },
  {
    id: "focus-speaker",
    name: "Soothe Focus Speaker",
    price: 99,
    image: "assets/utility/office-focus.png",
    short: "A grown-up companion mode for focus, podcasts, and pink-noise work sessions.",
    details: "Designed for the stage after sleep training, with refined audio that fits the desk or bedside.",
    tags: ["Pink noise", "Desk-ready", "Speaker mode"],
    features: [
      "Balanced audio for focus sessions and calm evenings.",
      "Minimal design that fits shared family spaces.",
      "Quick Bluetooth pairing for daily use."
    ]
  }
];

const formatMoney = (amount) => `$${amount.toFixed(2)}`;

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CHICWAY_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem(CHICWAY_CART_KEY, JSON.stringify(cart));
  updateCartCounts();
};

const findProduct = (id) => PRODUCTS.find((product) => product.id === id) || PRODUCTS[0];

const addToCart = (id, quantity = 1) => {
  const cart = readCart();
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, quantity });
  }

  writeCart(cart);
};

const updateQuantity = (id, delta) => {
  const cart = readCart()
    .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0);

  writeCart(cart);
  renderCart();
};

const cartQuantity = () => readCart().reduce((sum, item) => sum + item.quantity, 0);

const updateCartCounts = () => {
  const count = cartQuantity();

  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = count;
    badge.hidden = count === 0;
  });
};

const productCard = (product) => `
  <article class="product-card">
    <a href="product-detail.html?id=${product.id}" aria-label="View ${product.name}">
      <img src="${product.image}" alt="${product.name}">
    </a>
    <div class="product-body">
      <h3>${product.name}</h3>
      <p>${product.short}</p>
      <div class="price-row">
        <span class="price">${formatMoney(product.price)}</span>
        <button class="small-btn" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
      </div>
    </div>
  </article>
`;

const renderProducts = () => {
  const grid = document.querySelector("[data-products-grid]");

  if (!grid) {
    return;
  }

  grid.innerHTML = PRODUCTS.map(productCard).join("");
};

const renderProductDetail = () => {
  const detail = document.querySelector("[data-product-detail]");

  if (!detail) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const product = findProduct(params.get("id"));
  document.title = `${product.name} | Chicway`;

  detail.innerHTML = `
    <div class="detail-media">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="detail-copy">
      <h1>${product.name}</h1>
      <p>${product.details}</p>
      <div class="detail-meta">
        ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <div class="price">${formatMoney(product.price)}</div>
      <div class="detail-actions">
        <button class="pill-btn" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
        <a class="ghost-btn" href="cart.html">Go to Cart</a>
      </div>
      <ul class="feature-list">
        ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
    </div>
  `;
};

const renderCart = () => {
  const list = document.querySelector("[data-cart-items]");
  const summary = document.querySelector("[data-cart-summary]");

  if (!list || !summary) {
    return;
  }

  const cart = readCart();

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty.</p>
        <a class="pill-btn" href="products.html">Shop Products</a>
      </div>
    `;
    summary.innerHTML = `
      <h2>Order Summary</h2>
      <div class="summary-row"><span>Items</span><strong>0</strong></div>
      <div class="summary-row total"><span>Total</span><strong>${formatMoney(0)}</strong></div>
      <a class="ghost-btn" href="products.html">Browse Products</a>
    `;
    return;
  }

  const detailedItems = cart.map((item) => ({ ...findProduct(item.id), quantity: item.quantity }));
  const subtotal = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;

  list.innerHTML = detailedItems.map((item) => `
    <article class="cart-item">
      <a href="product-detail.html?id=${item.id}">
        <img src="${item.image}" alt="${item.name}">
      </a>
      <div>
        <h3>${item.name}</h3>
        <p>${item.short}</p>
        <div class="quantity-control" aria-label="Quantity controls for ${item.name}">
          <button type="button" data-qty="${item.id}" data-delta="-1" aria-label="Decrease ${item.name} quantity">-</button>
          <strong>${item.quantity}</strong>
          <button type="button" data-qty="${item.id}" data-delta="1" aria-label="Increase ${item.name} quantity">+</button>
        </div>
      </div>
      <div class="line-total">${formatMoney(item.price * item.quantity)}</div>
    </article>
  `).join("");

  summary.innerHTML = `
    <h2>Order Summary</h2>
    <div class="summary-row"><span>Items</span><strong>${cartQuantity()}</strong></div>
    <div class="summary-row"><span>Subtotal</span><strong>${formatMoney(subtotal)}</strong></div>
    <div class="summary-row"><span>Shipping</span><strong>${shipping === 0 ? "Free" : formatMoney(shipping)}</strong></div>
    <div class="summary-row total"><span>Total</span><strong>${formatMoney(total)}</strong></div>
    <button class="pill-btn" type="button" data-checkout>Checkout</button>
    <a class="ghost-btn" href="products.html">Continue Shopping</a>
    <p class="checkout-note" data-checkout-note></p>
  `;
};

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  const quantityButton = event.target.closest("[data-qty]");
  const checkoutButton = event.target.closest("[data-checkout]");

  if (addButton) {
    addToCart(addButton.dataset.addToCart);
    addButton.textContent = "Added";
    window.setTimeout(() => {
      addButton.textContent = "Add to Cart";
    }, 1100);
  }

  if (quantityButton) {
    updateQuantity(quantityButton.dataset.qty, Number(quantityButton.dataset.delta));
  }

  if (checkoutButton) {
    const note = document.querySelector("[data-checkout-note]");
    if (note) {
      note.textContent = "Checkout is ready. Connect a payment provider here when the store goes live.";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderProductDetail();
  renderCart();
  updateCartCounts();
});
