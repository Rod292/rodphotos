# ROADMAP — rodphotos.com

> Feuille de route des améliorations pour le site portfolio de ROD Photography.
> Organisée par phases et catégories. Cocher les cases au fur et à mesure de l'avancement.

---

## Phase 1 — Quick Wins (1-2 jours chacun)

### SEO & Métadonnées

- [x] **Ajouter un fichier `sitemap.xml` dynamique**
  - Priorité : Haute
  - Complexité : Faible
  - Fichiers : `app/sitemap.js` (à créer)
  - Générer automatiquement le sitemap via la convention Next.js App Router. Inclure toutes les pages (`/`, `/gallery`, `/about`, `/contact`) avec `lastModified` et `priority`.

- [x] **Ajouter un fichier `robots.txt`**
  - Priorité : Haute
  - Complexité : Faible
  - Fichiers : `app/robots.js` (à créer)
  - Autoriser l'indexation complète et référencer le sitemap.

- [x] **Ajouter les métadonnées Open Graph et Twitter Card**
  - Priorité : Haute
  - Complexité : Faible
  - Fichiers : `app/layout.js`, `app/gallery/page.js`, `app/about/page.js`, `app/contact/page.js`
  - Ajouter `openGraph` et `twitter` dans chaque export `metadata` pour un meilleur partage sur les réseaux sociaux (titre, description, image preview).

- [x] **Ajouter les données structurées JSON-LD**
  - Priorité : Moyenne
  - Complexité : Faible
  - Fichiers : `app/layout.js`, `app/gallery/page.js`
  - Schema.org `Person` (photographe), `ImageGallery`, `WebSite`. Injecter via `<script type="application/ld+json">`.

### Performance

- [x] **Convertir les images en WebP/AVIF**
  - Priorité : Haute
  - Complexité : Faible
  - Fichiers : `next.config.mjs`
  - Configurer `images.formats: ['image/avif', 'image/webp']` dans la config Next.js pour servir automatiquement les formats modernes.

- [x] **Ajouter le lazy loading explicite sur les images de la galerie**
  - Priorité : Moyenne
  - Complexité : Faible
  - Fichiers : `app/components/Gallery.jsx`
  - S'assurer que `loading="lazy"` est appliqué sur toutes les images sauf les premières visibles. Ajouter `placeholder="blur"` avec `blurDataURL` pour un effet de chargement progressif.

- [x] **Optimiser le LCP (Largest Contentful Paint) du Hero**
  - Priorité : Haute
  - Complexité : Faible
  - Fichiers : `app/components/Hero.jsx`
  - Vérifier que les 1-2 premières images du carousel ont `priority={true}` et `fetchPriority="high"`. Précharger via `<link rel="preload">` si nécessaire.

### Accessibilité

- [x] **Ajouter les attributs `aria-live` pour les transitions de la galerie**
  - Priorité : Moyenne
  - Complexité : Faible
  - Fichiers : `app/components/Gallery.jsx`, `app/components/PhotoDetail.jsx`
  - Annoncer le changement de photo aux lecteurs d'écran lors de la navigation.

- [x] **Améliorer le piège de focus dans la modale PhotoDetail**
  - Priorité : Moyenne
  - Complexité : Faible
  - Fichiers : `app/components/PhotoDetail.jsx`
  - Implémenter un focus trap pour que la navigation au clavier reste confinée dans la modale ouverte (Tab/Shift+Tab).

- [x] **Ajouter `skip to content` link**
  - Priorité : Faible
  - Complexité : Faible
  - Fichiers : `app/layout.js`
  - Lien caché visible au focus pour sauter directement au contenu principal.

### Design & UX

- [x] **Ajouter une animation de chargement (skeleton/spinner)**
  - Priorité : Moyenne
  - Complexité : Faible
  - Fichiers : `app/components/Gallery.jsx`, `app/components/Hero.jsx`
  - Afficher des placeholders pendant le chargement des images pour éviter les sauts de layout (CLS).

