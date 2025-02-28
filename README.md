# ROD Photos - Portfolio de Photographie

Un portfolio de photographie minimaliste et élégant, développé avec Next.js et Framer Motion.

## Technologies utilisées

- **Next.js** - Framework React pour le rendu côté serveur et la génération de sites statiques
- **React** - Bibliothèque JavaScript pour construire des interfaces utilisateur
- **Framer Motion** - Bibliothèque d'animations pour React
- **Tailwind CSS** - Framework CSS utilitaire pour un développement rapide
- **Next Image** - Optimisation automatique des images

## Fonctionnalités

- Affichage des photos en cercle rotatif sur la page d'accueil
- Galerie d'images avec vue en plein écran
- Design responsive pour mobile et desktop
- Animations fluides et élégantes
- Optimisation des performances avec Next.js

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/Rod292/rodphotos.git
cd rodphotos
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
rodphotos/
├── app/                  # Dossier principal de l'application Next.js
│   ├── components/       # Composants React
│   │   ├── About.jsx     # Page À propos
│   │   ├── Contact.jsx   # Page Contact
│   │   ├── Gallery.jsx   # Galerie de photos
│   │   ├── Header.jsx    # En-tête du site
│   │   └── Hero.jsx      # Section d'accueil avec cercle de photos
│   ├── styles/           # Styles CSS
│   │   └── globals.css   # Styles globaux avec Tailwind
│   ├── layout.js         # Layout principal de l'application
│   └── page.js           # Page d'accueil
├── public/               # Fichiers statiques
│   ├── photos/           # Photos du portfolio
│   └── profilepicture.JPG # Photo de profil
├── next.config.mjs       # Configuration Next.js
├── tailwind.config.js    # Configuration Tailwind CSS
└── package.json          # Dépendances et scripts
```

## Déploiement

Ce site est configuré pour être déployé sur Vercel. Pour déployer votre propre version :

1. Créez un compte sur [Vercel](https://vercel.com)
2. Connectez votre dépôt GitHub
3. Importez le projet
4. Configurez les variables d'environnement si nécessaire
5. Déployez !

## Personnalisation

### Ajouter des photos

1. Placez vos photos dans le dossier `public/photos/`
2. Mettez à jour les tableaux `imageNames` dans les composants `Hero.jsx` et `Gallery.jsx`

### Modifier les informations personnelles

Modifiez les informations dans le composant `About.jsx` pour personnaliser votre profil.

## Licence

Ce projet est sous licence ISC.

## Auteur

ROD - Photographe 