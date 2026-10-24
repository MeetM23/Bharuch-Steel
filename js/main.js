/* Shared layout: header, footer, background decorations, parallax,
   scroll reveal and the product card. Every nav item is its own page. */
const LOGO = `<img src="assets/brand/logo.webp" alt="Prism Rail" width="162" height="54" class="brand-logo-img">`;
const LOGO_WHITE = `<img src="assets/brand/logo-white.webp" alt="Prism Rail" width="162" height="54" class="brand-logo-img">`;

const PAGE = document.body.dataset.page || "";
const NAV = [
  { key: "home",         label: "Home",         url: "index.html" },
  { key: "products",     label: "Products",     url: "products.html", menu: true },
  { key: "applications", label: "Applications", url: "applications.html" },
  { key: "finishes",     label: "Finishes",     url: "finishes.html" },
  { key: "about",        label: "About",        url: "about.html" },
  { key: "contact",      label: "Contact",      url: "contact.html" }
];
const activeKey = PAGE === "product" ? "products" : PAGE;

function renderLayout() {
  const c = PRISM.company;

  const menu = `<div class="dd-menu" role="menu">
      <a href="products.html" role="menuitem"><b>All products</b><small>${PRISM.products.length} items</small></a>
      ${PRISM.categories.map(k => `<a href="products.html?cat=${k.id}" role="menuitem"><b>${k.name}</b><small>${PRISM.products.filter(p => p.category === k.id).length} items</small></a>`).join("")}
    </div>`;

  const header = document.getElementById("site-header");
  if (header) header.innerHTML = `
  <header class="nav" id="nav">
    <div class="container nav-in">
      <a class="brand" href="index.html" aria-label="Prism Rail home">${LOGO}</a>
      <nav class="links" id="links" aria-label="Main">
        <span class="nav-pill" id="pill"></span>
        ${NAV.map(n => n.menu
          ? `<div class="dd"><a href="${n.url}" data-s="${n.key}" class="dd-t">${n.label}<svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></a>${menu}</div>`
          : `<a href="${n.url}" data-s="${n.key}">${n.label}</a>`).join("")}
        <a class="btn btn-primary mobile-only" href="contact.html">Get a Quote</a>
      </nav>
      <div class="nav-cta">
        <a class="nav-phone" href="tel:+${c.phoneRaw}" aria-label="Call us"><svg class="icon"><use href="assets/icons/sprite.svg#phone"></use></svg>${c.phone}</a>
        <a class="btn btn-primary" href="contact.html">Get a Quote</a>
        <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const footer = document.getElementById("site-footer");
  if (footer) footer.innerHTML = `
  <footer class="footer">
    <div class="container foot-grid">
      <div>
        <a class="brand brand-light" href="index.html">${LOGO_WHITE}</a>
        <p class="foot-about">${c.tagline}. Manufactured by ${c.legal}, since ${c.established}. ISO 9001:2015 certified.</p>
      </div>
      <div><h4>Products</h4>
        ${PRISM.categories.map(k => `<a href="products.html?cat=${k.id}">${k.name}</a>`).join("")}
      </div>
      <div><h4>Explore</h4>
        ${NAV.map(n => `<a href="${n.url}">${n.label}</a>`).join("")}
        <a href="about.html#faq">FAQ</a>
      </div>
      <div><h4>Contact</h4>
        <p>${c.address}</p>
        <a href="tel:+${c.phoneRaw}">${c.phone}</a>
        <a href="mailto:${c.email}">${c.email}</a>
        <a href="https://${c.web}">${c.web}</a>
      </div>
    </div>
    <div class="container foot-bottom"><span>© ${new Date().getFullYear()} ${c.legal} · Prism Rail®</span><span>ISO 9001:2015 Certified</span></div>
  </footer>`;

  initNav();
}

/* ---------- nav: current page highlight + sliding pill ---------- */
function initNav() {
  const nav = document.getElementById("nav"), burger = document.getElementById("burger"),
        links = document.getElementById("links"), pill = document.getElementById("pill");
  if (!nav) return;
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open); burger.classList.toggle("on", open);
  });

  const items = [...links.querySelectorAll("a[data-s]")];
  const current = items.find(a => a.dataset.s === activeKey);
  if (current) current.classList.add("active");
  const movePill = el => {
    if (!pill || !el || innerWidth <= 820) { pill && pill.classList.remove("show"); return; }
    const lb = links.getBoundingClientRect(), eb = el.getBoundingClientRect();
    pill.style.width = eb.width + "px";
    pill.style.transform = `translateX(${eb.left - lb.left}px)`;
    pill.classList.add("show");
  };
  items.forEach(a => {
    a.addEventListener("mouseenter", () => movePill(a));
    a.addEventListener("focus", () => movePill(a));
  });
  links.addEventListener("mouseleave", () => movePill(current));
  movePill(current);
  addEventListener("resize", () => movePill(current));

  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- product card ---------- */
function productCard(p) {
  const visual = productVisual(p, { thumb: true, dims: false, pad: 6 });
  const hasTurntable = ["pr-08-cp", "pr-19-cp", "pr-21-cp-led", "pr-33-sd"].includes(p.id);
  const ttHtml = hasTurntable ? `<video class="pcard-turntable" muted loop playsinline preload="none"><source src="assets/img/products/turntables/${p.id}.webm" type="video/webm"></video>` : "";
  return `
  <a class="pcard reveal" href="product.html?id=${p.id}" data-id="${p.id}">
    <div class="pcard-img">${visual}${ttHtml}</div>
    <div class="pcard-body">
      <span class="tag">${p.categoryName}</span>
      <h3>${p.code}</h3>
      <p>${p.tagline}</p>
      <span class="pcard-link">View details <i>→</i></span>
    </div>
  </a>`;
}

/* ---------- scroll reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}

/* ---------- background decorations ----------
   Sections opt in with data-deco="hero|a|b|dark".
   3-Layer Photoreal Depth Stack:
     - Far Layer: Architectural CAD blueprint / perspective grid (slowest)
     - Mid Layer: Floating 3D glass panes + real aluminium profiles + separate shadows (sharp)
     - Near Layer: Soft blurred foreground bokeh / caustic refractions / dust motes (fastest)
*/
const DECO = {
  hero: `
    <!-- Far Layer -->
    <div class="deco-bp" style="background-image:url('assets/deco/blueprint-light.svg')"></div>
    <div class="deco-grid-hero" style="background-image:url('assets/deco/perspective-grid.svg')"></div>
    
    <!-- Mid Layer: 3D Floating Glass & Profiles with Separate Shadows -->
    <div class="dp" data-speed="-.14" style="left:clamp(-30px, 1.5vw, 24px);top:16%">
      <div class="deco-obj-wrap deco-tilt">
        <img class="deco-shadow" src="assets/deco/glass-shadow-01.webp" width="260" height="260" alt="" aria-hidden="true" style="top:52px;left:18px">
        <img class="deco-pane" src="assets/deco/glass-pane-01.webp" width="260" height="260" alt="" aria-hidden="true">
      </div>
    </div>
    
    <div class="dp" data-speed=".12" style="right:clamp(-40px, 1.5vw, 30px);top:14%">
      <div class="deco-obj-wrap deco-tilt">
        <img class="deco-profile" src="assets/deco/profile-channel-01-light.webp" width="270" height="216" alt="" aria-hidden="true">
      </div>
    </div>
    
    <div class="dp dp-secondary" data-speed="-.06" style="right:12%;top:34%">
      <img class="deco-glint" src="assets/deco/lens-glint-01.webp" width="380" height="142" alt="" aria-hidden="true">
    </div>
    
    <!-- Near Layer: Soft Blurred Bokeh & Particles -->
    <div class="dp dp-near" data-speed=".22" style="left:-60px;bottom:10%">
      <img class="deco-near-bokeh" src="assets/deco/bokeh-warm-01.webp" width="320" height="266" alt="" aria-hidden="true">
    </div>
    <div class="dp dp-secondary" data-speed="-.20" style="right:4%;bottom:12%">
      <img class="deco-dust" src="assets/deco/dust-particles-01.webp" width="340" height="340" alt="" aria-hidden="true">
    </div>
    <div class="d-spot" id="spot"></div>`,

  a: `
    <!-- Far Layer -->
    <div class="deco-bp" style="background-image:url('assets/deco/blueprint-light.svg')"></div>
    
    <!-- Mid Layer -->
    <div class="dp" data-speed=".14" style="right:clamp(-40px, 1vw, 20px);top:12%">
      <div class="deco-obj-wrap">
        <img class="deco-shadow" src="assets/deco/glass-shadow-03.webp" width="250" height="250" alt="" aria-hidden="true" style="top:44px;left:16px">
        <img class="deco-pane" src="assets/deco/glass-pane-03.webp" width="250" height="250" alt="" aria-hidden="true">
      </div>
    </div>
    
    <div class="dp" data-speed="-.12" style="left:clamp(-30px, 1vw, 16px);bottom:8%">
      <div class="deco-obj-wrap">
        <img class="deco-profile" src="assets/deco/profile-bracket-01-light.webp" width="240" height="192" alt="" aria-hidden="true">
      </div>
    </div>
    
    <!-- Near Layer -->
    <div class="dp dp-near" data-speed="-.18" style="left:8%;top:28%">
      <img class="deco-caustic" src="assets/deco/caustic-teal-01.webp" width="320" height="320" alt="" aria-hidden="true">
    </div>`,

  b: `
    <!-- Far Layer -->
    <div class="deco-bp" style="background-image:url('assets/deco/blueprint-light.svg')"></div>
    
    <!-- Mid Layer -->
    <div class="dp" data-speed="-.12" style="left:clamp(-35px, 1vw, 20px);top:14%">
      <div class="deco-obj-wrap">
        <img class="deco-shadow" src="assets/deco/glass-shadow-04.webp" width="250" height="250" alt="" aria-hidden="true" style="top:42px;left:16px">
        <img class="deco-pane" src="assets/deco/glass-pane-04.webp" width="250" height="250" alt="" aria-hidden="true">
      </div>
    </div>
    
    <div class="dp" data-speed=".12" style="right:clamp(-30px, 1vw, 24px);bottom:10%">
      <div class="deco-obj-wrap">
        <img class="deco-profile" src="assets/deco/profile-handrail-round-01-light.webp" width="240" height="192" alt="" aria-hidden="true">
      </div>
    </div>
    
    <!-- Near Layer -->
    <div class="dp dp-near" data-speed=".20" style="right:6%;top:18%">
      <img class="deco-shaft" src="assets/deco/light-shaft-01.webp" width="300" height="400" alt="" aria-hidden="true">
    </div>`,

  dark: `
    <!-- Video background behind dark contact / CTA -->
    <div class="deco-dark-video-wrap">
      <video class="deco-dark-vid lazy-video" autoplay muted loop playsinline preload="none">
        <source src="assets/video/hero-dark.webm" type="video/webm">
        <source src="assets/video/hero-dark.mp4" type="video/mp4">
      </video>
      <div class="deco-dark-scrim"></div>
    </div>
    
    <!-- Far Layer -->
    <div class="deco-bp dark" style="background-image:url('assets/deco/blueprint-dark.svg')"></div>
    
    <!-- Mid Layer -->
    <div class="dp" data-speed="-.12" style="left:clamp(-30px, 1.5vw, 24px);bottom:12%">
      <div class="deco-obj-wrap">
        <img class="deco-shadow" src="assets/deco/glass-shadow-05.webp" width="250" height="250" alt="" aria-hidden="true" style="top:44px;left:16px">
        <img class="deco-pane" src="assets/deco/glass-pane-05.webp" width="250" height="250" alt="" aria-hidden="true">
      </div>
    </div>
    
    <div class="dp" data-speed=".14" style="right:clamp(-30px, 1.5vw, 24px);top:16%">
      <div class="deco-obj-wrap">
        <img class="deco-profile" src="assets/deco/profile-channel-01-dark.webp" width="250" height="200" alt="" aria-hidden="true">
      </div>
    </div>
    
    <!-- Near Layer -->
    <div class="dp dp-near" data-speed="-.20" style="right:10%;bottom:8%">
      <img class="deco-caustic" src="assets/deco/caustic-teal-01.webp" width="320" height="320" alt="" aria-hidden="true">
    </div>`
};

function initDeco() {
  document.querySelectorAll("[data-deco]").forEach(sec => {
    const d = document.createElement("div");
    d.className = "deco"; d.setAttribute("aria-hidden", "true");
    d.innerHTML = DECO[sec.dataset.deco] || "";
    sec.prepend(d);
  });

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = matchMedia("(pointer: fine)").matches;

  // Parallax scroll for .dp elements
  const items = [...document.querySelectorAll(".dp[data-speed]")];
  if (items.length && !prefersReduced) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      items.forEach(el => {
        const pSec = el.closest("[data-deco]");
        if (!pSec) return;
        const r = pSec.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update); update();
  }

  // Hero subtle mouse-parallax tilt (max 6px) + soft spotlight
  const heroSec = document.querySelector(".hero[data-deco]");
  const tiltEls = document.querySelectorAll(".hero .deco-tilt");
  const spot = document.getElementById("spot");

  if (heroSec && isFinePointer && !prefersReduced) {
    heroSec.addEventListener("pointermove", e => {
      const b = heroSec.getBoundingClientRect();
      const nx = ((e.clientX - b.left) / b.width - 0.5) * 2; // -1 to 1
      const ny = ((e.clientY - b.top) / b.height - 0.5) * 2; // -1 to 1
      const tx = (nx * 6).toFixed(1);
      const ty = (ny * 6).toFixed(1);

      tiltEls.forEach(el => {
        el.style.transform = `translate3d(${tx}px,${ty}px,0) rotate(${nx.toFixed(1)}deg)`;
      });

      if (spot) {
        spot.style.setProperty("--mx", (e.clientX - b.left) + "px");
        spot.style.setProperty("--my", (e.clientY - b.top) + "px");
        spot.style.opacity = 1;
      }
    });

    heroSec.addEventListener("pointerleave", () => {
      tiltEls.forEach(el => { el.style.transform = "translate3d(0,0,0) rotate(0deg)"; });
      if (spot) spot.style.opacity = 0;
    });
  }

  // IntersectionObserver for lazy videos (header videos & dark section video)
  const vids = document.querySelectorAll("video.lazy-video, video.phead-vid, video.deco-dark-vid");
  if (vids.length && "IntersectionObserver" in window) {
    const vIo = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.1 });
    vids.forEach(v => vIo.observe(v));
  }

  // Hover turntable loop trigger for product cards
  document.addEventListener("pointerover", e => {
    const card = e.target.closest(".pcard");
    if (card) {
      const vid = card.querySelector(".pcard-turntable");
      if (vid && vid.paused) vid.play().catch(() => {});
    }
  });
  document.addEventListener("pointerout", e => {
    const card = e.target.closest(".pcard");
    if (card) {
      const vid = card.querySelector(".pcard-turntable");
      if (vid && !vid.paused) vid.pause();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => { renderLayout(); initDeco(); initReveal(); });