- [x] **Ajouter un bouton "retour en haut" sur la galerie**
  - Priorité : Faible
  - Complexité : Faible
  - Fichiers : `app/components/Gallery.jsx`
  - Bouton flottant apparaissant après scroll, avec animation smooth scroll.

---

## Phase 2 — Moyen terme (quelques jours chacun)

### SEO & Métadonnées

- [ ] **Créer des pages individuelles par photo (`/gallery/[id]`)**
  - Priorité : Haute
  - Complexité : Moyenne
  - Fichiers : `app/gallery/[id]/page.js` (à créer), `app/data/photos.js`
  - Chaque photo a sa propre URL indexable avec métadonnées uniques (title, description, OG image). Permet le partage direct d'une photo et améliore considérablement le SEO images.

- [ ] **Ajouter des pages par catégorie (`/gallery/landscape`, etc.)**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/gallery/[category]/page.js` (à créer)
  - URLs dédiées par catégorie avec métadonnées spécifiques. Améliore le maillage interne et le SEO.

### Photo & Galerie

- [ ] **Ajouter un mode diaporama automatique**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/components/PhotoDetail.jsx`
  - Bouton play/pause dans le viewer pour faire défiler les photos automatiquement (intervalle configurable ~5s). Pause au survol ou interaction.

- [ ] **Ajouter le support des gestes tactiles dans PhotoDetail**
  - Priorité : Haute
  - Complexité : Moyenne
  - Fichiers : `app/components/PhotoDetail.jsx`
  - Swipe gauche/droite pour naviguer entre les photos sur mobile. Utiliser les Pan gestures de Motion déjà disponible dans le projet.

- [ ] **Ajouter un zoom sur les photos (pinch-to-zoom / scroll zoom)**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/components/PhotoDetail.jsx`
  - Permettre de zoomer dans les détails d'une photo en plein écran. Double-tap pour zoom 2x sur mobile.

- [ ] **Ajouter un système de favoris (localStorage)**
  - Priorité : Faible
  - Complexité : Moyenne
  - Fichiers : `app/components/Gallery.jsx`, `app/components/PhotoDetail.jsx`
  - Icône coeur sur chaque photo, sauvegarde en localStorage, filtre "Favoris" dans la galerie.

- [ ] **Galerie infinie / pagination**
  - Priorité : Faible (peu de photos actuellement)
  - Complexité : Moyenne
  - Fichiers : `app/components/Gallery.jsx`, `app/data/photos.js`
  - Charger les photos par lots de 12-20 avec Intersection Observer pour le scroll infini. Utile quand le portfolio grandira.

### Performance

- [ ] **Ajouter un Service Worker pour le cache offline**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `public/sw.js` (à créer), `app/layout.js`
  - Cache des pages visitées et des images pour consultation hors-ligne. Précache des assets critiques.

- [ ] **Implémenter le prefetch intelligent des images adjacentes**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/components/PhotoDetail.jsx`, `app/components/Gallery.jsx`
  - Quand une photo est ouverte, précharger les images précédente/suivante pour une navigation instantanée.

- [ ] **Ajouter des headers de cache optimisés**
  - Priorité : Moyenne
  - Complexité : Faible
  - Fichiers : `next.config.mjs`
  - Configurer `Cache-Control` avec immutable pour les assets statiques (images, fonts, JS/CSS).

### Engagement & Contact

- [ ] **Ajouter les liens réseaux sociaux dans le footer**
  - Priorité : Haute
  - Complexité : Faible
  - Fichiers : `app/components/Footer.jsx` (à créer), `app/layout.js`
  - Footer avec liens Instagram, email, et éventuellement d'autres réseaux. Présent sur toutes les pages.

