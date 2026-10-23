/* ============================================================
   RÉGLAGES À MODIFIER
   ============================================================ */
const CONFIG = {
  shopName: "La Laiterie Douce",
  whatsapp: "33600000000",   // votre numéro, sans "+" ni espaces (ex : 33612345678)
  deliveryFee: 3,            // frais de livraison en euros
  freeDeliveryFrom: 20       // livraison offerte à partir de ce montant
};

/* Parfums montrés dans le grand carrousel du haut (ids de PRODUCTS) */
const HERO_FLAVORS = ["fraise", "vanille", "myrtille"];

const CATEGORIES = [
  { id: "tous", label: "Tous" },
  { id: "classique", label: "Classiques" },
  { id: "fruits", label: "Aux fruits" },
  { id: "grec", label: "Grecs" },
  { id: "vegetal", label: "Végétaux" },
  { id: "boire", label: "À boire" }
];

/* Produits. fill = couleur du yaourt, fruit = couleur des morceaux,
   tint = couleur de fond de la carte (une couleur par parfum). */
const PRODUCTS = [
  { id: "nature",   name: "Nature onctueux",       cat: "classique", price: 0.8, format: "125 g",  fill: "#f4efe2", fruit: null,      tint: "#efece4", desc: "Le classique de la maison, lisse et délicatement acidulé." },
  { id: "vanille",  name: "Vanille de Madagascar", cat: "classique", price: 1.1, format: "125 g",  fill: "#f2e2b0", fruit: "#7a5a24", tint: "#f5ecd3", tag: "Populaire", desc: "Parfumé aux gousses de vanille, grains visibles." },
  { id: "fraise",   name: "Fraise des bois",       cat: "fruits",    price: 1.2, format: "125 g",  fill: "#eeaab5", fruit: "#a8324a", tint: "#f7dce2", tag: "Populaire", desc: "Des morceaux de fraises fondants, juste ce qu'il faut de sucre." },
  { id: "mangue",   name: "Mangue passion",        cat: "fruits",    price: 1.3, format: "125 g",  fill: "#f4c76e", fruit: "#c47a12", tint: "#fbe9c6", desc: "Un soleil exotique, doux et légèrement acidulé." },
  { id: "myrtille", name: "Myrtille sauvage",      cat: "fruits",    price: 1.3, format: "125 g",  fill: "#b4a7cf", fruit: "#54447f", tint: "#e5e0f1", desc: "Riche en fruit, une couleur profonde et naturelle." },
  { id: "grecnat",  name: "Grec nature",           cat: "grec",      price: 1.5, format: "150 g",  fill: "#f7f4ec", fruit: null,      tint: "#e9edf1", desc: "Épais et crémeux, naturellement riche en protéines." },
  { id: "grecmiel", name: "Grec miel & noix",      cat: "grec",      price: 1.8, format: "150 g",  fill: "#e8c26a", fruit: "#8a5e1c", tint: "#f4e6c4", desc: "Miel de fleurs et éclats de noix torréfiées." },
  { id: "coco",     name: "Coco végétal",          cat: "vegetal",   price: 1.5, format: "125 g",  fill: "#e9efe5", fruit: "#6fa889", tint: "#e1eee6", tag: "Nouveau", desc: "Cent pour cent végétal, fondant et gourmand." },
  { id: "amande",   name: "Amande vanille",        cat: "vegetal",   price: 1.5, format: "125 g",  fill: "#e5d1ae", fruit: "#9a7444", tint: "#f1e5d2", desc: "Une recette végétale à l'amande, sans lait." },
  { id: "boirefr",  name: "Yaourt à boire fraise", cat: "boire",     price: 1.9, format: "250 ml", fill: "#eea0b1", fruit: "#a8324a", tint: "#f9dbe3", desc: "Pour le petit-déjeuner ou la pause gourmande, à emporter." },
  /* Coffret : mis en avant au-dessus du catalogue (hors filtres) */
  { id: "coffret",  name: "Coffret découverte",    cat: "coffret",   price: 9.9, format: "6 pots", fill: "#a16207", fruit: null,      tint: "#f4ead6", desc: "Six parfums choisis au fil de la fournée : de quoi faire le tour de la maison et trouver vos préférés. Une jolie idée à offrir." }
];

