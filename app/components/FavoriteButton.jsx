'use client';

import { motion } from 'motion/react';
import { Heart } from '@phosphor-icons/react';

// `overlay` : posé sur une photo — fond sombre pour rester lisible sur une image claire
// et zone de tap de 44px pour le tactile
const FavoriteButton = ({ isFavorite, onToggle, size = 22, overlay = false, className = '' }) => {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`inline-flex items-center justify-center transition-colors ${
        overlay
          ? 'w-11 h-11 rounded-full bg-zinc-950/40 backdrop-blur-sm text-zinc-100 hover:text-red-400'
          : 'text-zinc-400 hover:text-red-400'
      } ${className}`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      whileTap={{ scale: 0.85 }}
    >
      <Heart
        size={size}
        weight={isFavorite ? 'fill' : 'light'}
        className={isFavorite ? 'text-red-400' : ''}
      />
    </motion.button>
  );
};

export default FavoriteButton;
