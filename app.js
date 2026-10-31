/* ============================================================
   RÉGLAGES À MODIFIER
   ============================================================ */
const CONFIG = {
  shopName: "La Laiterie Douce",
  whatsapp: "33600000000",   // votre numéro, sans "+" ni espaces (ex : 33612345678)
  deliveryFee: 3,            // frais de livraison en euros
  freeDeliveryFrom: 20       // livraison offerte à partir de ce montant
};

const CATEGORIES = [
  { id: "tous", label: "Tous" },
  { id: "classique", label: "Classiques" },
  { id: "fruits", label: "Aux fruits" },
  { id: "grec", label: "Grecs" },
  { id: "vegetal", label: "Végétaux" },
  { id: "boire", label: "À boire" }
];

/* Produits. La photo de chaque produit est images/<id>.jpg
   (ex. images/fraise.jpg) : remplacez le fichier pour changer la photo.
   tint = couleur de fond affichée tant que la photo manque.
   tag (facultatif) = petite mention au-dessus du nom. */
const PRODUCTS = [
  { id: "nature",   name: "Nature onctueux",       cat: "classique", price: 0.8, format: "125 g",  tint: "#ebe6dc", desc: "Le classique de la maison, lisse et délicatement acidulé." },
  { id: "vanille",  name: "Vanille de Madagascar", cat: "classique", price: 1.1, format: "125 g",  tint: "#efe5cc", tag: "Le plus demandé", desc: "Parfumé aux gousses de vanille, grains visibles." },
  { id: "fraise",   name: "Fraise des bois",       cat: "fruits",    price: 1.2, format: "125 g",  tint: "#f0dcdc", tag: "Le plus demandé", desc: "Des morceaux de fraises fondants, juste ce qu'il faut de sucre." },
  { id: "mangue",   name: "Mangue passion",        cat: "fruits",    price: 1.3, format: "125 g",  tint: "#f1e2c4", desc: "Doux et légèrement acidulé, avec un coulis de fruits." },
  { id: "myrtille", name: "Myrtille sauvage",      cat: "fruits",    price: 1.3, format: "125 g",  tint: "#e2dde8", desc: "Riche en fruit, une couleur profonde et naturelle." },
  { id: "grecnat",  name: "Grec nature",           cat: "grec",      price: 1.5, format: "150 g",  tint: "#e7e5e0", desc: "Épais et crémeux, naturellement riche en protéines." },
  { id: "grecmiel", name: "Grec miel et noix",     cat: "grec",      price: 1.8, format: "150 g",  tint: "#efe1c6", desc: "Miel de fleurs et éclats de noix torréfiées." },
  { id: "coco",     name: "Coco végétal",          cat: "vegetal",   price: 1.5, format: "125 g",  tint: "#e3e8e1", tag: "Nouveau", desc: "Cent pour cent végétal, fondant et gourmand." },
  { id: "amande",   name: "Amande vanille",        cat: "vegetal",   price: 1.5, format: "125 g",  tint: "#ece2d3", desc: "Une recette végétale à l'amande, sans lait." },
  { id: "boirefr",  name: "Yaourt à boire fraise", cat: "boire",     price: 1.9, format: "250 ml", tint: "#f2dee0", desc: "Pour le petit-déjeuner ou la pause, à emporter." },
  /* Coffret : présenté dans sa propre section, hors filtres */
  { id: "coffret",  name: "Coffret découverte",    cat: "coffret",   price: 9.9, format: "6 pots", tint: "#e3dccf", desc: "Six parfums choisis dans la fournée de la semaine, dans une caisse en bois. De quoi faire le tour de la maison, ou l'offrir." }
];