/* ============================================================
   OUTILS
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const euro = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const byId = id => PRODUCTS.find(p => p.id === id);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = !!window.gsap;
const hasFlip = hasGsap && !!window.Flip;

/* Pot en verre : couvercle sombre cerclé d'or, étiquette minimale */
function jarSvg(fill, fruit, size = 104) {
  const berries = fruit
    ? `<circle cx="49" cy="58" r="4.5" fill="${fruit}" opacity=".85"/>
       <circle cx="66" cy="55" r="3.6" fill="${fruit}" opacity=".8"/>
       <circle cx="58" cy="63" r="3" fill="${fruit}" opacity=".75"/>`
    : "";
  return `<svg viewBox="0 0 120 160" width="${size}" role="img" aria-hidden="true">
    <rect x="30" y="22" width="60" height="16" rx="3" fill="#292524"/>
    <rect x="30" y="34" width="60" height="3" fill="#a16207"/>
    <path d="M28 42 Q28 38 32 38 L88 38 Q92 38 92 42 L90 140 Q89.5 149 81 149 L39 149 Q30.5 149 30 140 Z"
          fill="#ffffff" stroke="#ddd8cf" stroke-width="1.4"/>
    <path d="M33 50 L87 50 L85.4 138 Q85 144 78 144 L42 144 Q35 144 34.6 138 Z" fill="${fill}"/>
    <ellipse cx="60" cy="50" rx="27" ry="4" fill="rgba(255,255,255,.55)"/>
    ${berries}
    <rect x="40" y="96" width="40" height="30" rx="2" fill="#fbfaf7"/>
    <line x1="47" y1="105" x2="73" y2="105" stroke="#a16207" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="49" y1="112" x2="71" y2="112" stroke="#d6d1c7" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="52" y1="118" x2="68" y2="118" stroke="#d6d1c7" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="36" y="54" width="4" height="80" rx="2" fill="rgba(255,255,255,.6)"/>
  </svg>`;
}

/* Coffret : boîte crème, ruban or, trois pots */
function coffretSvg(size = 270) {
  const pot = (x, fill) => `
    <g transform="translate(${x},14)">
      <rect x="2" y="0" width="28" height="8" rx="2" fill="#292524"/>
      <rect x="2" y="6" width="28" height="2" fill="#a16207"/>
      <path d="M0 12 Q0 9 3 9 L29 9 Q32 9 32 12 L30 60 Q29.7 65 25 65 L7 65 Q2.3 65 2 60 Z" fill="#fff" stroke="#ddd8cf" stroke-width="1"/>
      <path d="M3 18 L29 18 L27.6 57 Q27.4 61 23 61 L9 61 Q4.6 61 4.4 57 Z" fill="${fill}"/>
    </g>`;
  return `<svg viewBox="0 0 230 150" width="${size}" role="img" aria-hidden="true">
    ${pot(42, "#eeaab5")}${pot(99, "#f2e2b0")}${pot(156, "#b4a7cf")}
    <path d="M16 70 L214 70 L204 136 Q203 142 196 142 L34 142 Q27 142 26 136 Z" fill="#f4ead6"/>
    <path d="M16 70 L214 70 L212 80 L18 80 Z" fill="#e6d6b4"/>
    <rect x="107" y="70" width="16" height="72" fill="#a16207"/>
    <path d="M115 98 q-16 -14 -26 -4 q8 10 26 4 q16 -14 26 -4 q-8 10 -26 4" fill="#c58a1e"/>
    <circle cx="115" cy="98" r="5" fill="#854d0e"/>
  </svg>`;
}

const sparkSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 5 5 9 10 10-5 1-9 5-10 10-1-5-5-9-10-10 5-1 9-5 10-10Z" fill="currentColor"/></svg>`;

/* ============================================================
   PANIER (mémorisé dans le navigateur)
   ============================================================ */
const STORAGE_KEY = "laiterie-panier";
let cart = {};
try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { cart = {}; }
Object.keys(cart).forEach(id => { if (!byId(id) || !(cart[id] > 0)) delete cart[id]; });

function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* ignoré */ }
}
const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const subtotal = () => Object.entries(cart).reduce((s, [id, q]) => s + byId(id).price * q, 0);

function deliveryCost(mode) {
  if (mode === "retrait") return 0;
  return subtotal() >= CONFIG.freeDeliveryFrom ? 0 : CONFIG.deliveryFee;
}
const currentMode = () => {
  const checked = document.querySelector('input[name="mode"]:checked');
  return checked ? checked.value : "livraison";
};

function afterCartChange() { saveCart(); renderCart(); updateBuySlots(); updateMobileBar(); }

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  afterCartChange(); bumpCount();
  showToast(`${byId(id).name} ajouté au panier`);
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  afterCartChange();
}
function removeItem(id) { delete cart[id]; afterCartChange(); }

/* ============================================================
   CATALOGUE
   ============================================================ */
let activeCat = "tous";
const catLabel = id => (CATEGORIES.find(c => c.id === id) || {}).label || "";
const shopProducts = PRODUCTS.filter(p => p.cat !== "coffret");

function buyControl(p) {
  const q = cart[p.id] || 0;
  if (!q) return `<button type="button" class="add-btn" data-add="${p.id}" aria-label="Ajouter ${p.name} au panier">Ajouter</button>`;
  return `<div class="stepper" role="group" aria-label="Quantité de ${p.name}">
    <button type="button" data-dec="${p.id}" aria-label="Retirer un ${p.name}">−</button>
    <span>${q}</span>
    <button type="button" data-inc="${p.id}" aria-label="Ajouter un ${p.name}">+</button>
  </div>`;
}

/* Met à jour les boutons d'achat sans reconstruire les cartes (garde le focus clavier) */
function updateBuySlots() {
  const active = document.activeElement;
  const activeSlot = active && active.closest ? active.closest("[data-buy]") : null;
  const activeAction = activeSlot ? (active.dataset.dec ? "dec" : "inc") : null;
  $$("[data-buy]").forEach(slot => { slot.innerHTML = buyControl(byId(slot.dataset.buy)); });
  if (activeSlot) {
    const target = activeSlot.querySelector(activeAction === "dec" ? "[data-dec]" : "[data-inc]") || activeSlot.querySelector("[data-add]");
    if (target) target.focus();
  }
}

function renderFeatured() {
  const p = byId("coffret");
  $("#featured").innerHTML = `
    <article class="coffret">
      <div class="coffret-art">${coffretSvg()}</div>
      <div class="coffret-body">
        <p class="coffret-tag">Idée cadeau</p>
        <h3>${p.name}</h3>
        <p class="coffret-desc">${p.desc}</p>
        <div class="coffret-foot">
          <span class="price">${euro(p.price)} <small>/ ${p.format}</small></span>
          <div data-buy="${p.id}">${buyControl(p)}</div>
        </div>
      </div>
    </article>`;
}

function renderFilters() {
  const count = id => id === "tous" ? shopProducts.length : shopProducts.filter(p => p.cat === id).length;
  $("#filters").innerHTML = CATEGORIES.map(c =>
    `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === activeCat}">${c.label} <small>${count(c.id)}</small></button>`
  ).join("");
}

