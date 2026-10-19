import { access, appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DOMParser, parseHTML } from "linkedom";
import { loadSite, read, write, root, pageUrl } from "./geo-lib.mjs";

const { config, products } = await loadSite();
const live = process.argv.includes("--live");
const failures = [];
const warnings = [];
const checks = [];
const check = (passed, message) => { if (!passed) failures.push(message); };
const clean = (text) => text.replace(/\s+/g, " ").trim();
const indexable = config.pages.filter((page) => page.indexable !== false);

async function exists(file) {
  try { await access(resolve(root, file)); return true; } catch { return false; }
}

function inspect(page, html) {
  const { document } = parseHTML(html);
  const prefix = `${live ? "live" : "local"}:${page.file}`;
  check(document.querySelectorAll("title").length === 1, `${prefix}: expected exactly one title`);
  check(document.title === page.title, `${prefix}: title differs from configured title`);
  const descriptions = document.querySelectorAll('meta[name="description"]');
  check(descriptions.length === 1 && descriptions[0].content === page.description, `${prefix}: missing, duplicate or stale description`);
  const canonicals = document.querySelectorAll('link[rel="canonical"]');
  check(canonicals.length === 1 && canonicals[0].getAttribute("href") === pageUrl(config, page.file), `${prefix}: canonical mismatch`);
  const robots = document.querySelector('meta[name="robots"]')?.content || "";
  check(page.indexable === false ? robots.includes("noindex") : !robots.includes("noindex"), `${prefix}: unexpected robots directive`);
  if (page.indexable !== false) check(document.querySelectorAll("h1").length === 1, `${prefix}: expected one static H1`);
  if (config.integrations.bingSiteVerification) {
    const bingTags = document.querySelectorAll('head meta[name="msvalidate.01"]');
    check(bingTags.length === 1 && bingTags[0].content === config.integrations.bingSiteVerification, `${prefix}: missing, duplicate or stale Bing verification tag`);
  }
  const measurementId = config.integrations.ga4MeasurementId;
  if (measurementId) {
    const expectedTag = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    const googleTags = [...document.querySelectorAll("script[src]")].filter((script) => script.getAttribute("src") === expectedTag);
    const googleInitializers = [...document.querySelectorAll("script:not([src])")].filter((script) => script.textContent.includes("gtag('config','" + measurementId + "')"));
    const scopeGuards = document.querySelectorAll("head script[data-analytics-scope]");
    const expectedGuard = `if(window.location.origin!==${JSON.stringify(config.origin)})window['ga-disable-${measurementId}']=true;`;
    const headScripts = [...document.querySelectorAll("head script")];
    check(scopeGuards.length === 1 && scopeGuards[0].textContent.trim() === expectedGuard, prefix + ": missing or stale production-only analytics guard.");
    check(scopeGuards.length === 1 && googleTags.length === 1 && googleInitializers.length === 1 && headScripts.indexOf(scopeGuards[0]) < headScripts.indexOf(googleTags[0]) && headScripts.indexOf(scopeGuards[0]) < headScripts.indexOf(googleInitializers[0]), prefix + ": analytics scope guard must run before the Google tag and initializer.");
    check(googleTags.length === 1, prefix + ": expected exactly one configured Google tag.");
    check(googleInitializers.length === 1, prefix + ": expected exactly one GA4 initializer.");
    check(document.querySelectorAll('script[src="assets/site-events.js"]').length === 1, prefix + ": missing or duplicate Amazon outbound event script.");
  }
  const schemas = [];
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(script.textContent);
      schemas.push(...(parsed["@graph"] || [parsed]));
    } catch { failures.push(`${prefix}: invalid JSON-LD`); }
  }
  check(schemas.length > 0, `${prefix}: missing structured data`);
  if (page.productId) {
    const product = products.find((p) => p.id === page.productId);
    const schema = schemas.find((entry) => entry["@type"] === "Product");
    check(schema?.name === clean(document.querySelector("h1")?.textContent || ""), `${prefix}: product schema name differs from visible heading`);
    check(schema?.offers?.price === product.price && schema?.offers?.priceCurrency === "USD", `${prefix}: product schema price mismatch`);
    check(clean(document.querySelector(".price")?.textContent || "") === `$${product.price.toFixed(2)}`, `${prefix}: visible price mismatch`);
    check(!schema?.aggregateRating && !schema?.review, `${prefix}: review markup needs verified review evidence`);
    const links = [...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href"));
    for (const option of product.detailBuyOptions || [{ buyUrl: product.buyUrl }]) {
      check(links.includes(option.buyUrl), `${prefix}: missing approved Amazon buying link`);
    }
  }
  if (page.type === "catalog") check(document.querySelectorAll(".product-card").length === products.length, `${prefix}: catalog not fully prerendered`);
  checks.push({ page: page.file, staticH1: document.querySelectorAll("h1").length, schemas: schemas.map((s) => s["@type"]) });
  return document;
}