/* ============================================================
   OUTILS
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const euro = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const byId = id => PRODUCTS.find(p => p.id === id);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const photoOf = p => `images/${p.id}.jpg`;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = !!window.gsap;
const hasFlip = hasGsap && !!window.Flip;

/* Photo manquante : on affiche un fond coloré avec le nom à la place */
function markMissing(img) {
  const fig = img.closest(".photo");
  if (fig) fig.classList.add("is-missing");
}
document.addEventListener("error", e => { if (e.target.tagName === "IMG") markMissing(e.target); }, true);
function checkPhotos(root = document) {
  $$(".photo img", root).forEach(img => { if (img.complete && img.naturalWidth === 0) markMissing(img); });
}

function photoFigure(p, cls, alt) {
  return `<figure class="photo ${cls}" style="--tint:${p.tint}" data-label="${p.name}">
    <img src="${photoOf(p)}" alt="${alt}" width="1000" height="1250" loading="lazy">
  </figure>`;
}

/* ============================================================
   PANIER (mémorisé dans le navigateur)
   ============================================================ */
const STORAGE_KEY = "laiterie-panier";
const MAX_QTY = 99;

/* Relit le panier mémorisé en ne gardant que des produits connus et des quantités entières (1 à 99) */
function readCart() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { /* panier illisible : on repart de zéro */ }
  const clean = {};
  if (saved && typeof saved === "object" && !Array.isArray(saved)) {
    Object.entries(saved).forEach(([id, q]) => {
      q = Math.floor(Number(q));
      if (byId(id) && q > 0) clean[id] = Math.min(q, MAX_QTY);
    });
  }
  return clean;
}
let cart = readCart();

function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* ignoré */ }
}
const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
/* Calcul en centimes : évite que 20,00 € devienne 19,999… € (et la livraison facturée à tort) */
const subtotal = () => Object.entries(cart).reduce((s, [id, q]) => s + Math.round(byId(id).price * 100) * q, 0) / 100;

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
  cart[id] = Math.min((cart[id] || 0) + 1, MAX_QTY);
  afterCartChange(); bumpCount();
  showToast(`${byId(id).name} ajouté au panier`);
}
function changeQty(id, delta) {
  cart[id] = Math.min((cart[id] || 0) + delta, MAX_QTY);
  if (cart[id] <= 0) delete cart[id];
  afterCartChange();
}
function removeItem(id) { delete cart[id]; afterCartChange(); }

/* ============================================================
   CATALOGUE
   ============================================================ */
let activeCat = "tous";
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

function renderFilters() {
  const count = id => id === "tous" ? shopProducts.length : shopProducts.filter(p => p.cat === id).length;
  $("#filters").innerHTML = CATEGORIES.map(c =>
    `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === activeCat}">${c.label} <small>${count(c.id)}</small></button>`
  ).join("");
}

function renderGrid() {
  $("#product-grid").innerHTML = shopProducts.map(p => `
    <article class="product" data-cat="${p.cat}">
      ${photoFigure(p, "product-media", `Pot de yaourt ${p.name.toLowerCase()}`)}
      <div class="product-info">
        ${p.tag ? `<p class="product-tag">${p.tag}</p>` : ""}
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-buy">
          <span class="price">${euro(p.price)}<small>${p.format}</small></span>
          <div data-buy="${p.id}">${buyControl(p)}</div>
        </div>
      </div>
    </article>`).join("");
}

function renderCoffret() {
  const p = byId("coffret");
  $("#featured").innerHTML = `
    ${photoFigure(p, "coffret-media", "Caisse en bois contenant six pots de yaourt de parfums différents")}
    <div class="coffret-text">
      <p class="coffret-tag">À offrir ou à partager</p>
      <h2 class="section-title">${p.name}</h2>
      <p class="coffret-desc">${p.desc}</p>
      <ul class="coffret-list">
        <li>Six pots de 125 g, parfums variés</li>
        <li>Caisse en bois réutilisable</li>
        <li>Pots en verre consignés</li>
      </ul>
      <div class="coffret-buy">
        <span class="price">${euro(p.price)}</span>
        <div data-buy="${p.id}">${buyControl(p)}</div>
      </div>
    </div>`;
}

