const CHICWAY_CART_KEY = "chicwayCart";

const PRODUCTS = [
  {
    id: "soothe-portable",
    name: "Soothe Portable Sound Machine",
    detailName: "Portable Sound Machine with AI Cry Detection White Noise Machine",
    price: 32.99,
    image: "assets/products/white-noise-sound-machine-1.webp",
    buyUrl: "https://www.amazon.com/CHICWAY-Portable-Sound-Machine-Detection/dp/B0H8RZ65QK",
    short: "Responsive white noise, lullabies, and parental voice playback in one nursery-ready speaker.",
    details: "Mom's Choice Awards 18 Soothing Sounds Bluetooth Speaker Night Light Timer White Noise for Baby Adult Home Travel Office Gray",
    tags: [],
    features: [
      {
        title: "MOM'S CHOICE AWARDS GOLD WINNER & PERFECT GIFT",
        body: "Trust the experts and experienced parents. Honored with the prestigious Mom's Choice Awards, this reliable noise machine is built with safety and quality in mind. This white noise machine for sleeping is one of the top baby registry gifts and makes an unforgettable, practical baby shower gift for any new parent looking for a peaceful night."
      },
      {
        title: "AI CRY DETECTION AND AUTO PLAYBACK",
        body: "For parents who want a hands-free audio response to middle-of-the-night fussing, this baby sound machine detects a baby's cry within 3.28 ft / 1 m and automatically plays a recorded parental message or built-in lullaby; the feature provides a familiar sound while the parent checks on the child, without requiring repeated manual playback."
      },
      {
        title: "RECORDABLE PARENT VOICE",
        body: "For parents preparing a nursery or managing bedtime from another room, this sound machine for sleep lets them record comforting words for automatic playback after cry detection; a familiar voice message personalizes the audio routine when the parent is briefly away, while on-device recording keeps the feature ready without relying on a phone."
      },
      {
        title: "BACKGROUND SOUND MASKING",
        body: "For babies, children, and adults who notice barking dogs, neighbors, traffic, or household activity at bedtime, this white noise machine for sleeping provides steady sound options to help cover disruptive environmental noise; use it in a nursery, bedroom, or temporary sleeping space so the room has a more consistent audio setting across changing surroundings."
      },
      {
        title: "18 BUILT-IN SOUNDS",
        body: "For parents choosing audio for naps, bedtime, or quiet routines, this baby white noise machine offers 18 selections including pink noise, brown noise, hush, fan, womb heartbeat, ocean, water, stream birdsong, forest birdsong, night chirping, campfire, rain, thunderstorm, temple bell & wooden knocker, outer space, Brahms lullaby, Schubert lullaby, and Twinkle Twinkle Little Star; helping babies drift off to sleep faster. This white noise machine baby is an essential addition to every nursery."
      },
      {
        title: "SWITCHABLE BLUETOOTH AUDIO",
        body: "For parents who want built-in sounds for a baby and phone audio for themselves, this portable sound machine baby lets Bluetooth stay off during nursery use or turn on to stream music from a phone; the rechargeable design supports room-to-room listening and road trips without leaving a separate speaker or continuous power cord beside the bed."
      },
      {
        title: "3 AUTO-OFF TIMERS",
        body: "For caregivers setting a limited sound period at bedtime or during a nap, this white noise sound machine offers 30 minutes, 60 minutes, and 120 minutes settings; choose the preferred duration and the unit switches off at the selected time, reducing unnecessary battery use and avoiding a nighttime trip back to the device for manual shutdown."
      },
      {
        title: "6-LEVEL NIGHT LIGHT",
        body: "For new parents handling nighttime feeds or diaper changes and families needing low-level nursery light, this portable white noise machine provides six adjustable brightness levels with a soft glow; select enough visibility for bedside care while keeping the room lighting controlled, then pair the light with built-in sounds for a coordinated nighttime routine."
      },
      {
        title: "TRAVEL AND OFFICE SOUND MASKING",
        body: "For parents taking a baby between rooms or on trips, and adults working near distracting conversations, this travel sound machine also functions as a sound machine for office privacy; the rechargeable battery supports up to 5 days, helping cover background speech or household noise without keeping the unit connected to a wall outlet."
      },
      {
        title: "COMPACT USB-C TRAVEL DESIGN",
        body: "For families, business travelers, and nursing-room users packing limited space, this baby sound machine for sleeping has a palm-sized body listed at 2 x 2 x 3 inches; USB-C charging reaches a full charge in about 2 hours and supports up to 5 days between charges."
      }
    ]
  },
  {
    id: "sleep-hub",
    name: "5-in-1 Sleep Hub",
    detailName: "Galaxy Projector Night Light with Fragrance, White Noise Machine",
    price: 149.99,
    image: "assets/products/sleep-hub/hero.webp",
    detailImage: "assets/products/sleep-hub/hero.webp",
    buyUrl: "https://www.amazon.com/CHICWAY-Galaxy-Projector-Fragrance-Machine/dp/B0H8CFM745",
    short: "A fuller bedside hub with Fragrance Diffuser, White Noise, Galaxy Projector, Night Light, and Bluetooth audio.",
    details: "21 Sounds with Timer, RGB LED Star Projector for Adult, Baby, Kids, Bluetooth Speaker, Sound Machine for Travel Home",
    tags: [],
    features: [
      {
        title: "5-IN-1 FAMILY BEDTIME HUB",
        body: "Designed for stressed adults, new parents, light sleepers, and families establishing a consistent bedtime ritual, this galaxy light projector integrates 21 non-looping sounds, home fragrance, Saturn galaxy projector, warm and RGB night light, plus Bluetooth speaker; one compact bedside unit synchronizes sound masking, ambient illumination, soothing scents, and personalized audio preferences."
      },
      {
        title: "GALAXY NIGHT LIGHT PROJECTOR",
        body: "For overthinkers, couples, travelers, and families seeking a captivating visual anchor in bedrooms, hotel suites, or nurseries, this projector night light could be used as a galaxy projector for bedroom, casting a Saturn pattern and twinkling starlight across the ceiling; selectable modes synchronize illumination with built-in audio for bedtime reading, family story time, meditation, or evening ambiance."
      },
      {
        title: "BUILT-IN HOME FRAGRANCE DEVICE",
        body: "For adults and new parents curating a serene personal bedroom, meditation, or yoga sanctuary, this projector light with fragrance device features lavender, sweet orange, or agarwood essence; select a signature scent to harmonize your adult relaxation space without crowding the nightstand with a separate home fragrance unit."
      },
      {
        title: "21 NON-LOOPING SOOTHING SOUNDS",
        body: "For parents reinforcing steady bedtime routines for babies, toddlers, or children, and adults bothered by evening noise, this space projector and white noise sound machine features white, brown, and pink noise plus fan, rain, ocean, heartbeat, lullaby, and immersive nature effects; pick a customized mode to mask intrusive sounds without repetitive playback."
      },
      {
        title: "Bluetooth Speaker for Meditation",
        body: "For adults indulging in guided meditations, custom playlists, audiobooks, or podcasts, and parents entertaining children with lullabies or storytime sessions, this light projector for bedroom syncs to a phone or tablet via its onboard Bluetooth speaker; enjoy personal streaming by day or deploy the kids night light projector unit for gentle music, then transition smoothly to the preloaded sound library at bedtime."
      },
      {
        title: "ADJUSTABLE NIGHT LIGHT PROJECTOR",
        body: "For new parents navigating midnight feeds or diaper changes, families settling children at bedtime, and adults requiring subtle illumination, this kids night light offers six warm-yellow brightness levels, a breathing-fade mode, and dynamic RGB cycling; engage the gentle amber glow for discreet bedside visibility or select from the color spectrum for reading, playtime, meditation, yoga, and refined room ambiance."
      },
      {
        title: "3 AUTO-OFF TIMERS",
        body: "For hotel guests, parents, and caregivers aiming to limit scheduled sound or light exposure, this star projector for bedroom features 30, 60, and 120-minute timers; select an ideal duration for an adult or child's bedtime ritual, allowing the unit to power down automatically to conserve battery life and eliminate the need for late-night manual adjustments."
      },
      {
        title: "COMPACT OFFICE SOUND MASKING",
        body: "For office professionals, remote workers, and shift workers mitigating nearby conversations or intrusive daytime household noise, this romantic light for bedroom measures 3.5 x 3.1 x 4.3 in and weighs just 0.65 lb; deploy this desktop privacy tool to help mask distracting background speech while maintaining a footprint small enough to transition seamlessly between a desk, bedside table, and travel carry-on."
      },
      {
        title: "DIRECT CONTROLS AND MEMORY",
        body: "For parents, grandparents, babysitters, caregivers, and older children operating the device without app dependency or Wi-Fi connectivity, this baby night light automatically recalls the last-selected sound, volume, and lighting mode upon restart; intuitive tactile buttons keep all adjustments onboard, minimizing repetitive setup as family routines shift between daytime listening, bedtime rituals, and different rooms."
      },
      {
        title: "CORD-FREE FAMILY TRAVEL POWER",
        body: "For frequent travelers and parents transitioning between bedrooms, hotels, and family visits, this night light for kids doubles as a travel sound machine featuring a robust 5000 mAh rechargeable battery; enjoy up to five days of uninterrupted use per charge via a convenient USB-C port, ensuring consistent family sleep routines remain powered without tethering to a wall outlet."
      }
    ]
  },
  {
    id: "travel-mini",
    showInCatalog: false,
    name: "Soothe Travel Mini",
    price: 79,
    image: "assets/utility/travel-morning.webp",
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
    showInCatalog: false,
    name: "Soothe Focus Speaker",
    price: 99,
    image: "assets/utility/office-focus.webp",
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
      <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
    </a>
    <div class="product-body">
      <h3>${product.name}</h3>
      <p>${product.short}</p>
      <div class="price-row">
        <span class="price">${formatMoney(product.price)}</span>
        ${product.buyUrl
          ? `<a class="small-btn" href="${product.buyUrl}" target="_blank" rel="noopener noreferrer">Buy Now</a>`
          : ""}
      </div>
    </div>
  </article>
`;

const renderProducts = () => {
  const grid = document.querySelector("[data-products-grid]");

  if (!grid) {
    return;
  }

  grid.innerHTML = PRODUCTS
    .filter((product) => product.showInCatalog !== false)
    .map(productCard)
    .join("");
};

const renderProductDetail = () => {
  const detail = document.querySelector("[data-product-detail]");

  if (!detail) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const product = findProduct(params.get("id"));
  const detailName = product.detailName || product.name;
  document.title = `${detailName} | Chicway`;

  detail.innerHTML = `
    <div class="detail-media">
      <img src="${product.detailImage || product.image}" alt="${product.name}" decoding="async" fetchpriority="high">
    </div>
    <div class="detail-copy">
      <h1>${detailName}</h1>
      <p>${product.details}</p>
      ${product.tags.length
        ? `<div class="detail-meta">
            ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>`
        : ""}
      <div class="price">${formatMoney(product.price)}</div>
      ${product.buyUrl
        ? `<div class="detail-actions">
            <a class="pill-btn" href="${product.buyUrl}" target="_blank" rel="noopener noreferrer">Buy Now</a>
          </div>`
        : ""}
      <ul class="feature-list">
        ${product.features.map((feature) => typeof feature === "string"
          ? `<li>${feature}</li>`
          : `<li><strong>${feature.title}</strong><span>${feature.body}</span></li>`).join("")}
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
        <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
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
  const quantityButton = event.target.closest("[data-qty]");
  const checkoutButton = event.target.closest("[data-checkout]");

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
