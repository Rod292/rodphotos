'use client';

import { motion } from 'motion/react';
import { fade } from './lib/motion';

// Unique fondu entre les pages : les pages elles-mêmes n'ajoutent pas d'animation d'entrée
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fade.base}
    >
      {children}
    </motion.div>
  );
}