/* Filtrage animé avec GSAP Flip : les cartes glissent à leur nouvelle place */
function applyFilter(cat) {
  activeCat = cat;
  $$(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === cat)));
  const grid = $("#product-grid");
  const cards = $$(".product", grid);
  const state = hasFlip && !reduceMotion ? Flip.getState(cards) : null;
  if (state) grid.style.minHeight = grid.offsetHeight + "px";
  cards.forEach(c => { c.style.display = cat === "tous" || c.dataset.cat === cat ? "" : "none"; });
  if (!state) return;
  Flip.from(state, {
    duration: .6, ease: "power2.inOut", absolute: true,
    onEnter: els => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: .4, delay: .15 }),
    onLeave: els => gsap.to(els, { opacity: 0, duration: .25 }),
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
  /* La liste est reconstruite : on retient le bouton qui avait le focus clavier pour le lui rendre */
  const active = document.activeElement;
  const activeItem = active && active.closest ? active.closest(".cart-item") : null;
  const focusAction = activeItem ? ["dec", "inc", "remove"].find(a => active.dataset[a]) : null;
  const focusId = focusAction ? active.dataset[focusAction] : null;
  const focusIndex = activeItem ? $$(".cart-item", $("#cart-list")).indexOf(activeItem) : -1;

  $("#cart-count").textContent = cartCount();
  $("#cart-empty").hidden = ids.length > 0;
  $("#cart-list").innerHTML = ids.map(id => {
    const p = byId(id), q = cart[id];
    return `<li class="cart-item">
      ${photoFigure(p, "cart-thumb", "")}
      <div>
        <strong>${p.name}</strong>
        <small>${euro(p.price)} · ${p.format}</small>
        <div class="stepper" role="group" aria-label="Quantité de ${p.name}">
          <button type="button" data-dec="${id}" aria-label="Retirer un ${p.name}">−</button>
          <span>${q}</span>
          <button type="button" data-inc="${id}" aria-label="Ajouter un ${p.name}">+</button>
        </div>
      </div>
      <div class="cart-side">
        <span class="line-total">${euro(p.price * q)}</span>
        <button type="button" class="remove" data-remove="${id}">Retirer</button>
      </div>
    </li>`;
  }).join("");
  checkPhotos($("#cart-list"));
  if (focusAction) {
    const list = $("#cart-list");
    const same = list.querySelector(`[data-${focusAction}="${focusId}"]`);
    const items = $$(".cart-item", list);
    const neighbour = items[Math.min(focusIndex, items.length - 1)];
    const target = same || (neighbour && neighbour.querySelector("[data-remove]")) || $("#empty-browse");
    if (target) target.focus();
  }

  const sub = subtotal();
  const fee = deliveryCost("livraison");
  $("#subtotal").textContent = euro(sub);
  $("#delivery-line").textContent = ids.length ? (fee === 0 ? "Offerte" : euro(fee)) : "—";
  $("#total").textContent = euro(ids.length ? sub + fee : 0);
  $("#go-checkout").disabled = ids.length === 0;

  const free = sub >= CONFIG.freeDeliveryFrom;
  $("#progress").hidden = ids.length === 0;
  $("#progress-fill").style.width = clamp(sub / CONFIG.freeDeliveryFrom * 100, 0, 100) + "%";
  $("#progress").classList.toggle("is-full", free);
  $("#free-hint").textContent = !ids.length ? "" :
    free ? "La livraison vous est offerte." : `Plus que ${euro(CONFIG.freeDeliveryFrom - sub)} pour la livraison offerte.`;

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
   FABRICATION : la grande photo suit l'étape lue
   ============================================================ */
function initSteps() {
  const steps = $$(".step");
  const photos = $$(".steps-photo");
  if (!steps.length || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-steps");
  const setStep = i => {
    steps.forEach(s => s.classList.toggle("is-active", Number(s.dataset.step) === i));
    photos.forEach(ph => ph.classList.toggle("is-active", Number(ph.dataset.step) === i));
  };
  setStep(0);
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) setStep(Number(entry.target.dataset.step)); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(s => io.observe(s));
}

