(() => {
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    let destination;
    try { destination = new URL(link.href); } catch { return; }
    if (!["amazon.com", "www.amazon.com"].includes(destination.hostname)) return;
    const detail = {
      asin: destination.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1] || "",
      product_id: link.dataset.productId || document.querySelector("[data-product-detail]")?.dataset.productId || "",
      option: link.textContent.trim().slice(0, 80),
      page_path: window.location.pathname
    };
    document.dispatchEvent(new CustomEvent("chicway:amazon-click", { detail }));
    if (typeof window.gtag === "function") window.gtag("event", "amazon_outbound_click", detail);
  });
})();
