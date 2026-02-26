'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from '@phosphor-icons/react';

const PhotoDetail = ({ photo, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close button */}
      <motion.button
        className="absolute top-6 right-6 z-20 text-zinc-400 hover:text-white p-2 transition-colors"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Fermer"
      >
        <X size={28} weight="light" />
      </motion.button>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:mx-8 overflow-y-auto md:overflow-hidden">
        {/* Photo with flip animation */}
        <div
          className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-[80vh] flex-shrink-0"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            className="w-full h-full relative"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            <Image
              src={photo.path}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Details */}
        <motion.div
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-white"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.15 }}
        >
          <h2 className="text-3xl font-light tracking-tight mb-4">{photo.title}</h2>
          <p className="text-zinc-400 font-light leading-relaxed mb-8">{photo.description}</p>

          {photo.technical && (
            <div className="mb-8 space-y-2">
              <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-3">Détails techniques</h3>
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-300">Appareil</span> — {photo.technical.camera}
              </p>
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-300">Objectif</span> — {photo.technical.lens}
              </p>
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-300">ISO</span> — {photo.technical.iso}
              </p>
            </div>
          )}

          {photo.purchaseUrl ? (
            <a
              href={photo.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-center self-start"
            >
              Acheter un tirage
            </a>
          ) : (
            <Link
              href={`/contact?photo=${photo.id}`}
              className="btn-primary inline-block text-center self-start"
            >
              Demander un tirage
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PhotoDetail;
