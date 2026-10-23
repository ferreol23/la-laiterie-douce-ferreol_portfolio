# La Laiterie Douce

Site de vente de yaourts fermiers faits main : catalogue, panier et commande envoyée par WhatsApp (paiement à la réception).

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
- `PRODUCTS` : noms, descriptions, prix et couleurs des yaourts.
- `HERO_FLAVORS` : les parfums montrés dans le grand carrousel du haut.

Dans `index.html`, remplacez aussi les avis clients d'exemple, l'adresse et les horaires.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page |
| `style.css` | Couleurs, polices et mise en page |
| `app.js` | Produits, panier, commande WhatsApp et animations |
| `releases/` | Notes de chaque version |
