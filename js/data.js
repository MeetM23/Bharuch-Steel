/* ------------------------------------------------------------------
   Prism Rail – static product data (front-end phase).
   Each product matches the future MySQL `products` table 1:1, so the
   admin panel (PHP) can later return the same shape as JSON.
   ------------------------------------------------------------------ */
window.PRISM = {
  company: {
    brand: "Prism Rail",
    legal: "Shreenath Enterprise",
    tagline: "Aluminium & SS Glass Railing Systems & Accessories",
    address: "Atlas Ind. Area, Plot No. 40, Nr. Maldhari Railway Crossing, Opp. Krishna Park Hotel, Gondal Road, NH 27, Kotharia, Dist. Rajkot (Gujarat) India.",
    email: "prismrail.rajkot@gmail.com",
    phone: "+91 92744 13233",
    phoneRaw: "919274413233",
    web: "www.prismrail.com",
    established: 2017
  },

  categories: [
    { id: "bracket-cover", name: "Bracket with Cover", blurb: "Top-mounted brackets hidden under a clean cover profile." },
    { id: "continuous",    name: "Continuous Profile", blurb: "Full-length base channel for the cleanest, strongest line." },
    { id: "bracket",       name: "Bracket Profile",    blurb: "Compact individual brackets – budget friendly and quick to fit." },
    { id: "side",          name: "Side Mount & Wall",  blurb: "Fascia-mounted systems and wall handrails." },
    { id: "handrail",      name: "Hand Rails",         blurb: "Top rails in round, square and designer sections." }
  ],

  finishes: ["Anodised", "Wooden finish", "Powder coating (any RAL shade)"],

  products: []
};