function renderGrid() {
  $("#product-grid").innerHTML = shopProducts.map(p => `
    <article class="product" data-cat="${p.cat}" data-flip-id="${p.id}">
      ${p.tag ? `<span class="badge">${p.tag}</span>` : ""}
      <div class="product-art" style="--tint:${p.tint}">${jarSvg(p.fill, p.fruit)}</div>
      <div class="product-body">
        <span class="product-cat">${catLabel(p.cat)}</span>
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-foot">
          <span class="price">${euro(p.price)} <small>/ ${p.format}</small></span>
          <div data-buy="${p.id}">${buyControl(p)}</div>
        </div>
      </div>
    </article>`).join("");
}

/* Filtrage animé avec GSAP Flip : les cartes glissent à leur nouvelle place */
function applyFilter(cat) {
  activeCat = cat;
  $$(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === cat)));
  const grid = $("#product-grid");
  const cards = $$(".product", grid);
  const state = hasFlip && !reduceMotion ? Flip.getState(cards) : null;
  // Hauteur figée pendant l'animation : la section suivante ne remonte pas sur les cartes qui partent
  if (state) grid.style.minHeight = grid.offsetHeight + "px";
  cards.forEach(c => { c.style.display = cat === "tous" || c.dataset.cat === cat ? "" : "none"; });
  if (!state) return;
  Flip.from(state, {
    duration: .55, ease: "power2.inOut", scale: true, absolute: true,
    onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .45, delay: .1 }),
    onLeave: els => gsap.to(els, { opacity: 0, scale: .9, duration: .3 }),
    onComplete: () => {
      grid.style.minHeight = "";
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  });
}

/* ============================================================
   PANIER : AFFICHAGE
   ============================================================ */
function renderCart() {
  const ids = Object.keys(cart);
  $("#cart-count").textContent = cartCount();
  $("#cart-empty").hidden = ids.length > 0;
  $("#cart-list").innerHTML = ids.map(id => {
    const p = byId(id), q = cart[id];
    const art = id === "coffret" ? coffretSvg(40) : jarSvg(p.fill, p.fruit, 30);
    return `<li class="cart-item">
      <div class="cart-thumb" style="--tint:${p.tint}">${art}</div>
      <div>
        <strong>${p.name}</strong>
        <small>${euro(p.price)} · ${p.format}</small>
        <div class="qty">
          <button type="button" data-dec="${id}" aria-label="Retirer un ${p.name}">−</button>
          <span>${q}</span>
          <button type="button" data-inc="${id}" aria-label="Ajouter un ${p.name}">+</button>
        </div>
      </div>
      <div>
        <div class="line-total">${euro(p.price * q)}</div>
        <button type="button" class="remove" data-remove="${id}">Retirer</button>
      </div>
    </li>`;
  }).join("");

  const sub = subtotal();
  const fee = deliveryCost("livraison");
  $("#subtotal").textContent = euro(sub);
  $("#delivery-line").textContent = ids.length ? (fee === 0 ? "Offerte" : euro(fee)) : "—";
  $("#total").textContent = euro(ids.length ? sub + fee : 0);
  $("#go-checkout").disabled = ids.length === 0;

  const pct = clamp(Math.round(sub / CONFIG.freeDeliveryFrom * 100), 0, 100);
  const free = sub >= CONFIG.freeDeliveryFrom;
  $("#progress").hidden = ids.length === 0;
  $("#progress-fill").style.width = pct + "%";
  $("#progress").classList.toggle("is-full", free);
  $("#free-hint").textContent = !ids.length ? "" :
    free ? "La livraison vous est offerte." : `Plus que ${euro(CONFIG.freeDeliveryFrom - sub)} pour la livraison offerte`;

  updateCheckoutTotal();
}

function updateCheckoutTotal() {
  $("#checkout-total").textContent = euro(subtotal() + deliveryCost(currentMode()));
}

function updateMobileBar() {
  const n = cartCount();
  $("#mobile-bar").hidden = n === 0;
  document.body.classList.toggle("has-bar", n > 0);
  $("#mb-count").textContent = n;
  $("#mb-total").textContent = euro(subtotal());
}

