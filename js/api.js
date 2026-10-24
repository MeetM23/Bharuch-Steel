/* ------------------------------------------------------------------
   Data access layer. Today it reads js/data.js.
   When the PHP/MySQL admin is ready, only this file changes:
     getProducts()  -> fetch('api/products.php')
     getProduct(id) -> fetch('api/product.php?id=' + id)
     submitQuote()  -> POST api/quote.php
   Every page already awaits these calls.
   ------------------------------------------------------------------ */
const API = {
  async getCategories() {
    return PRISM.categories;
  },
  async getProducts() {
    return PRISM.products;
  },
  async getProduct(id) {
    return PRISM.products.find(p => p.id === id) || null;
  },
  async submitQuote(payload) {
    // TODO (backend phase): return fetch('api/quote.php', {method:'POST', body: JSON.stringify(payload)})
    const key = "prism_quote_requests";
    let list = [];
    try { list = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) {}
    list.push(Object.assign({ createdAt: new Date().toISOString() }, payload));
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) {}
    return { ok: true };
  }
};