async function inspectLocalLinks(page, document) {
  for (const element of document.querySelectorAll("a[href], img[src], script[src], link[rel=stylesheet], source[src], video[poster]")) {
    const attribute = element.localName === "video" ? "poster" : element.localName === "a" || element.localName === "link" ? "href" : "src";
    const raw = element.getAttribute(attribute);
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    let url;
    try { url = new URL(raw, pageUrl(config, page.file)); } catch { failures.push(`${page.file}: invalid resource URL`); continue; }
    if (url.origin !== config.origin) continue;
    const file = decodeURIComponent(url.pathname.slice(1)) || "index.html";
    check(await exists(file), `${page.file}: missing local target ${file}`);
  }
}

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { "User-Agent": "CHICWAY-Site-Audit/1.0", "Cache-Control": "no-cache" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

if (live) {
  // Bound concurrency so a small daily audit does not overwhelm the site.
  const pending = [...indexable];
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (pending.length) {
      const page = pending.shift();
      try { inspect(page, await get(pageUrl(config, page.file))); }
      catch (error) { failures.push(`live:${page.file}: ${error.message}`); }
    }
  }));
} else {
  for (const page of config.pages) {
    const document = inspect(page, await read(page.file));
    await inspectLocalLinks(page, document);
  }
}

try {
  const xml = live ? await get(config.origin + "/sitemap.xml") : await read("sitemap.xml");
  const sitemap = new DOMParser().parseFromString(xml, "text/xml");
  const locations = [...sitemap.querySelectorAll("url > loc")].map((node) => node.textContent);
  check(locations.length === indexable.length && new Set(locations).size === locations.length, "Sitemap URL count or uniqueness mismatch");
  for (const page of indexable) check(locations.includes(pageUrl(config, page.file)), `Sitemap missing ${page.file}`);
  for (const lastmod of sitemap.querySelectorAll("lastmod")) check(/^\d{4}-\d{2}-\d{2}$/.test(lastmod.textContent), "Invalid sitemap lastmod");
  const robots = live ? await get(config.origin + "/robots.txt") : await read("robots.txt");
  check(robots.includes(`Sitemap: ${config.origin}/sitemap.xml`), "robots.txt missing sitemap declaration");
  check(!/^Disallow:\s*\/\s*$/m.test(robots), "robots.txt blocks the whole site");
  const keyFile = config.indexNowKey + ".txt";
  const key = live ? await get(config.origin + "/" + keyFile) : await read(keyFile);
  check(key.trim() === config.indexNowKey, "IndexNow verification file mismatch");
} catch (error) { failures.push(`Discovery files: ${error.message}`); }

const googleVerificationFile = config.integrations.googleSiteVerificationFile;
if (googleVerificationFile) {
  if (!/^google[A-Za-z0-9]+\.html$/.test(googleVerificationFile)) {
    failures.push("Invalid Google verification filename.");
  } else {
    try {
      const verification = live ? await get(config.origin + "/" + googleVerificationFile) : await read(googleVerificationFile);
      check(verification.trim() === "google-site-verification: " + googleVerificationFile, "Google verification file content mismatch.");
    } catch (error) {
      failures.push("Google verification file: " + error.message);
    }
  }
}

if (!config.integrations.ga4MeasurementId) warnings.push("GA4 is not connected. Amazon click event hooks are prepared; no traffic or conversion counts are being collected by this setup.");
if (!config.integrations.googleSiteVerification && !googleVerificationFile) warnings.push("Search Console website verification is not configured. Authenticated reporting access must be checked separately.");
if (!config.integrations.bingSiteVerification) warnings.push("Bing website verification metadata is not configured. Authenticated search and AI reporting must be checked separately.");
const report = {
  checkedAt: new Date().toISOString(), mode: live ? "live" : "local", origin: config.origin,
  status: failures.length ? "failed" : "passed", pagesChecked: checks.length,
  failures, warnings, checks,
  measurements: {
    searchTraffic: config.integrations.searchConsoleSiteUrl ? "requires_authenticated_check" : "not_connected",
    websiteAnalytics: config.integrations.ga4MeasurementId ? "requires_realtime_or_authenticated_check" : "not_connected",
    bingSearchTraffic: config.integrations.bingSiteVerification ? "requires_authenticated_check" : "not_connected",
    aiCitations: config.integrations.bingSiteVerification ? "requires_authenticated_ui_or_export" : "not_connected",
    amazonOrders: "not_connected"
  }
};
await write(`geo/reports/${live ? "live" : "local"}-latest.json`, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report, checks: undefined }, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `## CHICWAY ${report.mode} audit: ${report.status}\n\n${checks.length} pages checked.\n\n${[...failures, ...warnings].map((item) => `- ${item}\n`).join("")}\n`);
}
if (failures.length) process.exitCode = 1;
