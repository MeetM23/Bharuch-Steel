/* ------------------------------------------------------------------
   Prism Rail product renderer.
   Draws every product from its REAL dimensions (spec.baseWidth,
   overallHeight, glassDepth, shape) as:
     - a 3D extruded view  (render3D)
     - a dimensioned cross-section drawing (profileSVG)
   Used whenever a product has no uploaded photo, so a new product
   created in the admin gets an accurate visual automatically.
   ------------------------------------------------------------------ */

/* axonometric projection: x = profile width, y = height, z = run length */
const VX = [0.55, 0.28], VZ = [0.93, -0.18];
/* direction toward the viewer, expressed in profile (x,y) space – for back-face culling */
const VIEW = [VZ[0] / VX[0], (VZ[0] / VX[0]) * VX[1] - VZ[1]];
const pj = (x, y, z) => [x * VX[0] + z * VZ[0], -y + x * VX[1] + z * VZ[1]];
const f1 = n => Math.round(n * 10) / 10;
const ptsStr = a => a.map(q => f1(q[0]) + "," + f1(q[1])).join(" ");

function mixHex(a, b, t) {
  const c = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = c(a), B = c(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

/* ---------- outlines (CCW, x right, y up, in mm) ---------- */
function outlineFor(p) {
  const sp = p.spec;
  const w = Math.max(sp.baseWidth, 30), h = Math.max(sp.overallHeight, 44);
  const slotW = w < 40 ? 13 : 16;
  const arch = p.shape === "arch", taper = p.shape === "taper";
  const cx = arch ? w * 0.58 : w / 2;
  const sx1 = cx - slotW / 2, sx2 = cx + slotW / 2;
  const d = Math.min(Math.max(sp.glassDepth, 28), h - 8);
  const c = Math.min(4, w / 10), ins = Math.min(w * 0.18, 14);
  const pts = [[0, 0], [w, 0]];
  if (taper) pts.push([w - ins, h]); else pts.push([w, h - c], [w - c, h]);
  pts.push([sx2, h], [sx2, h - d], [sx1, h - d], [sx1, h]);
  if (arch) {
    const P0 = [sx1, h], P1 = [w * 0.1, h], P2 = [0, h * 0.55], P3 = [0, 0];
    for (let i = 1; i < 10; i++) {
      const t = i / 10, u = 1 - t;
      pts.push([u*u*u*P0[0] + 3*u*u*t*P1[0] + 3*u*t*t*P2[0] + t*t*t*P3[0],
                u*u*u*P0[1] + 3*u*u*t*P1[1] + 3*u*t*t*P2[1] + t*t*t*P3[1]]);
    }
  } else if (taper) pts.push([ins, h]);
  else pts.push([c, h], [0, h - c]);
  return { pts, w, h, d, cx, sx1, sx2, T: 12, floor: h - d, slot: true };
}

function railOutline(p) {
  const m = p.code.match(/-\s*(\d+)/), n = m ? m[1] : "4040";
  let W, H;
  if (n.length <= 2) { W = H = +n; } else { W = +n.slice(0, n.length - 2); H = +n.slice(-2); }
  W = Math.max(W, 20); H = Math.max(H, 17);
  const pts = [];
  if (p.shape === "round") {
    for (let k = 0; k < 56; k++) { const th = -Math.PI / 2 + 2 * Math.PI * k / 56; pts.push([W / 2 + W / 2 * Math.cos(th), H / 2 + H / 2 * Math.sin(th)]); }
  } else {
    const r = Math.min(5, H / 4);
    pts.push([r, 0], [W - r, 0], [W, r], [W, H - r], [W - r, H], [r, H], [0, H - r], [0, r]);
  }
  return { pts, w: W, h: H, cx: W / 2, T: 12, slot: false, smooth: p.shape === "round" };
}

/* ---------- 3D render ---------- */
function render3D(p, opts) {
  opts = opts || {};
  const isRail = p.category === "handrail";
  const isWall = p.id === "pr-34-sd";
  const isSide = p.category === "side" && !isWall;
  const isBracket = p.category === "bracket";
  const L = 230;
  const all = [];
  const P = (x, y, z) => { const q = pj(x, y, z); all.push(q); return q; };
  let layers = [];
  const out = s => layers.push(s);
  const poly = (pts, attrs) => out(`<polygon points="${ptsStr(pts)}" ${attrs}/>`);

  const segs = (isBracket || isWall) ? [[150, 200], [14, 64]] : [[0, L]];   // far first
  const cap = "url(#capg)";

  /* floor + shadow */
  const o = isRail ? railOutline(p) : (isWall ? { w: 68, h: 76, cx: 34, T: 12 } : outlineFor(p));
  const yBase = isRail ? 78 : 0;
  /* floor + shadow are decoration: projected without widening the fit box */
  const fl = [pj(-70, 0, -40), pj(o.w + 90, 0, -40), pj(o.w + 90, 0, L + 60), pj(-70, 0, L + 60)];
  if (!isRail) {
    poly(fl, `fill="url(#floorg)"`);
    poly([pj(-6, 0, -8), pj(o.w + 8, 0, -8), pj(o.w + 18, 0, L + 18), pj(-2, 0, L + 18)].map(q => [q[0] - 14, q[1] + 8]), `fill="rgba(10,50,70,.30)" filter="url(#blur6)"`);
  }

  /* generic extruded outline */
  function faces(ol, z0, z1, yOff, colors) {
    const n = ol.pts.length, res = [];
    for (let i = 0; i < n; i++) {
      const a = ol.pts[i], b = ol.pts[(i + 1) % n];
      let nx = b[1] - a[1], ny = -(b[0] - a[0]);
      const len = Math.hypot(nx, ny); if (len < 1e-6) continue;
      nx /= len; ny /= len;
      if (nx * VIEW[0] + ny * VIEW[1] < 0.02) continue;                  // back-facing
      const inSlot = ol.slot && a[0] >= ol.sx1 - .01 && a[0] <= ol.sx2 + .01 && b[0] >= ol.sx1 - .01 && b[0] <= ol.sx2 + .01 && Math.min(a[1], b[1]) < ol.h - .01;
      const t = Math.max(0, ny) / (Math.max(0, ny) + Math.max(0, nx) + 1e-9);
      let col = mixHex(colors[0], colors[1], t);
      if (inSlot) col = mixHex(col, "#222a30", .72);
      const q = [P(a[0], a[1] + yOff, z0), P(b[0], b[1] + yOff, z0), P(b[0], b[1] + yOff, z1), P(a[0], a[1] + yOff, z1)];
      res.push({ cx: (a[0] + b[0]) / 2, cy: (a[1] + b[1]) / 2, svg:
        `<polygon points="${ptsStr(q)}" fill="${col}" ${ol.smooth ? `stroke="${col}" stroke-width=".8"` : `stroke="rgba(70,84,94,.55)" stroke-width=".5"`} stroke-linejoin="round"/>` +
        (inSlot ? "" : `<polygon points="${ptsStr(q)}" fill="url(#sheen)"/>`) });
    }
    return res.sort((A, B) => A.cx - B.cx || A.cy - B.cy);
  }
  const metal = ["#a9b4bd", "#f2f5f7"];
  const capPoly = (ol, z0, yOff) => {
    const q = ol.pts.map(a => P(a[0], a[1] + yOff, z0));
    return `<polygon points="${ptsStr(q)}" fill="${cap}" stroke="rgba(70,84,94,.7)" stroke-width=".7" stroke-linejoin="round"/>`;
  };
  const box = (x0, x1, y0, y1, z0, z1, c) => {
    out(`<polygon points="${ptsStr([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)])}" fill="${c[0]}" stroke="rgba(70,84,94,.4)" stroke-width=".5"/>`);
    out(`<polygon points="${ptsStr([P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0)])}" fill="${c[1]}" stroke="rgba(70,84,94,.4)" stroke-width=".5"/>`);
    out(`<polygon points="${ptsStr([P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)])}" fill="${c[2]}" stroke="rgba(70,84,94,.4)" stroke-width=".5"/>`);
  };
  const concrete = ["#e4e7e9", "#c3c9cd", "#aab1b6"];

  /* glass geometry */
  const T = 12, gx0 = o.cx - T / 2, gx1 = o.cx + T / 2;
  let gy0, gy1;
  if (isRail) { gy0 = 0; gy1 = yBase + 4; }
  else if (isWall) { gy0 = 0; gy1 = 0; }
  else { gy0 = o.floor + 3; gy1 = o.h + 96; }
  const glassFace = () => {
    const face = [P(gx1, gy0, 0), P(gx1, gy0, L), P(gx1, gy1, L), P(gx1, gy1, 0)];
    out(`<polygon points="${ptsStr(face)}" fill="url(#${isRail ? "glassR" : "glassF"})" stroke="rgba(60,185,210,.65)" stroke-width=".9"/>`);
        // diagonal reflections
    const st = (za, zb, sk) => [P(gx1, gy0, za), P(gx1, gy0, zb), P(gx1, gy1, zb + sk), P(gx1, gy1, za + sk)];
    out(`<polygon points="${ptsStr(st(L * .18, L * .27, 40))}" fill="#fff" opacity=".38"/>`);
    out(`<polygon points="${ptsStr(st(L * .34, L * .38, 40))}" fill="#fff" opacity=".28"/>`);
    out(`<polygon points="${ptsStr(st(L * .66, L * .78, 40))}" fill="#fff" opacity=".22"/>`);
    // top (or bottom) thin edge + cap
    const edgeY = isRail ? gy0 : gy1;
    out(`<polygon points="${ptsStr([P(gx0, edgeY, 0), P(gx1, edgeY, 0), P(gx1, edgeY, L), P(gx0, edgeY, L)])}" fill="#d9f4fa" opacity=".9"/>`);
    out(`<polygon points="${ptsStr([P(gx0, gy0, 0), P(gx1, gy0, 0), P(gx1, gy1, 0), P(gx0, gy1, 0)])}" fill="#7fd3e4" stroke="#37b4cd" stroke-width=".8"/>`);
  };

  if (isRail) {
    glassFace();
    const fcs = faces(o, 0, L, yBase, metal);
    fcs.forEach(F => out(F.svg));
    out(capPoly(o, 0, yBase));
    if (p.shape === "led" || /LED/.test(p.code)) {
      out(`<polygon points="${ptsStr([P(gx1 + .4, yBase - 2, 0), P(gx1 + .4, yBase - 2, L), P(gx1 + .4, yBase - 34, L), P(gx1 + .4, yBase - 34, 0)])}" fill="url(#ledglow)"/>`);
      out(`<polygon points="${ptsStr([P(gx1 + .5, yBase - 1, 4), P(gx1 + .5, yBase - 1, L - 4), P(gx1 + .5, yBase - 4, L - 4), P(gx1 + .5, yBase - 4, 4)])}" fill="#ffe3a0"/>`);
    }
  } else if (isWall) {
    box(-44, 0, -30, 112, -12, L + 12, concrete);
    segs.forEach(s => box(0, 30, 44, 78, s[0], s[1], ["#f1f4f6", "#b4bec6", "#9aa5ad"]));
    box(30, 70, 44, 78, 0, L, ["#f4f7f8", "#aeb9c1", "#98a3ab"]);
  } else {
    if (isSide) box(-52, 0, -40, o.h, -12, L + 12, concrete);
    const pre = [], post = [];
    segs.forEach(s => faces(o, s[0], s[1], 0, metal).forEach(F => (F.cx <= o.cx + .01 ? pre : post).push({ s, F })));
    pre.forEach(r => out(r.F.svg));
    // gasket strip (left of glass)
    segs.forEach(s => poly([P(o.sx1, o.h, s[0]), P(gx0, o.h, s[0]), P(gx0, o.h, s[1]), P(o.sx1, o.h, s[1])], `fill="#1e2429"`));
    glassFace();
    segs.forEach(s => poly([P(gx1, o.h, s[0]), P(o.sx2, o.h, s[0]), P(o.sx2, o.h, s[1]), P(gx1, o.h, s[1])], `fill="#1e2429"`));
    // post faces + caps, far segment first
    segs.forEach(s => {
      post.filter(r => r.s === s).forEach(r => out(r.F.svg));
      out(capPoly(o, s[0], 0));
      // glass sitting in the cap slot
      out(`<polygon points="${ptsStr([P(gx0, gy0, s[0]), P(gx1, gy0, s[0]), P(gx1, o.h + 0.5, s[0]), P(gx0, o.h + 0.5, s[0])])}" fill="#7fd3e4" stroke="#37b4cd" stroke-width=".6"/>`);
    });
    // continuous profiles: redraw glass cap on top of the one cap
  }

  /* fit to viewBox */
  const VW = 400, VH = 330, pad = opts.pad == null ? 26 : opts.pad;
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  all.forEach(q => { minX = Math.min(minX, q[0]); maxX = Math.max(maxX, q[0]); minY = Math.min(minY, q[1]); maxY = Math.max(maxY, q[1]); });
  const bw = maxX - minX, bh = maxY - minY;
  const k = Math.min((VW - pad * 2) / bw, (VH - pad * 2) / bh);
  const tx = (VW - bw * k) / 2 - minX * k, ty = (VH - bh * k) / 2 - minY * k;

  return `<svg class="vis" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${p.code} 3D view" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sheen" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".25" stop-color="#fff" stop-opacity=".42"/><stop offset=".5" stop-color="#fff" stop-opacity=".0"/><stop offset=".82" stop-color="#fff" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity=".0"/></linearGradient>
    <linearGradient id="capg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d3dadf"/><stop offset="1" stop-color="#8996a0"/></linearGradient>
    <linearGradient id="glassF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5ccbe0" stop-opacity=".62"/><stop offset=".55" stop-color="#a9e6f1" stop-opacity=".42"/><stop offset="1" stop-color="#e6f9fc" stop-opacity="0"/></linearGradient>
    <linearGradient id="glassR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ccbe0" stop-opacity=".6"/><stop offset=".6" stop-color="#a9e6f1" stop-opacity=".4"/><stop offset="1" stop-color="#e6f9fc" stop-opacity="0"/></linearGradient>
    <radialGradient id="floorg" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#d7eff5" stop-opacity="0"/></radialGradient>
    <linearGradient id="ledglow" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb84a" stop-opacity=".0"/><stop offset="1" stop-color="#ffd37a" stop-opacity=".85"/></linearGradient>
    <filter id="blur6" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <g transform="translate(${f1(tx)} ${f1(ty)}) scale(${k.toFixed(4)})">${layers.join("")}</g>
</svg>`;
}

/* ---------- dimensioned cross-section ---------- */
function profileSVG(p, opts) {
  opts = opts || {};
  const dims = opts.dims !== false;
  const W = 400, H = 330, cx = 200, yb = 250;
  const isRail = p.category === "handrail";
  const o = isRail ? railOutline(p) : (p.spec.glassMin === 0 ? { pts: [[0, 0], [40, 0], [40, 30], [0, 30]], w: 40, h: 30, cx: 20, T: 0, slot: false } : outlineFor(p));
  const fit = isRail ? 2.6 : Math.min(2.6, 165 / o.h, 230 / o.w);
  const s = fit;
  const X = x => cx - o.w * s / 2 + x * s;
  const Y = isRail ? (y => 64 + (o.h - y) * s) : (y => yb - y * s);
  const T = (o.T || 0) * s;
  const gx0 = cx - T / 2;
  const body = o.pts.map(a => f1(X(a[0])) + "," + f1(Y(a[1]))).join(" ");
  let svg = `<svg class="vis" viewBox="0 0 ${W} ${H}" role="img" aria-label="${p.code} cross-section" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="xs${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9edf0"/><stop offset=".5" stop-color="#c3ccd2"/><stop offset="1" stop-color="#97a3ac"/></linearGradient>
    <linearGradient id="xg${p.id}" x1="0" x2="1"><stop offset="0" stop-color="#8fdcea"/><stop offset="1" stop-color="#c8f0f7"/></linearGradient>
    <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#b9c1c6" stroke-width="1"/></pattern>
  </defs>`;
  if (!isRail) {
    svg += `<rect x="20" y="${yb}" width="${W - 40}" height="26" fill="#eef1f3"/><rect x="20" y="${yb}" width="${W - 40}" height="26" fill="url(#hatch)" opacity=".8"/><line x1="20" y1="${yb}" x2="${W - 20}" y2="${yb}" stroke="#7d8890" stroke-width="1.4"/>`;
    svg += `<rect x="${cx - 4}" y="${yb}" width="8" height="22" fill="#6b757d"/><rect x="${cx - 9}" y="${yb + 22}" width="18" height="4" fill="#59626a"/>`;
  }
  // glass
  if (o.T) {
    const top = isRail ? Y(0) : Y(o.h) - 44;
    const bot = isRail ? yb : Y(o.floor);
    svg += `<rect x="${f1(gx0)}" y="${f1(top)}" width="${f1(T)}" height="${f1(bot - top)}" fill="url(#xg${p.id})" stroke="#2fb0c9" stroke-width="1.2"/>`;
    svg += `<rect x="${f1(gx0 + 1.5)}" y="${f1(top)}" width="1.6" height="${f1(bot - top)}" fill="#fff" opacity=".7"/>`;
  }
  svg += `<polygon points="${body}" fill="url(#xs${p.id})" stroke="#5f6b74" stroke-width="1.3" stroke-linejoin="round"/>`;
  if (o.slot) {
    // gasket
    svg += `<rect x="${f1(X(o.sx1))}" y="${f1(Y(o.h))}" width="${f1(X(o.cx - o.T / 2) - X(o.sx1))}" height="${f1((o.h - o.floor) * s - 2)}" fill="#20272c"/>`;
    svg += `<rect x="${f1(X(o.cx + o.T / 2))}" y="${f1(Y(o.h))}" width="${f1(X(o.sx2) - X(o.cx + o.T / 2))}" height="${f1((o.h - o.floor) * s - 2)}" fill="#20272c"/>`;
    svg += `<rect x="${f1(gx0)}" y="${f1(Y(o.h) - 44)}" width="${f1(T)}" height="${f1(44 + (o.h - o.floor) * s - 2)}" fill="url(#xg${p.id})" stroke="#2fb0c9" stroke-width="1.2"/>`;
    // bolt hole
    svg += `<circle cx="${cx}" cy="${f1(Y(o.floor / 2))}" r="${f1(Math.min(5, o.w * s / 14))}" fill="none" stroke="#6f7a83" stroke-width="1.2" stroke-dasharray="3 2"/>`;
  }

  if (dims) {
    const x1 = X(o.w) + 22;
    const yT = Y(o.h), yB = Y(0), dy = isRail ? -24 : 0;   // rail: width dimension sits above the rail
    svg += `<g stroke="#8d99a1" stroke-width="1" fill="none">
      <path d="M${f1(x1)} ${f1(yT)} V${f1(yB)} M${f1(x1 - 5)} ${f1(yT)} H${f1(x1 + 5)} M${f1(x1 - 5)} ${f1(yB)} H${f1(x1 + 5)}"/>
      <path d="M${f1(X(0))} ${f1(yB + 38 + dy)} H${f1(X(o.w))} M${f1(X(0))} ${f1(yB + 33 + dy)} V${f1(yB + 43 + dy)} M${f1(X(o.w))} ${f1(yB + 33 + dy)} V${f1(yB + 43 + dy)}"/>
      <path d="M${f1(X(0) - 8)} ${f1(yT)} H${f1(X(0) - 18)}" stroke-dasharray="2 2"/>
    </g>
    <g font-family="Inter,Arial,sans-serif" font-size="12" font-weight="600" fill="#3c464d">
      <text x="${f1(x1 + 9)}" y="${f1((yT + yB) / 2 + 4)}">${o.slot ? p.spec.overallHeight : Math.round(o.h)}</text>
      <text x="${cx}" y="${f1(yB + 58 + dy)}" text-anchor="middle">${o.slot ? p.spec.baseWidth : Math.round(o.w)} mm</text>`;
    if (o.slot) svg += `<text x="${f1(X(o.sx1) - 10)}" y="${f1(Y(o.h) - 36)}" text-anchor="end" fill="#1b8ba3">12 mm glass</text>`;
    svg += `</g>`;
    if (o.slot) {
      svg += `<g stroke="#2fb0c9" stroke-width="1" fill="none"><path d="M${f1(X(0) - 22)} ${f1(Y(o.h))} V${f1(Y(o.floor))} M${f1(X(0) - 27)} ${f1(Y(o.h))} H${f1(X(0) - 17)} M${f1(X(0) - 27)} ${f1(Y(o.floor))} H${f1(X(0) - 17)}"/></g>
      <text x="${f1(X(0) - 32)}" y="${f1((Y(o.h) + Y(o.floor)) / 2 + 4)}" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="600" fill="#1b8ba3">${p.spec.glassDepth}</text>`;
    }
  }
  return svg + "</svg>";
}

/* Returns an uploaded photo if the admin set one, else the drawn render.
   opts.view: "3d" (default) or "section" */
function productVisual(p, opts) {
  opts = opts || {};
  if (opts.view !== "section") {
    const src = opts.thumb ? (p.thumb || p.image) : p.image;
    if (src) return `<img src="${src}" alt="Prism Rail ${p.code} ${p.categoryName}" loading="lazy">`;
    return render3D(p, opts);
  }
  return profileSVG(p, opts);
}