/* ============================================================
   HERO : CARROUSEL DE PARFUMS (la couleur suit le parfum)
   Contrôles précédent / suivant / pause ; arrêt au survol, au focus,
   hors écran, et pas de défilement automatique si mouvement réduit.
   ============================================================ */
const hero = $("#hero"), heroStage = $("#hero-stage"), heroJar = $("#hero-jar"),
      heroCaption = $("#hero-caption"), heroDots = $("#hero-dots"), heroPlay = $("#hero-play");
const SLIDE_SECONDS = 5.5;
let heroIdx = 0, heroPlaying = hasGsap && !reduceMotion, heroHold = false, heroVisible = true, heroTween = null;

function heroCaptionHTML(p) {
  return `<p class="flavor-tag">Parfum du moment</p>
    <h2>${p.name}</h2>
    <p>${p.desc}</p>
    <div class="buy-row">
      <span class="price">${euro(p.price)} <small>/ ${p.format}</small></span>
      <button type="button" class="btn btn-solid btn-sm" data-add="${p.id}">Ajouter au panier</button>
    </div>`;
}

function renderHeroDots() {
  heroDots.innerHTML = HERO_FLAVORS.map((id, i) =>
    `<button type="button" class="hero-dot" data-slide="${i}" aria-label="Afficher ${byId(id).name}"><span><i></i></span></button>`
  ).join("");
}
function updateHeroDots() {
  $$(".hero-dot", heroDots).forEach((d, i) => {
    if (i === heroIdx) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    const bar = d.querySelector("i");
    if (hasGsap) gsap.set(bar, { scaleX: i === heroIdx && !heroPlaying ? 1 : 0 });
  });
}

function runHeroTimer() {
  if (heroTween) heroTween.kill();
  heroTween = null;
  if (!heroPlaying) return;
  const bar = heroDots.querySelector('[aria-current="true"] i');
  heroTween = gsap.fromTo(bar, { scaleX: 0 }, {
    scaleX: 1, duration: SLIDE_SECONDS, ease: "none",
    onComplete: () => showFlavor(heroIdx + 1, 1)
  });
  if (heroHold || !heroVisible) heroTween.pause();
}

function showFlavor(i, dir = 1, opts = {}) {
  const n = HERO_FLAVORS.length;
  heroIdx = (i + n) % n;
  const p = byId(HERO_FLAVORS[heroIdx]);
  hero.style.setProperty("--tint", p.tint);
  if (opts.user) heroCaption.setAttribute("aria-live", "polite");
  updateHeroDots();

  const swap = () => { heroJar.innerHTML = jarSvg(p.fill, p.fruit, 230); heroCaption.innerHTML = heroCaptionHTML(p); };
  if (hasGsap && !reduceMotion && !opts.instant) {
    gsap.timeline()
      .to(heroJar, { opacity: 0, y: -22, rotation: -6 * dir, duration: .28, ease: "power2.in" })
      .to(heroCaption, { opacity: 0, y: -10, duration: .22, ease: "power2.in" }, "<")
      .add(swap)
      .fromTo(heroJar, { opacity: 0, y: 30, rotation: 6 * dir }, { opacity: 1, y: 0, rotation: 0, duration: .7, ease: "back.out(1.7)" })
      .fromTo(heroCaption, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45, ease: "power2.out" }, "<.08");
  } else {
    swap();
  }
  if (hasGsap) runHeroTimer();
}

function setHeroPlaying(on) {
  heroPlaying = on && hasGsap;
  heroPlay.setAttribute("aria-pressed", String(!heroPlaying));
  heroCaption.setAttribute("aria-live", heroPlaying ? "off" : "polite");
  updateHeroDots();
  runHeroTimer();
}
function holdHero(on) {
  heroHold = on;
  if (!heroTween) return;
  if (on || !heroVisible) heroTween.pause(); else heroTween.resume();
}

