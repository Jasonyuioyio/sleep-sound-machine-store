import { loadSite, pageUrl } from "./geo-lib.mjs";

const { config } = await loadSite();
const requested = process.argv.slice(2);
const pages = config.pages.filter((page) => page.indexable !== false);
for (const file of requested) {
  if (!pages.some((page) => page.file === file)) throw new Error(`Not an approved indexable page: ${file}`);
}
const urlList = pages.filter((page) => !requested.length || requested.includes(page.file)).map((page) => pageUrl(config, page.file));
const keyLocation = `${config.origin}/${config.indexNowKey}.txt`;
const verification = await fetch(keyLocation, { signal: AbortSignal.timeout(25000) });
if (!verification.ok || (await verification.text()).trim() !== config.indexNowKey) {
  throw new Error("The IndexNow verification file must be live before submitting URLs.");
}
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", signal: AbortSignal.timeout(25000),
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(config.origin).hostname, key: config.indexNowKey, keyLocation, urlList })
});
if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned HTTP ${response.status}`);
console.log(JSON.stringify({ status: response.status, urlsSubmitted: urlList.length, meaning: response.status === 202 ? "URLs received; key validation pending. Indexing is not confirmed." : "URLs received. Indexing is not confirmed." }, null, 2));