(function () {
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // P(code, category, shape, tagline, spec, extra)
  function P(code, category, shape, tagline, spec, extra) {
    extra = extra || {};
    const cat = PRISM.categories.find(c => c.id === category);
    const mount = {
      "bracket-cover": "Top mounted · bolted brackets hidden by a cover profile",
      "continuous": "Top mounted · continuous aluminium base profile",
      "bracket": "Top mounted · individual aluminium brackets",
      "side": "Side (fascia) mounted"
    }[category];
    const glass = spec.glassMax ? spec.glassMin + "–" + spec.glassMax + " mm" : spec.glassMin + " mm";
    const h = spec.heightMax ? spec.heightMin + "–" + spec.heightMax + " mm" : spec.heightMin + " mm";
    PRISM.products.push({
      id: slug(code),
      code: code,
      name: code,
      category: category,
      categoryName: cat.name,
      shape: shape,
      tagline: tagline,
      description: extra.description ||
        ("Prism Rail " + code + " is a " + cat.name.toLowerCase() + " glass railing system. " + tagline +
         " Compatible with " + glass + " toughened glass up to " + h + " height."),
      image: extra.image || "",
      thumb: extra.thumb || "",
      featured: !!extra.featured,
      features: extra.features || [],
      applications: extra.applications || ["Balconies", "Terraces", "Staircases", "Swimming pools"],
      accessories: extra.accessories || [],
      spec: {
        mounting: mount,
        glassThickness: glass,
        railHeight: h,
        baseWidth: spec.w,
        overallHeight: spec.H,
        glassDepth: spec.d,
        length: spec.length || "",
        fixing: spec.fixing || "",
        locking: spec.locking || "",
        glassMin: spec.glassMin
      },
      finishes: PRISM.finishes
    });
  }

  const BRC  = ["Bracket (BRC)", "Cover (CV)", "End cap – bottom", "End cap – slotted"];
  const CP   = ["Profile (CP)", "End cap – bottom", "End cap – slotted"];
  const BOLT = "Bolts at every 18 inches";

  // ---- Bracket with Cover ----
  P("PR 01 BRC", "bracket-cover", "taper", "Top-mounted system with brackets anchored by bolts and hidden under a cover profile.",
    { glassMin: 12, heightMin: 900, w: 67, H: 103, d: 64, fixing: "Anchored with bolts" },
    { featured: true, accessories: BRC, features: ["Cover in anodise, wooden or any powder-coat shade", "Clean, bracket-free look"] });
  P("PR 02 BRC", "bracket-cover", "taper", "Top-mounted system with a broader base and wider glass tolerance.",
    { glassMin: 12, glassMax: 13.5, heightMin: 900, w: 84, H: 110, d: 100, fixing: "Anchored with bolts" },
    { accessories: BRC, features: ["Takes 12 to 13.5 mm glass", "Cover in any finish"] });
  P("PR 03 BRC", "bracket-cover", "rect", "Compact top-mounted bracket system for lower railings.",
    { glassMin: 12, heightMin: 750, heightMax: 800, w: 69, H: 83, d: 70, fixing: "Anchored with bolts" },
    { accessories: BRC, features: ["Ideal for 750–800 mm railings", "Cover in any finish"] });
  P("PR 04 BRC", "bracket-cover", "rect", "Cover designed with a slope on the upper edge so it stays dust free.",
    { glassMin: 12, heightMin: 750, heightMax: 800, w: 54, H: 90, d: 81, fixing: "Anchored with bolts" },
    { accessories: BRC, features: ["Sloped upper edge – dust free", "Slim 54 mm footprint"] });
  P("PR 05 BRC", "bracket-cover", "rect", "Frameless heavy design with high strength for tall glass.",
    { glassMin: 12, glassMax: 14, heightMin: 1200, w: 89, H: 146, d: 123, fixing: "Anchored with bolts" },
    { featured: true, accessories: BRC, features: ["Up to 1200 mm glass height", "Frameless, heavy-duty section"], applications: ["Malls", "High-rise balconies", "Commercial atriums", "Staircases"] });
  P("PR 06 BRC", "bracket-cover", "taper", "Arrow dynamic design that gives the railing high strength.",
    { glassMin: 12, heightMin: 1000, w: 63, H: 123, d: 104, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRC)", "Cover (CV)"], features: ["Arrow dynamic profile", "High strength"] });
  P("PR 07 BRC", "bracket-cover", "arch", "Rounded top-mounted system with covered brackets.",
    { glassMin: 12, heightMin: 1000, w: 90, H: 115, d: 91, fixing: "Anchored with bolts" },
    { accessories: BRC, features: ["Rounded cover profile", "Cover in any finish"] });

  // ---- Continuous Profile ----
  P("PR 08 CP", "continuous", "arch", "Continuous aluminium profile – widely used all over India and many other countries.",
    { glassMin: 12, heightMin: 1000, w: 57, H: 71, d: 65, length: "12 or 16 ft", fixing: BOLT },
    { featured: true, accessories: CP, features: ["Most popular profile", "Anodise, wooden or powder-coat finish"] });
  P("PR 09 CP", "continuous", "arch", "Continuous aero-dynamic profile with ABS packing lock.",
    { glassMin: 12, heightMin: 1000, w: 70, H: 70, d: 57, length: "12 or 16 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: CP, features: ["Aero-dynamic shape", "ABS packing for a firm glass lock"] });
  P("PR 10 CP", "continuous", "rect", "Curved edges with a stunning look, locked with an aluminium lock.",
    { glassMin: 12, heightMin: 1000, w: 52, H: 54, d: 47, length: "16 ft", fixing: BOLT, locking: "Aluminium lock" },
    { accessories: CP, features: ["Curved edges", "Aluminium glass lock"] });
  P("PR 11 CP", "continuous", "rect", "An outstanding solution for safety and stability.",
    { glassMin: 12, glassMax: 15, heightMin: 1000, w: 80, H: 105, d: 91, length: "12 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: CP, features: ["Takes 12–15 mm glass", "Strong, stable base"] });
  P("PR 12 CP", "continuous", "rect", "Slim profile with zero disturbance to the view.",
    { glassMin: 12, heightMin: 750, heightMax: 800, w: 30, H: 42, d: 34, length: "16 ft", fixing: "Bolts at every 12 inches", locking: "ABS packing" },
    { accessories: ["Profile (CP)"], features: ["Ultra-slim 30 mm base", "Uninterrupted view"] });
  P("PR 13 CP", "continuous", "rect", "Easy to install, elegant and functional.",
    { glassMin: 12, heightMin: 900, w: 34, H: 60, d: 45, length: "16 ft", fixing: "Bolts at every 12 inches", locking: "ABS packing" },
    { accessories: CP, features: ["Quick installation", "Slim and elegant"] });
  P("PR 14 CP", "continuous", "rect", "Designed to meet the needs and expectation of the site.",
    { glassMin: 12, heightMin: 1000, w: 37, H: 80, d: 70, length: "12 or 16 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: CP, features: ["Slim 37 mm base", "12 or 16 ft lengths"] });
  P("PR 15 CP", "continuous", "rect", "Versatile continuous profile for most sites.",
    { glassMin: 12, heightMin: 1000, w: 50, H: 86, d: 70, length: "12 or 16 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: CP, features: ["All-round profile", "12 or 16 ft lengths"] });
  P("PR 16 CP", "continuous", "rect", "Aesthetic design and easy installation.",
    { glassMin: 12, heightMin: 1000, w: 38, H: 102, d: 87, length: "16 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: ["Profile (CP)"], features: ["Aesthetic design", "Easy installation"] });
  P("PR 17 CP", "continuous", "rect", "High strength, ultra modern design and an unlimited view.",
    { glassMin: 12, heightMin: 1050, w: 45, H: 120, d: 101, length: "12 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: CP, features: ["Up to 1050 mm height", "Ultra modern look"] });
  P("PR 18 CP", "continuous", "rect", "Commonly used in high-rise buildings, malls and shopping complexes.",
    { glassMin: 12, heightMin: 1100, w: 55, H: 120, d: 109, length: "12 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: CP, features: ["Up to 1100 mm height", "Built for commercial projects"], applications: ["High-rise buildings", "Malls", "Shopping complexes"] });
  P("PR 19 CP", "continuous", "rect", "Highest strength among all designs, with aluminium locking system.",
    { glassMin: 12, glassMax: 17, heightMin: 1200, w: 70, H: 125, d: 98, length: "12 ft", fixing: BOLT, locking: "Aluminium locking system" },
    { featured: true, accessories: ["Profile (CP)", "Cover – top (CV Top)", "End cap – bottom", "End cap – slotted"], features: ["Takes 12–17 mm glass", "Up to 1200 mm height"], applications: ["High-rise buildings", "Malls", "Shopping complexes"] });
  P("PR 20 CP", "continuous", "arch", "Innovative Turkish design – dust free with zero maintenance.",
    { glassMin: 12, heightMin: 1000, w: 71, H: 81, d: 67, length: "16 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: ["Profile (CP)", "Cover – top (CV Top)", "End cap – bottom", "End cap – slotted"], features: ["Turkish design", "Dust free, zero maintenance"] });
  P("PR 21 CP LED", "continuous", "rect", "Ultra modern design with a slot for LED rope light.",
    { glassMin: 12, heightMin: 1000, w: 50, H: 90, d: 71, length: "16 ft", fixing: BOLT, locking: "ABS packing" },
    { featured: true, accessories: ["Profile (CP LED)", "End cap – bottom", "End cap – slotted"], features: ["Integrated LED rope-light slot", "Glow-lit glass edge"], applications: ["Pool decks", "Villas", "Rooftop lounges", "Hotels"] });
  P("PR 22 CP", "continuous", "arch", "Low-profile system for 800 mm railings.",
    { glassMin: 12, heightMin: 800, w: 45, H: 60, d: 52, length: "16 ft", fixing: BOLT, locking: "ABS packing" },
    { accessories: CP, features: ["Low profile", "16 ft lengths"] });
  P("PR 32 CP-C", "continuous", "rect", "Concealed continuous profile for a classic, seamless view.",
    { glassMin: 12, heightMin: 1000, w: 56, H: 92, d: 74, length: "", fixing: BOLT },
    { accessories: ["Profile (CP-C)", "Cover – top (CV Top)", "End cap – bottom", "End cap – slotted"], features: ["Fully concealed in floor / slab", "Seamless view"], applications: ["Swimming pools", "Terraces", "Villas"] });

  // ---- Bracket Profile ----
  const BRT = n => "Bracket length " + n + "; use 1 bracket per 2.5 ft";
  P("PR 23 BRT", "bracket", "taper", "Aero-dynamic design, stunning look and zero maintenance.",
    { glassMin: 12, heightMin: 1000, w: 60, H: 115, d: 96, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 55 mm", "1 bracket per 2.5 ft"] });
  P("PR 24 BRT", "bracket", "rect", "Basic, widely used commercial design – the best of its kind.",
    { glassMin: 12, heightMin: 900, w: 84, H: 94, d: 73, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 65 mm", "1 bracket per 2.5 ft"] });
  P("PR 25 BRT", "bracket", "rect", "Modern, budget-friendly bracket system.",
    { glassMin: 12, heightMin: 900, w: 80, H: 97, d: 68, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 65 mm", "Budget friendly"] });
  P("PR 26 BRT", "bracket", "taper", "Minimalist Turkish design with the highest strength.",
    { glassMin: 12, heightMin: 1050, w: 60, H: 138, d: 99, fixing: "Anchored with bolts" },
    { featured: true, accessories: ["Bracket (BRT)"], features: ["Bracket length 50 mm", "Highest strength"] });
  P("PR 27 BRT", "bracket", "taper", "Durable and easy to clean.",
    { glassMin: 12, heightMin: 900, w: 67, H: 103, d: 64, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 65 mm", "Easy to clean"] });
  P("PR 28 BRT", "bracket", "arch", "Basic design at a low budget.",
    { glassMin: 12, heightMin: 900, w: 57, H: 71, d: 65, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 3, 4 or 6 inches", "Low budget"] });
  P("PR 29 BRT", "bracket", "arch", "Basic design at a low budget.",
    { glassMin: 12, heightMin: 900, w: 70, H: 70, d: 57, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 3, 4 or 6 inches", "Low budget"] });
  P("PR 30 BRT", "bracket", "rect", "High strength, suitable for long railings.",
    { glassMin: 12, heightMin: 1000, w: 89, H: 146, d: 123, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 70 mm", "Suitable for long runs"] });
  P("PR 31 BRT", "bracket", "rect", "Aerodynamic, dust-proof design.",
    { glassMin: 12, glassMax: 13.5, heightMin: 1000, w: 80, H: 105, d: 91, fixing: "Anchored with bolts" },
    { accessories: ["Bracket (BRT)"], features: ["Bracket length 70 mm", "Dust proof"] });

  // ---- Side mount & wall ----
  P("PR 33 SD", "side", "rect", "Side-mounting fascia design for high-rise buildings, malls and shopping complexes.",
    { glassMin: 12, heightMin: 950, w: 63, H: 154, d: 100, fixing: "2 bolts at every 12 inches", locking: "ABS packing" },
    { featured: true, accessories: ["Profile (SD)", "Cover (CV)", "Cover – top (CV Top)", "End cap – bottom", "End cap – slotted"], features: ["Fascia / side mounting", "Frees up usable floor area"], applications: ["High-rise buildings", "Malls", "Shopping complexes"] });
  P("PR 34 SD", "side", "rect", "Wall-mounting handrail system, commonly used on stairs.",
    { glassMin: 0, heightMin: 0, w: 40, H: 96, d: 46, fixing: "Bracket anchored with bolts at every 3 ft" },
    { accessories: ["Handrail", "Wall bracket"], features: ["Wall mounted", "Anodise, wooden or powder coat"], applications: ["Staircases", "Corridors", "Ramps"],
      description: "Prism Rail PR 34 SD is a continuous aluminium wall-mounting handrail system commonly used on stairs. The bracket is anchored with bolts at every 3 ft." });

  // ---- Hand rails ----
  [["PR HR - 42","round"],["PR HR - 50","round"],["PR HR - 65","round"],["PR HR - 3135","rect"],["PR HR - 7135 LED","led"],["PR HR - 7030","rect"],
   ["PR HR - 2525","rect"],["PR HR - 4040","rect"],["PR HR - 5050","rect"],["PR HR - 7039","round"],["PR HR - 6540","round"],["PR HR - 5040","round"],
   ["PR HR - 6040","rect"],["PR HR - 6444","round"],["PR HR - 8238","round"],["PR HR - 5530","rect"],["PR HR - 3641","round"],["PR HR - 2017","rect"]
  ].forEach(function (h) {
    PRISM.products.push({
      id: slug(h[0]), code: h[0], name: h[0], category: "handrail", categoryName: "Hand Rails", shape: h[1],
      tagline: h[1] === "led" ? "Handrail with integrated LED strip channel." : "Aluminium handrail that caps the glass for a finished, safe edge.",
      image: "",
      thumb: "",
      featured: false, features: ["Fits over glass top edge", "Anodise, wooden or powder-coat finish"],
      applications: ["Balconies", "Staircases", "Terraces"], accessories: ["Handrail section", "End cap"],
      spec: { mounting: "Top rail over glass", glassThickness: "12 mm", railHeight: "–", baseWidth: 0, overallHeight: 0, glassDepth: 0, length: "", fixing: "", locking: "", glassMin: 12 },
      finishes: PRISM.finishes
    });
  });
})();