/* ============================================================
   BANDE DÉFILANTE + MANIFESTE
   ============================================================ */
function renderMarquee() {
  const items = shopProducts.map(p => `<span class="marquee-item">${p.name}${sparkSvg}</span>`).join("");
  $("#marquee-track").innerHTML = reduceMotion ? items : items + items; // doublé pour une boucle sans couture
}

/* Découpe le manifeste en mots ; entre dans les groupes .nowrap,
   laisse les images rondes intactes */
function splitManifesto(el) {
  [...el.childNodes].forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList.contains("nowrap")) splitManifesto(node);
      return;
    }
    if (node.nodeType !== Node.TEXT_NODE) return;
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.append(" "); return; }
      const w = document.createElement("span");
      w.className = "w"; w.textContent = part;
      frag.append(w);
    });
    node.replaceWith(frag);
  });
}
function splitWords(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/)
    .map(w => `<span class="word" style="display:inline-block">${w}</span>`).join(" ");
}

/* ============================================================
   ANIMATIONS GSAP (réglages UI/UX Pro Max)
   - Hero : un seul moment orchestré au chargement
   - Parallaxe : décor uniquement (yPercent ≤ 15), jamais le texte
   - Scrub : lié au scroll (scrub 0.6 à 0.8)
   - Pas d'épinglage : la colonne du pot est en position sticky (CSS)
   - Mouvement réduit : tout reste dans son état final lisible
   ============================================================ */
