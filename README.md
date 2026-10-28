# La Laiterie Douce

Site de vente de yaourts fermiers faits main : catalogue, panier et commande envoyée par WhatsApp (paiement à la réception).

En ligne :

- https://ferreol23.github.io/la-laiterie-douce-ferreol_portfolio/ (GitHub Pages, mis à jour tout seul à chaque envoi sur la branche `main`)
- Cloudflare : **en pause** depuis le 28/10/2026 (adresse `la-laiterie-douce-ferreol-portfolio.koffiferreol32.workers.dev` coupée et publication automatique désactivée). Pour le rallumer : dans le projet Cloudflare, onglet « Domains », réactiver l'adresse, puis dans « Settings > Builds », décocher « Disable builds ». Le fichier `.assetsignore` liste ce que Cloudflare ne doit pas publier (dossier `.git`, README, notes de version).

Site statique en HTML, CSS et JavaScript, sans installation ni étape de compilation. Les animations utilisent [GSAP](https://gsap.com) (ScrollTrigger et Flip), chargé depuis cdnjs.

## Voir le site

Ouvrez `index.html` dans un navigateur, ou lancez un petit serveur local dans ce dossier :

```bash
python -m http.server 5174
```

puis allez sur http://localhost:5174.

## Personnaliser

Tout se règle en haut de `app.js` :

- `CONFIG.whatsapp` : votre numéro WhatsApp, sans `+` ni espaces (par exemple `33612345678`). **À changer avant la mise en ligne**, sinon les commandes partent vers un faux numéro.
- `CONFIG.shopName`, `CONFIG.deliveryFee`, `CONFIG.freeDeliveryFrom` : nom de la boutique, frais de livraison et seuil de livraison offerte.
- `PRODUCTS` : noms, descriptions, prix et formats des yaourts.

Dans `index.html`, remplacez aussi les avis clients d'exemple, l'adresse et les horaires.

## Remplacer les photos

Les photos actuelles ont été **générées par IA** (FLUX, via Hugging Face et Cloudflare Workers AI) en attendant de vraies photos. Elles sont dans `images/`. Pour en changer une, enregistrez votre photo en JPG sous **le même nom**, à peu près aux mêmes proportions :

| Fichier | Où il apparaît | Taille conseillée (L × H) |
|---|---|---|
| `nature.jpg`, `vanille.jpg`, `fraise.jpg`, `mangue.jpg`, `myrtille.jpg`, `grecnat.jpg`, `grecmiel.jpg`, `coco.jpg`, `amande.jpg`, `boirefr.jpg` | Fiches du catalogue (le nom du fichier est l'`id` du produit dans `app.js`) | 896 × 1120 (portrait 4:5) |
| `accueil.jpg` | Grande photo en haut de page | 1344 × 768 (paysage) |
| `coffret.jpg` | Bloc « coffret découverte » | 1120 × 832 (paysage) |
| `etape-lait.jpg`, `etape-patience.jpg`, `etape-fruit.jpg` | Section « De la ferme au pot » | 896 × 1120 (portrait 4:5) |

Si un fichier manque, le site affiche à la place un fond crème avec le nom du produit.

Chaque photo porte une petite mention « Généré par IA ». Quand toutes les photos seront de vraies photos, supprimez dans `style.css` la règle précédée du commentaire « Mention sur les photos générées par IA ».

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page |
| `style.css` | Couleurs, polices et mise en page |
| `app.js` | Produits, panier, commande WhatsApp et animations |
| `images/` | Photos des produits, de l'accueil, du coffret et des étapes |
| `releases/` | Notes de chaque version et historique (`releases/README.md`) |