/* ============================================================
   ANIMATIONS (GSAP) — sobres : une entrée au chargement,
   les produits qui apparaissent, le filtrage. Rien si
   mouvement réduit ou si GSAP n'a pas chargé.
   ============================================================ */
function splitWords(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/)
    .map(w => `<span class="word" style="display:inline-block">${w}</span>`).join(" ");
}
function initMotion() {
  if (!hasGsap || reduceMotion) return;
  if (window.Flip) gsap.registerPlugin(Flip);

  const title = $("[data-split]");
  splitWords(title);
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero-media img", { scale: 1.06, duration: 1.6, ease: "power2.out" })
    .from(title.querySelectorAll(".word"), { opacity: 0, y: 24, duration: .8, stagger: .06 }, "<.2")
    .from("[data-hero]", { opacity: 0, y: 12, duration: .6, stagger: .1 }, "-=.45");

  if (!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.batch(".product", {
    start: "top 92%", once: true,
    onEnter: els => gsap.from(els, { opacity: 0, y: 14, duration: .6, ease: "power2.out", stagger: .08, clearProps: "opacity,transform" })
  });
  gsap.from(".coffret-media img", {
    scale: 1.08, ease: "none",
    scrollTrigger: { trigger: ".coffret", start: "top bottom", end: "bottom top", scrub: true }
  });
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
  /* La barre « Voir le panier » disparaît si le panier est vidé : on revient alors au bouton Panier du haut */
  const back = lastFocus && document.contains(lastFocus) && lastFocus.offsetParent !== null ? lastFocus : $("#open-cart");
  back.focus();
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
    `${data.mode === "retrait" ? "Retrait à la boutique" : "Livraison"} : ${fee === 0 ? "gratuit" : euro(fee)}`,
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
  const c = $(".cart-count");
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
$("#cart-list").addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.inc) changeQty(t.dataset.inc, 1);
  else if (t.dataset.dec) changeQty(t.dataset.dec, -1);
  else if (t.dataset.remove) removeItem(t.dataset.remove);
});

$("#open-cart").addEventListener("click", openCart);
$("#mobile-bar-btn").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("#done-close").addEventListener("click", closeCart);
$("#empty-browse").addEventListener("click", () => { closeCart(); $("#yaourts").scrollIntoView(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
  else if (e.key === "Escape" && nav.classList.contains("open")) { closeNav(); burger.focus(); }
  trapFocus(e);
});
/* Panier modifié dans un autre onglet : on se met à jour au lieu de l'écraser */
window.addEventListener("storage", e => {
  if (e.key !== STORAGE_KEY && e.key !== null) return;
  cart = readCart(); renderCart(); updateBuySlots(); updateMobileBar();
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

function closeNav() { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", e => { if (e.target.tagName === "A") closeNav(); });
/* Menu téléphone : se ferme aussi en touchant ailleurs */
document.addEventListener("click", e => {
  if (nav.classList.contains("open") && !nav.contains(e.target) && !burger.contains(e.target)) closeNav();
});

/* ============================================================
   DÉMARRAGE
   ============================================================ */
document.querySelectorAll("[data-shop-name]").forEach(el => { el.textContent = CONFIG.shopName; });
document.querySelectorAll("[data-delivery-fee]").forEach(el => { el.textContent = euro(CONFIG.deliveryFee); });
document.querySelectorAll("[data-free-from]").forEach(el => { el.textContent = euro(CONFIG.freeDeliveryFrom); });
$("#contact-wa").href = `https://wa.me/${CONFIG.whatsapp}`;
$("#year").textContent = new Date().getFullYear();

renderFilters();
renderGrid();
renderCoffret();
renderCart();
updateMobileBar();
checkPhotos();
initSteps();
initMotion();
