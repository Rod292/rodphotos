# Portfolio de Photographie ROD

Ce projet est un portfolio de photographie construit avec React et Vite.

## Problème résolu

Le projet avait des problèmes de chargement d'images en production, principalement dus à:

1. **Chemins d'images relatifs**: Les chemins d'images utilisaient `import.meta.glob('../../photos/*.jpg')` qui fonctionnait en développement mais pas en production.
2. **Configuration de base URL manquante**: Vite n'avait pas de configuration `base` définie, ce qui causait des problèmes avec les chemins d'assets en production.

## Solutions implémentées

1. **Chemins d'images robustes**: Implémentation d'une approche à deux niveaux pour charger les images:
   - Tentative avec un chemin absolu: `/photos/*.jpg`
   - Fallback sur le chemin relatif: `../../photos/*.jpg`
   - Ajout de logs détaillés pour déboguer le chargement des images

2. **Configuration Vite optimisée**:
   - Ajout de `base: './'` pour utiliser des chemins relatifs
   - Configuration de sourcemaps pour faciliter le débogage
   - Optimisation du build avec chunking pour les dépendances

3. **Gestion des ressources statiques**:
   - Les images sont maintenant correctement référencées et chargées

## Déploiement

Pour déployer ce projet:

1. Cloner le dépôt
2. Installer les dépendances: `npm install`
3. Lancer en développement: `npm run dev`
4. Construire pour la production: `npm run build`
5. Tester la build localement: `npm run preview`

Pour déployer sur Vercel:
- Connecter le dépôt GitHub à Vercel
- Utiliser les paramètres de build par défaut
- Vérifier que le dossier de sortie est configuré sur `dist`

## Structure du projet

- `/src` - Code source React
- `/photos` - Images du portfolio
- `/dist` - Build de production
- `vite.config.js` - Configuration de Vite

## Remarques importantes

- Les chemins d'images sont maintenant gérés de manière robuste avec une approche de fallback
- Les logs de débogage ont été ajoutés pour faciliter le diagnostic des problèmes
- La configuration de build a été optimisée pour la production

## Fonctionnalités

- Design minimaliste et élégant
- Animations fluides avec Framer Motion
- Affichage circulaire des photos sur la page d'accueil
- Galerie de photos avec filtrage par catégorie
- Mode clair/sombre automatique
- Formulaire de contact interactif
- Complètement responsive

## Technologies utilisées

- React 18
- Vite (pour le développement rapide)
- Framer Motion (pour les animations)
- TailwindCSS (pour le styling)
- PostCSS & Autoprefixer

## Comment démarrer

1. Clonez ce dépôt
2. Installez les dépendances :
   ```
   npm install
   ```
3. Lancez le serveur de développement :
   ```
   npm run dev
   ```
4. Ouvrez votre navigateur à l'adresse indiquée (généralement http://localhost:5173)

## Construire pour la production

```
npm run build
```

Les fichiers optimisés pour la production seront générés dans le dossier `dist`.

## Structure du projet

- `/src` - Code source principal
  - `/components` - Composants React réutilisables
  - `/styles` - Fichiers CSS et configuration TailwindCSS
- `/public` - Fichiers statiques comme le favicon
- `/photos` - Images du portfolio

## License

ISC 