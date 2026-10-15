import { parseHTML } from "linkedom";
import { createHash } from "node:crypto";
import { loadSite, read, write, escape, pageUrl, replaceBlock } from "./geo-lib.mjs";

const { config, products, productCard, productDetailMarkup } = await loadSite();
const facts = JSON.parse(await read("geo/product-facts.json"));
const assetVersions = new Map(await Promise.all(["shop.css", "shop.js"].map(async file =>
  [file, createHash("sha256").update(await read(file)).digest("hex").slice(0, 12)]
)));
const organizationId = config.origin + "/#organization";
const websiteId = config.origin + "/#website";
const productFor = (page) => products.find((product) => product.id === page.productId);

function structuredData(page) {
  const url = pageUrl(config, page.file);
  const graph = [{
    "@type": "WebPage", "@id": url + "#webpage", url,
    name: page.title, description: page.description, inLanguage: config.language,
    isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId }
  }];
  if (page.file === "index.html") {
    graph.push({ "@type": "Organization", "@id": organizationId, name: config.organization, url: config.origin + "/" });
    graph.push({ "@type": "WebSite", "@id": websiteId, name: config.organization, url: config.origin + "/", inLanguage: config.language });
  }
  if (page.productId) {
    const product = productFor(page);
    graph[0].mainEntity = { "@id": url + "#product" };
    graph.push({
      "@type": "Product", "@id": url + "#product", url,
      name: product.detailName || product.name, description: product.details,
      image: [new URL(product.detailImage || product.image, config.origin + "/").href],
      brand: { "@type": "Brand", name: config.organization },
      offers: { "@type": "Offer", url: product.buyUrl, priceCurrency: "USD", price: product.price }
    });
  }
  if (page.type === "catalog") {
    graph.push({ "@type": "ItemList", itemListElement: products.map((p, index) => ({
      "@type": "ListItem", position: index + 1, name: p.name, url: pageUrl(config, p.detailPath)
    })) });
  }
  if (page.type === "article") {
    graph.push({
      "@type": "Article", "@id": url + "#article", headline: page.title,
      description: page.description, mainEntityOfPage: { "@id": url + "#webpage" },
      author: { "@type": "Organization", name: config.organization, url: config.origin + "/" },
      publisher: { "@id": organizationId }, datePublished: page.published, dateModified: page.modified,
      image: [new URL(page.image, config.origin + "/").href], inLanguage: config.language
    });
  }
  if (page.indexable !== false && page.file !== "index.html") {
    const trail = [{ name: "CHICWAY", item: config.origin + "/" }];
    if (page.productId) trail.push({ name: "Products", item: pageUrl(config, "products.html") });
    if (page.type === "article") trail.push({ name: "Guides", item: pageUrl(config, "guides.html") });
    trail.push({ name: page.title, item: url });
    graph.push({ "@type": "BreadcrumbList", itemListElement: trail.map((entry, index) => ({ "@type": "ListItem", position: index + 1, ...entry })) });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function head(page) {
  const product = productFor(page);
  const image = page.image || product?.detailImage || product?.image;
  const url = pageUrl(config, page.file);
  const meta = [
    `  <title>${escape(page.title)}</title>`,
    `  <meta name="description" content="${escape(page.description)}">`,
    `  <meta name="robots" content="${page.indexable === false ? "noindex,follow" : "index,follow,max-image-preview:large"}">`,
    `  <link rel="canonical" href="${url}">`,
    `  <meta property="og:site_name" content="CHICWAY">`,
    `  <meta property="og:type" content="${page.type === "article" ? "article" : "website"}">`,
    `  <meta property="og:title" content="${escape(page.title)}">`,
    `  <meta property="og:description" content="${escape(page.description)}">`,
    `  <meta property="og:url" content="${url}">`,
    `  <meta name="twitter:card" content="summary_large_image">`
  ];
  if (image) meta.push(`  <meta property="og:image" content="${new URL(image, config.origin + "/").href}">`);
  if (config.integrations.googleSiteVerification) meta.push(`  <meta name="google-site-verification" content="${escape(config.integrations.googleSiteVerification)}">`);
  if (config.integrations.bingSiteVerification) meta.push(`  <meta name="msvalidate.01" content="${escape(config.integrations.bingSiteVerification)}">`);
  const measurementId = config.integrations.ga4MeasurementId;
  if (measurementId) {
    if (!/^G-[A-Z0-9]+$/.test(measurementId)) throw new Error("Invalid GA4 measurement ID.");
    meta.push(`  <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`);
    meta.push(`  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');</script>`);
  }
  meta.push(`  <script type="application/ld+json">${JSON.stringify(structuredData(page)).replaceAll("<", "\\u003c")}</script>`);
  meta.push('  <script src="assets/site-events.js" defer></script>');
  return meta.join("\n");
}

const headerSource = parseHTML(await read("products.html")).document.querySelector("header").outerHTML;
function header(page) {
  const { document } = parseHTML(headerSource);
  document.querySelectorAll(".nav-links a").forEach((a) => { a.classList.remove("active"); a.removeAttribute("aria-current"); });
  const active = page.productId
    ? document.querySelector(`[data-product-id="${page.productId}"]`)
    : document.querySelector(`.nav-links a[href="${page.type === "article" ? "guides.html" : page.file}"]`);
  if (active) {
    active.classList.add("active");
    active.setAttribute("aria-current", page.type === "article" ? "location" : "page");
  }
  return document.querySelector("header").outerHTML;
}

function shell(page, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- GEO:HEAD -->
${head(page)}
  <!-- /GEO:HEAD -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Epilogue:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shop.css">
</head>
<body>
  ${header(page)}
  <main>${content}</main>
  <footer class="guide-footer container"><a href="index.html">CHICWAY</a><a href="products.html">All Products</a><a href="guides.html">Guides</a><a href="index.html#contact">Contact Us</a></footer>
</body>
</html>
`.replace(/[ \t]+$/gm, "");
}

function comparisonGuide(page) {
  const portable = products.find((p) => p.id === "soothe-portable");
  const hub = products.find((p) => p.id === "sleep-hub");
  const productSummary = (p, intro) => `<article class="guide-product">
    <a href="${p.detailPath}"><img src="${p.detailImage || p.image}" width="600" height="600" alt="${escape(p.name)}" decoding="async"></a>
    <h2>${escape(p.name)}</h2><p>${intro}</p>
    <a class="pill-btn" href="${p.buyUrl}" target="_blank" rel="noopener noreferrer" data-product-id="${p.id}">Buy on Amazon</a>
    <a class="guide-detail-link" href="${p.detailPath}">Product details</a>
  </article>`;
  return `<article class="guide-article container">
    <nav class="guide-breadcrumb" aria-label="Breadcrumb"><a href="guides.html">Guides</a><span>Product comparison</span></nav>
    <h1>CHICWAY Portable Sound Machine vs 5-in-1 Sleep Hub</h1>
    <p class="guide-date">By CHICWAY &middot; Updated <time datetime="${escape(page.modified)}">${new Date(page.modified + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></p>
    <p class="guide-lead">Choose the portable model when cry detection and a recorded parent voice are the features you need. Choose the 5-in-1 Sleep Hub when you want fragrance, galaxy projection, lighting and built-in sounds in one bedside device.</p>
    <div class="guide-product-row">
      ${productSummary(portable, "18 built-in sounds, AI cry detection and recordable parent voice.")}
      ${productSummary(hub, "Built-in sounds, fragrance, galaxy projection, night light and Bluetooth.")}
    </div>
    <h2>Compare the listed features</h2>
    <div class="guide-table-wrap"><table class="guide-table"><caption>CHICWAY product features</caption>
      <thead><tr><th scope="col">Feature</th><th scope="col">Portable Sound Machine</th><th scope="col">5-in-1 Sleep Hub</th></tr></thead>
      <tbody>${facts.comparison.map((row) => `<tr><th scope="row">${escape(row.feature)}</th><td>${escape(row.portable)}</td><td>${escape(row.hub)}</td></tr>`).join("\n")}</tbody>
    </table></div>
    <p class="guide-note">This comparison uses CHICWAY product information. A feature marked "not listed" has not been confirmed for that model. These are separate products; check the selected Amazon listing for current pricing and availability.</p>
    <h2>When to consider the portable sound machine</h2>
    <p>The portable manual describes recorded parent messages along with lullabies after cry detection. It also describes manual sound selection, a night light and switchable Bluetooth audio. These features may be useful when you want a familiar audio routine across different rooms or during travel.</p>
    <p>Cry-triggered playback provides sound while a parent checks on the child. It is not a substitute for checking on a baby or responding to their needs.</p>
    <h2>When to consider the 5-in-1 Sleep Hub</h2>
    <p>The Sleep Hub combines five functions: fragrance, built-in sounds, a galaxy projector, a night light and a Bluetooth speaker. It is the model to explore when your priority is a bedside setup with sound, scent and illumination together.</p>
    <p>Its on-device controls cover power, timer, Bluetooth and fragrance, and projector and night light modes. The <a href="sleep-hub-controls-and-fragrance-guide.html">Sleep Hub controls and fragrance guide</a> explains the current manual's button actions and cartridge installation.</p>
    <h2>Which model uses fragrance replacement cartridges?</h2>
    <p>The <a href="fragrance-replacement-cartridges.html">fragrance replacement cartridges</a> are listed for the CHICWAY 5-in-1 Sleep Hub. Each package contains three replacement cartridges. Choose Agarwood x3, Lavender x3 or Sweet Orange x3 using the separate Amazon links on the cartridge page.</p>
    <h2>Does the Sleep Hub include AI cry detection?</h2>
    <p>AI cry detection is listed for the portable sound machine. The Sleep Hub's supplied instructions list fragrance, built-in sound, galaxy projection, lighting and Bluetooth; they do not list cry detection. Choose by the confirmed features of the specific model.</p>
    <h2>Where can I buy these CHICWAY products?</h2>
    <p>Open either product's Amazon button above, or visit <a href="products.html">all CHICWAY products</a> to compare the available products and fragrance packs. Amazon displays the current seller, final price, delivery options and checkout details.</p>
    <p class="guide-note">Source: CHICWAY <a href="${portable.detailPath}">portable model information</a>, <a href="${hub.detailPath}">Sleep Hub information</a> and <a href="fragrance-replacement-cartridges.html">replacement cartridge information</a>. This page summarizes product specifications; it does not present independent product tests or customer reviews.</p>
  </article>`;
}

for (const page of config.pages) {
  let output;
  if (page.productId) {
    const product = productFor(page);
    if (!product || product.detailPath !== page.file) throw new Error(`Product route mismatch: ${page.file}`);
    output = shell(page, `<section class="detail-section"><div class="container detail-grid" data-product-detail data-product-id="${product.id}" data-prerendered="true">${productDetailMarkup(product)}</div></section>`);
  } else if (page.type === "guides") {
    const guides = config.pages.filter((entry) => entry.type === "article");
    output = shell(page, `<section class="guide-article container"><h1>CHICWAY Product Guides</h1><p class="guide-lead">Compare the features of CHICWAY sound machines and the 5-in-1 Sleep Hub.</p>${guides.map((entry) => `<article class="guide-list-item"><img src="${entry.image}" width="320" height="320" alt="${escape(entry.title)}" decoding="async"><div><h2><a href="${entry.file}">${escape(entry.title)}</a></h2><p>${escape(entry.description)}</p></div></article>`).join("\n")}</section>`);
  } else if (page.type === "article") {
    output = shell(page, page.template === "comparison" ? comparisonGuide(page) : await read(page.contentFile));
  } else {
    output = replaceBlock(await read(page.file), "HEAD", head(page));
    if (page.type === "catalog") output = replaceBlock(output, "CATALOG", `        <div class="product-grid" data-products-grid data-prerendered="true">${products.map((product) => productCard(product).trim()).join("\n")}</div>`);
  }
  output = output.replace(/(href|src)="(shop\.(?:css|js))(?:\?v=[a-f0-9]+)?"/g,
    (_, attribute, file) => `${attribute}="${file}?v=${assetVersions.get(file)}"`);
  await write(page.file, output);
}

const indexable = config.pages.filter((page) => page.indexable !== false);
await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((page) => `  <url><loc>${escape(pageUrl(config, page.file))}</loc><lastmod>${page.modified}</lastmod></url>`).join("\n")}\n</urlset>\n`);
await write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /geo/\nDisallow: /scripts/\nDisallow: /node_modules/\nDisallow: /package.json\nDisallow: /package-lock.json\n\nSitemap: ${config.origin}/sitemap.xml\n`);
await write(config.indexNowKey + ".txt", config.indexNowKey + "\n");
await write(".nojekyll", "");
console.log(`Built ${config.pages.length} pages; ${indexable.length} canonical URLs in sitemap. Analytics ${config.integrations.ga4MeasurementId ? "configured" : "awaiting GA4 ID"}.`);
