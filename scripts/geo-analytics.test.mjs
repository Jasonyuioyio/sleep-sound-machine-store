import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { parseHTML } from "linkedom";
import { loadSite, read } from "./geo-lib.mjs";

const { config } = await loadSite();
const measurementId = config.integrations.ga4MeasurementId;

for (const page of config.pages) {
  test(`${page.file}: analytics is scoped to production`, { skip: !measurementId }, async () => {
    const { document } = parseHTML(await read(page.file));
    const scripts = [...document.querySelectorAll("head script")];
    const guards = document.querySelectorAll("script[data-analytics-scope]");
    assert.equal(guards.length, 1);
    const guard = guards[0];
    const googleTag = scripts.find(script => script.getAttribute("src") === `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
    const initializer = scripts.find(script => script.textContent.includes(`gtag('config','${measurementId}')`));
    assert.ok(googleTag && initializer);
    assert.ok(scripts.indexOf(guard) < scripts.indexOf(googleTag));
    assert.ok(scripts.indexOf(guard) < scripts.indexOf(initializer));

    const disableKey = `ga-disable-${measurementId}`;
    const runGuard = (origin, alreadyDisabled = false) => {
      const window = { location: { origin } };
      if (alreadyDisabled) window[disableKey] = true;
      runInNewContext(guard.textContent, { window }, { timeout: 1000 });
      return window[disableKey];
    };

    assert.equal(runGuard(config.origin), undefined, "production collection must remain enabled");
    assert.equal(runGuard(config.origin, true), true, "preserve an existing analytics opt-out");
    for (const origin of ["http://127.0.0.1:4173", "http://localhost:4173", "http://[::1]:4173", "null", "https://preview.invalid"]) {
      assert.equal(runGuard(origin), true, `disable collection on ${origin}`);
    }
  });
}