function initMotion() {
  if (!hasGsap || reduceMotion) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.Flip) gsap.registerPlugin(Flip);

  const title = $("[data-split]");
  splitWords(title);
  splitManifesto($("#manifesto"));

  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro.from("#hero .eyebrow", { opacity: 0, y: 12, duration: .5 })
    .from(title.querySelectorAll(".word"), { opacity: 0, y: 28, duration: .8, stagger: .05 }, "-=.25")
    .from(".hero-lead, .hero-actions", { opacity: 0, y: 14, duration: .6, stagger: .08 }, "-=.55")
    .from(".hero-stage", { opacity: 0, y: 24, duration: .9 }, "<-.3");

  if (!window.ScrollTrigger) return;
  const mm = gsap.matchMedia();

  mm.add("(min-width: 0px)", () => {
    gsap.to(".hero-blob", { yPercent: 12, rotation: 10, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });

    gsap.fromTo("#manifesto .w", { opacity: .16 }, { opacity: 1, ease: "none", stagger: .1,
      scrollTrigger: { trigger: "#manifesto", start: "top 82%", end: "bottom 45%", scrub: .6 } });
    gsap.from("#manifesto .pill-img", { scale: .3, rotation: -25, ease: "back.out(2)", stagger: .15,
      scrollTrigger: { trigger: "#manifesto", start: "top 80%", end: "center 55%", scrub: .6 } });

    ScrollTrigger.batch(".product", {
      start: "top 90%", once: true,
      onEnter: els => gsap.from(els, { opacity: 0, y: 16, duration: .5, ease: "power2.out", stagger: .07, clearProps: "opacity,transform" })
    });

    gsap.to(".maison-blob", { rotation: 24, yPercent: -8, ease: "none",
      scrollTrigger: { trigger: "#maison", start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Le pot se remplit et le fond change à chaque étape (grand écran) */
  mm.add("(min-width: 901px)", () => {
    const steps = $$("#steps-nav li");
    const setStep = progress => {
      const idx = progress < .36 ? 0 : progress < .7 ? 1 : 2;
      steps.forEach((li, i) => li.classList.toggle("is-active", i === idx));
    };
    gsap.set("#etapes", { backgroundColor: "#e9edf1" });
    gsap.set("#story-fill", { attr: { y: 144 }, fill: "#e6e1d3" });
    gsap.set("#story-berries", { opacity: 0, y: 14 });

    gsap.timeline({
      scrollTrigger: { trigger: "#story-chapters", start: "top 55%", end: "bottom 75%", scrub: .8, onUpdate: self => setStep(self.progress) }
    })
      .to("#story-fill", { attr: { y: 100 }, duration: 1, ease: "none" })
      .to("#etapes", { backgroundColor: "#f5ecd3", duration: .6, ease: "none" })
      .to("#story-fill", { attr: { y: 62 }, fill: "#f4efe2", duration: 1, ease: "none" }, "<")
      .to("#etapes", { backgroundColor: "#f7dce2", duration: .6, ease: "none" })
      .to("#story-fill", { attr: { y: 50 }, fill: "#eeaab5", duration: .8, ease: "none" }, "<")
      .to("#story-berries", { opacity: 1, y: 0, duration: .5, ease: "none" });

    return () => steps.forEach((li, i) => li.classList.toggle("is-active", i === 0));
  });

  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/* Progression de lecture (barre dorée sous l'en-tête) */
function initScrollProgress() {
  const bar = $("#scroll-progress");
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ============================================================
   TIROIR PANIER (piège de focus)
   ============================================================ */
const drawer = $("#drawer"), overlay = $("#overlay");
let lastFocus = null;

function showView(name) {
  $("#view-cart").hidden = name !== "cart";
  $("#foot-cart").hidden = name !== "cart";
  $("#view-checkout").hidden = name !== "checkout";
  $("#view-done").hidden = name !== "done";
  $("#drawer-title").textContent = name === "cart" ? "Votre panier" : name === "checkout" ? "Commande" : "Commande envoyée";
}
function openCart() {
  lastFocus = document.activeElement;
  showView("cart");
  overlay.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#close-cart").focus();
}
function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
function trapFocus(e) {
  if (e.key !== "Tab" || !drawer.classList.contains("open")) return;
  const items = $$("button, a[href], input, textarea", drawer).filter(el => !el.disabled && el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ============================================================
   COMMANDE → WHATSAPP
   ============================================================ */
function buildMessage(data) {
  const lines = Object.entries(cart).map(([id, q]) => {
    const p = byId(id);
    return `• ${q} × ${p.name} (${p.format}) — ${euro(p.price * q)}`;
  });
  const fee = deliveryCost(data.mode);
  return [
    `Bonjour ${CONFIG.shopName}, je souhaite commander :`,
    "",
    ...lines,
    "",
    `Sous-total : ${euro(subtotal())}`,
    `${data.mode === "retrait" ? "Retrait sur place" : "Livraison"} : ${fee === 0 ? "gratuit" : euro(fee)}`,
    `Total : ${euro(subtotal() + fee)} (paiement à la réception)`,
    "",
    `Nom : ${data.name}`,
    `Téléphone : ${data.phone}`,
    data.mode === "livraison" ? `Adresse : ${data.address}` : "Je viendrai récupérer ma commande.",
    data.note ? `Remarque : ${data.note}` : ""
  ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
}
const waUrl = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

function validate(form) {
  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    note: form.note.value.trim(),
    mode: currentMode()
  };
  const errors = {};
  if (data.name.length < 2) errors.name = "Indiquez votre nom.";
  if (data.phone.replace(/\D/g, "").length < 8) errors.phone = "Indiquez un numéro de téléphone valide.";
  if (data.mode === "livraison" && data.address.length < 6) errors.address = "Indiquez votre adresse de livraison.";
  form.querySelectorAll("[data-error-for]").forEach(el => { el.textContent = errors[el.dataset.errorFor] || ""; });
  const firstBad = Object.keys(errors)[0];
  if (firstBad) form[firstBad].focus();
  return firstBad ? null : data;
}

/* ============================================================
   PETITS EXTRAS
   ============================================================ */
let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}
function bumpCount() {
  const c = $("#cart-count");
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
}
function wireBuyClicks(container) {
  container.addEventListener("click", e => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.add) addToCart(t.dataset.add);
    else if (t.dataset.inc) changeQty(t.dataset.inc, 1);
    else if (t.dataset.dec) changeQty(t.dataset.dec, -1);
  });
}

/* ============================================================
   ÉVÉNEMENTS
   ============================================================ */
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (b && b.dataset.cat !== activeCat) applyFilter(b.dataset.cat);
});
wireBuyClicks($("#product-grid"));
wireBuyClicks($("#featured"));
wireBuyClicks(heroCaption);
$("#cart-list").addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.inc) changeQty(t.dataset.inc, 1);
  else if (t.dataset.dec) changeQty(t.dataset.dec, -1);
  else if (t.dataset.remove) removeItem(t.dataset.remove);
});

