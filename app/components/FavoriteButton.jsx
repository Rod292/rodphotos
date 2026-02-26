'use client';

import { motion } from 'motion/react';
import { Heart } from '@phosphor-icons/react';

const FavoriteButton = ({ isFavorite, onToggle, size = 22, className = '' }) => {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`text-zinc-400 hover:text-red-400 transition-colors ${className}`}
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