- [ ] **Ajouter un bouton de partage sur chaque photo**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/components/PhotoDetail.jsx`
  - Utiliser l'API Web Share (mobile) ou copier le lien (desktop). Options : partager sur Instagram, WhatsApp, copier le lien.

- [ ] **Ajouter une page témoignages / avis clients**
  - Priorité : Faible
  - Complexité : Moyenne
  - Fichiers : `app/testimonials/page.js` (à créer), `app/data/testimonials.js` (à créer)
  - Carrousel ou grille de témoignages avec nom, photo, et citation. Renforce la crédibilité.

### Design & UX

- [ ] **Ajouter un mode clair / sombre (theme toggle)**
  - Priorité : Faible
  - Complexité : Moyenne
  - Fichiers : `app/layout.js`, `app/styles/globals.css`, `app/components/Header.jsx`
  - Toggle dans le header, sauvegarde de la préférence en localStorage, respect de `prefers-color-scheme`.

- [ ] **Ajouter des transitions de page (page transitions)**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/layout.js`, `app/components/` (nouveau composant wrapper)
  - Utiliser Motion pour animer les transitions entre pages (fade, slide). Renforce le côté premium du portfolio.

- [ ] **Améliorer la galerie avec un layout Masonry dynamique**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/components/Gallery.jsx`
  - Remplacer le CSS columns par un vrai layout masonry calculé (ou CSS `masonry-layout` quand supporté) pour un contrôle plus fin de l'ordre et des tailles.

---

## Phase 3 — Long terme (projets plus conséquents)

### Commerce & Monétisation

- [ ] **Ajouter une boutique de tirages (e-commerce léger)**
  - Priorité : Moyenne
  - Complexité : Haute
  - Fichiers : `app/shop/` (à créer), `app/components/ShopItem.jsx` (à créer)
  - Catalogue de tirages avec choix de format/support (poster, toile, encadré). Intégration Stripe Checkout pour le paiement. Page de confirmation de commande.

- [ ] **Système de demande de devis pour prestations**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/booking/page.js` (à créer), `app/api/booking/route.js` (à créer)
  - Formulaire dédié pour les demandes de shooting (mariage, portrait, événement) avec choix de prestation, date, et budget. Envoi par email via Resend.

- [ ] **Ajouter le téléchargement de photos en haute résolution (payant)**
  - Priorité : Faible
  - Complexité : Haute
  - Fichiers : `app/api/download/route.js` (à créer)
  - Licence numérique avec téléchargement sécurisé après paiement. Filigrane sur les previews, version HD protégée.

### Admin & Gestion de contenu

- [ ] **Créer un CMS headless pour gérer les photos**
  - Priorité : Moyenne
  - Complexité : Haute
  - Fichiers : `app/data/photos.js` (remplacer), intégration API externe
  - Migrer les données photos vers un CMS (Sanity, Strapi, ou Contentful) pour ajouter/modifier des photos sans toucher au code. Interface d'upload avec redimensionnement automatique.

- [ ] **Ajouter un dashboard analytics intégré**
  - Priorité : Faible
  - Complexité : Haute
  - Fichiers : `app/admin/` (à créer)
  - Dashboard protégé affichant les stats du site : pages vues, photos les plus consultées, soumissions de formulaire. Intégration Vercel Analytics ou Plausible.

- [ ] **Ajouter un système de blog**
  - Priorité : Faible
  - Complexité : Haute
  - Fichiers : `app/blog/` (à créer), MDX ou CMS
  - Articles sur les coulisses des shootings, conseils photo, récits de voyage. Bon pour le SEO et l'engagement. Support MDX pour mélanger markdown et composants React.

### Performance avancée

- [ ] **Implémenter l'ISR (Incremental Static Regeneration)**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `app/gallery/[id]/page.js`, `next.config.mjs`
  - Pré-générer les pages photos en statique avec revalidation périodique. Temps de chargement quasi-instantané.

- [ ] **Ajouter un CDN dédié pour les images (Cloudinary / imgix)**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `next.config.mjs`, `app/data/photos.js`
  - Servir les images depuis un CDN spécialisé avec transformations à la volée (resize, crop, format). Réduit la bande passante et accélère le chargement.

### Accessibilité avancée

- [ ] **Audit WCAG 2.1 AA complet et corrections**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : tous les composants
  - Passer un audit complet (axe-core, Lighthouse Accessibility). Corriger les éventuels problèmes de contraste, rôles ARIA manquants, navigation clavier incomplète.

