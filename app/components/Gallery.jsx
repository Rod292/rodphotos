'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

const imageData = [
  { name: 'A7403945.jpg', category: 'landscape', alt: 'Paysage naturel' },
  { name: 'A7404333.jpg', category: 'travel', alt: 'Voyage' },
  { name: 'A7407595.jpg', category: 'landscape', alt: 'Paysage' },
  { name: 'DSCF0726.jpg', category: 'street', alt: 'Photographie de rue' },
  { name: 'DSCF2813.jpg', category: 'portrait', alt: 'Portrait' },
  { name: 'DSCF5027.jpg', category: 'travel', alt: 'Voyage' },
  { name: 'DSCF5068.jpg', category: 'street', alt: 'Photographie de rue' },
  { name: 'DSCF5448.jpg', category: 'portrait', alt: 'Portrait' },
  { name: 'DSCF5470.jpg', category: 'landscape', alt: 'Paysage' },
  { name: 'DSCF5481.jpg', category: 'travel', alt: 'Voyage' },
  { name: 'DSCF5513.jpg', category: 'street', alt: 'Photographie de rue' },
  { name: 'DSCF5550.jpg', category: 'portrait', alt: 'Portrait' },
  { name: 'DSCF5660.jpg', category: 'landscape', alt: 'Paysage' },
  { name: 'DSCF7190.jpg', category: 'travel', alt: 'Voyage' },
  { name: 'DSCF7196.jpg', category: 'street', alt: 'Photographie de rue' },
  { name: 'DSCF7645.jpg', category: 'portrait', alt: 'Portrait' },
  { name: 'DSCF7749.jpg', category: 'landscape', alt: 'Paysage' },
  { name: 'IMG_9816.jpg', category: 'travel', alt: 'Voyage' },
].map(img => ({ ...img, path: `/photos/${img.name}` }));

const categories = [
  { id: 'all', label: 'Toutes' },
  { id: 'landscape', label: 'Paysages' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'street', label: 'Street' },
  { id: 'travel', label: 'Voyage' },
];

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const modalRef = useRef(null);

  const filteredImages = filter === 'all'
    ? imageData
    : imageData.filter(img => img.category === filter);

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  const openImage = (index) => {
    setSelectedIndex(index);
  };

  const closeImage = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Sync body overflow with modal state
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : '';
  }, [selectedIndex]);

  const goNext = useCallback(() => {
    setSelectedIndex(prev =>
      prev !== null ? (prev + 1) % filteredImages.length : null
    );
  }, [filteredImages.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex(prev =>
      prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
    );
  }, [filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape': closeImage(); break;
        case 'ArrowRight': goNext(); break;
        case 'ArrowLeft': goPrev(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeImage, goNext, goPrev]);

  // Focus modal on open
  useEffect(() => {
    if (selectedIndex !== null && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedIndex]);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.section
      className="min-h-screen w-full pt-24 pb-16 px-4 md:px-8 bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-light mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Galerie
        </motion.h1>

        <motion.div
          className="flex flex-wrap gap-2 md:gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors ${
                filter === category.id
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white border border-white/30 hover:border-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.path}
              className="aspect-[3/4] relative overflow-hidden rounded-lg cursor-pointer group"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              onClick={() => openImage(index)}
            >
              <Image
                src={image.path}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"

              />
            </motion.div>
          ))}
        </motion.div>

        {filteredImages.length === 0 && (
          <motion.p
            className="text-center text-gray-400 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Aucune image dans cette catégorie.
          </motion.p>
        )}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedImage.alt} — Image ${selectedIndex + 1} sur ${filteredImages.length}`}
            tabIndex={-1}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center outline-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImage}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white/50 hover:text-white z-10 p-2 transition-colors"
              onClick={closeImage}
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 p-2 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Image précédente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 p-2 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Image suivante"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image */}
            <div
              className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.path}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
                preload
              />
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm font-light tracking-wide">
              {selectedIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Gallery;
