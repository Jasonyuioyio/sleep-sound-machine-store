import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const read = (file) => readFile(resolve(root, file), "utf8");
export const write = async (file, value) => {
  const target = resolve(root, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, value, "utf8");
};
export const escape = (value) => String(value)
  .replaceAll("&", "&amp;").replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
export const pageUrl = (config, file) => new URL(file === "index.html" ? "/" : file, config.origin + "/").href;

export async function loadSite() {
  const config = JSON.parse(await read("geo/config.json"));
  if (new URL(config.origin).protocol !== "https:") throw new Error("Site origin must use HTTPS.");
  const context = { document: { addEventListener() {} } };
  // Reuse the storefront's pure renderers without running browser event handlers.
  runInNewContext(await read("shop.js") + "\n;globalThis.storefront = { PRODUCTS, productCard, productDetailMarkup };", context, { timeout: 1000 });
  return { config, ...context.storefront, products: context.storefront.PRODUCTS.filter((p) => p.showInCatalog !== false) };
}

export function replaceBlock(source, name, content) {
  const start = `<!-- GEO:${name} -->`;
  const end = `<!-- /GEO:${name} -->`;
  const left = source.indexOf(start);
  const right = source.indexOf(end, left);
  if (left < 0 || right < 0) throw new Error(`Missing generated block: ${name}`);
  return source.slice(0, left) + start + "\n" + content + "\n  " + source.slice(right);
}