- [ ] **Ajouter le support `prefers-reduced-motion`**
  - Priorité : Moyenne
  - Complexité : Faible
  - Fichiers : `app/components/Hero.jsx`, `app/components/PhotoDetail.jsx`, `app/components/Header.jsx`
  - Désactiver ou réduire les animations (carousel, FLIP, spring) pour les utilisateurs qui préfèrent moins de mouvement. Utiliser `useReducedMotion()` de Motion.

- [ ] **Internationalisation (i18n) — français / anglais**
  - Priorité : Faible
  - Complexité : Haute
  - Fichiers : `app/[locale]/` (restructuration), `messages/` (à créer)
  - Support multilingue avec next-intl ou next-i18next. Détection automatique de la langue, switcher dans le header. Traduction de tout le contenu statique.

### Tests & CI/CD

- [ ] **Ajouter une suite de tests (unit + integration)**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `__tests__/` (à créer), `package.json`
  - Configurer Vitest + React Testing Library. Tests des composants clés (Gallery, Contact form, PhotoDetail). Tests de l'API contact.

- [ ] **Configurer un pipeline CI/CD (GitHub Actions)**
  - Priorité : Moyenne
  - Complexité : Moyenne
  - Fichiers : `.github/workflows/ci.yml` (à créer)
  - Lint, tests, build, et Lighthouse CI sur chaque PR. Déploiement automatique sur Vercel.

- [ ] **Ajouter des tests E2E (Playwright)**
  - Priorité : Faible
  - Complexité : Moyenne
  - Fichiers : `e2e/` (à créer), `playwright.config.js` (à créer)
  - Scénarios de navigation complète : parcourir la galerie, ouvrir une photo, envoyer le formulaire de contact.

---

## Récapitulatif par priorité

| Priorité | Feature | Phase |
|----------|---------|-------|
| Haute | Sitemap dynamique | 1 |
| Haute | robots.txt | 1 |
| Haute | Open Graph / Twitter Cards | 1 |
| Haute | Images WebP/AVIF | 1 |
| Haute | Optimiser le LCP du Hero | 1 |
| Haute | Pages individuelles par photo | 2 |
| Haute | Gestes tactiles PhotoDetail | 2 |
| Haute | Footer avec réseaux sociaux | 2 |
| Moyenne | JSON-LD données structurées | 1 |
| Moyenne | Lazy loading galerie | 1 |
| Moyenne | ARIA live transitions | 1 |
| Moyenne | Focus trap modale | 1 |
| Moyenne | Skeleton loading | 1 |
| Moyenne | Pages par catégorie | 2 |
| Moyenne | Diaporama automatique | 2 |
| Moyenne | Zoom photo | 2 |
| Moyenne | Service Worker offline | 2 |
| Moyenne | Prefetch images adjacentes | 2 |
| Moyenne | Cache headers | 2 |
| Moyenne | Bouton partage | 2 |
| Moyenne | Transitions de page | 2 |
| Moyenne | Masonry dynamique | 2 |
| Moyenne | Boutique tirages | 3 |
| Moyenne | Devis prestations | 3 |
| Moyenne | CMS headless | 3 |
| Moyenne | ISR | 3 |
| Moyenne | CDN images | 3 |
| Moyenne | Audit WCAG | 3 |
| Moyenne | `prefers-reduced-motion` | 3 |
| Moyenne | Tests unitaires | 3 |
| Moyenne | CI/CD pipeline | 3 |
| Faible | Skip to content | 1 |
| Faible | Bouton retour en haut | 1 |
| Faible | Favoris localStorage | 2 |
| Faible | Pagination / scroll infini | 2 |
| Faible | Témoignages clients | 2 |
| Faible | Mode clair / sombre | 2 |
| Faible | Téléchargement HD payant | 3 |
| Faible | Dashboard analytics | 3 |
| Faible | Blog | 3 |
| Faible | Internationalisation | 3 |
| Faible | Tests E2E | 3 |

---

## Stack technique actuelle (référence)

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, Tailwind CSS 4, Motion 12
- **Icônes** : Phosphor Icons
- **Email** : Resend
- **Déploiement** : Vercel
- **Données** : Fichier statique `app/data/photos.js` (20 photos)