/* Carrousel du hero */
$("#hero-prev").addEventListener("click", () => showFlavor(heroIdx - 1, -1, { user: true }));
$("#hero-next").addEventListener("click", () => showFlavor(heroIdx + 1, 1, { user: true }));
heroDots.addEventListener("click", e => {
  const d = e.target.closest("[data-slide]");
  if (!d) return;
  const i = Number(d.dataset.slide);
  if (i !== heroIdx) showFlavor(i, i > heroIdx ? 1 : -1, { user: true });
});
heroPlay.addEventListener("click", () => setHeroPlaying(!heroPlaying));
heroStage.addEventListener("mouseenter", () => holdHero(true));
heroStage.addEventListener("mouseleave", () => holdHero(heroStage.contains(document.activeElement)));
heroStage.addEventListener("focusin", () => holdHero(true));
heroStage.addEventListener("focusout", e => { if (!heroStage.contains(e.relatedTarget)) holdHero(heroStage.matches(":hover")); });
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; holdHero(heroHold); }, { threshold: .2 }).observe(hero);
}

$("#open-cart").addEventListener("click", openCart);
$("#mobile-bar-btn").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("#done-close").addEventListener("click", closeCart);
$("#empty-browse").addEventListener("click", () => { closeCart(); $("#catalogue").scrollIntoView(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
  trapFocus(e);
});

$("#go-checkout").addEventListener("click", () => { showView("checkout"); updateCheckoutTotal(); $("#view-checkout").name.focus(); });
$("#back-cart").addEventListener("click", () => showView("cart"));

const form = $("#view-checkout");
form.addEventListener("change", e => {
  if (e.target.name === "mode") {
    $("#address-field").hidden = e.target.value === "retrait";
    updateCheckoutTotal();
  }
});
form.addEventListener("submit", e => {
  e.preventDefault();
  if (!cartCount()) return;
  const data = validate(form);
  if (!data) return;
  const url = waUrl(buildMessage(data));
  window.open(url, "_blank", "noopener");
  $("#done-link").href = url;
  cart = {}; afterCartChange(); form.reset();
  $("#address-field").hidden = false;
  showView("done");
  $("#done-close").focus();
});

const burger = $("#burger"), nav = $("#nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
});

/* ============================================================
   DÉMARRAGE
   ============================================================ */
document.querySelectorAll("[data-shop-name]").forEach(el => { el.textContent = CONFIG.shopName; });
document.querySelectorAll("[data-delivery-fee]").forEach(el => { el.textContent = euro(CONFIG.deliveryFee); });
document.querySelectorAll("[data-free-from]").forEach(el => { el.textContent = euro(CONFIG.freeDeliveryFrom); });
$("#contact-wa").href = `https://wa.me/${CONFIG.whatsapp}`;
$("#year").textContent = new Date().getFullYear();
$("#maison-jar").innerHTML = jarSvg("#f4efe2", null, 250);

renderMarquee();
renderFeatured();
renderFilters();
renderGrid();
renderCart();
updateMobileBar();
renderHeroDots();
setHeroPlaying(heroPlaying);
showFlavor(0, 1, { instant: true });
initScrollProgress();
initMotion();
