'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const imageNames = [
  'A7403945.jpg', 'A7404333.jpg', 'A7407595.jpg',
  'DSCF0726.jpg', 'DSCF2813.jpg', 'DSCF5027.jpg',
  'DSCF5068.jpg', 'DSCF5448.jpg', 'DSCF5470.jpg',
  'DSCF5481.jpg', 'DSCF5513.jpg', 'DSCF5550.jpg',
  'DSCF5660.jpg', 'DSCF7190.jpg', 'DSCF7196.jpg',
  'DSCF7645.jpg', 'DSCF7749.jpg', 'IMG_9816.jpg'
];

const images = imageNames.map(name => `/photos/${name}`);

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (imagePath) => {
    setSelectedImage(imagePath);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.section
      className="min-h-screen w-full pt-32 pb-24 px-6 md:px-12 section-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="section-title">Galerie</h1>
          <div className="divider" />
        </motion.div>

        {/* Image Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {images.map((imagePath, index) => (
            <motion.div
              key={imagePath}
              className="gallery-image aspect-[3/4] relative overflow-hidden cursor-crosshair group"
              variants={itemVariants}
              onClick={() => openImage(imagePath)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={imagePath}
                alt={`Photographie ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                loading="lazy"
                className="transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              {/* Border effect */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeImage}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 text-white/60 hover:text-white z-10 p-2 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Fermer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Image */}
            <motion.div
              className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={selectedImage}
                alt="Photo en plein écran"
                fill
                sizes="100vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-body tracking-wide">
              {images.indexOf(selectedImage) + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Gallery;
