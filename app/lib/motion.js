// Réglages d'animation partagés : trois ressorts et deux fondus pour tout le site,
// afin que chaque mouvement ait le même rythme.

export const spring = {
  // Retours d'état immédiats : boutons, pastilles, soulignement du menu
  snappy: { type: 'spring', stiffness: 400, damping: 35 },
  // Déplacements d'éléments : grille, glissement de photo
  smooth: { type: 'spring', stiffness: 260, damping: 30 },
  // Grands mouvements : ouverture / fermeture de la visionneuse
  gentle: { type: 'spring', stiffness: 180, damping: 26 },
};

export const fade = {
  fast: { duration: 0.15, ease: 'easeOut' },
  base: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};
