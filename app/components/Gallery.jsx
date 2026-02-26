'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react';

const imageData = [
  { name: 'A7403945.jpg', category: 'landscape', alt: 'Paysage naturel', span: 'col-span-2 row-span-2' },
  { name: 'A7404333.jpg', category: 'travel', alt: 'Voyage', span: '' },
  { name: 'A7407595.jpg', category: 'landscape', alt: 'Paysage', span: '' },
  { name: 'DSCF0726.jpg', category: 'street', alt: 'Photographie de rue', span: '' },
  { name: 'DSCF2813.jpg', category: 'portrait', alt: 'Portrait', span: 'col-span-2 row-span-2' },
  { name: 'DSCF5027.jpg', category: 'travel', alt: 'Voyage', span: '' },
  { name: 'DSCF5068.jpg', category: 'street', alt: 'Photographie de rue', span: '' },
  { name: 'DSCF5448.jpg', category: 'portrait', alt: 'Portrait', span: '' },
  { name: 'DSCF5470.jpg', category: 'landscape', alt: 'Paysage', span: 'col-span-2 row-span-2' },
  { name: 'DSCF5481.jpg', category: 'travel', alt: 'Voyage', span: '' },
  { name: 'DSCF5513.jpg', category: 'street', alt: 'Photographie de rue', span: '' },
  { name: 'DSCF5550.jpg', category: 'portrait', alt: 'Portrait', span: '' },
  { name: 'DSCF5660.jpg', category: 'landscape', alt: 'Paysage', span: '' },
  { name: 'DSCF7190.jpg', category: 'travel', alt: 'Voyage', span: '' },
  { name: 'DSCF7196.jpg', category: 'street', alt: 'Photographie de rue', span: 'col-span-2 row-span-2' },
  { name: 'DSCF7645.jpg', category: 'portrait', alt: 'Portrait', span: '' },
  { name: 'DSCF7749.jpg', category: 'landscape', alt: 'Paysage', span: '' },
  { name: 'IMG_9816.jpg', category: 'travel', alt: 'Voyage', span: '' },
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

  useEffect(() => {
    if (selectedIndex !== null && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedIndex]);

  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.section
      className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-zinc-950 text-zinc-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl tracking-tighter leading-none mb-8 md:mb-12 font-light"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          Galerie
        </motion.h1>

        <motion.div
          className="flex flex-wrap gap-2 md:gap-3 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`relative px-5 py-2 rounded-full text-sm tracking-wide transition-colors ${
                filter === category.id
                  ? 'text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {filter === category.id && (
                <motion.span
                  className="absolute inset-0 bg-zinc-100 rounded-full"
                  layoutId="filter-pill"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[200px] md:auto-rows-[280px]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.path}
                className={`relative overflow-hidden rounded-lg cursor-pointer group ${image.span || ''}`}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                }}
                layout
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onClick={() => openImage(index)}
              >
                <Image
                  src={image.path}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/30 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <p className="text-sm text-zinc-300 font-light tracking-wide">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-zinc-500 text-lg font-light">Aucune image dans cette categorie.</p>
          </motion.div>
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
            className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center outline-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeImage}
          >
            {/* Close */}
            <motion.button
              className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-100 z-10 p-2 transition-colors"
              onClick={closeImage}
              aria-label="Fermer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <X size={28} weight="light" />
            </motion.button>

            {/* Previous */}
            <motion.button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-100 z-10 p-2 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Image precedente"
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CaretLeft size={36} weight="light" />
            </motion.button>

            {/* Next */}
            <motion.button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-100 z-10 p-2 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Image suivante"
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CaretRight size={36} weight="light" />
            </motion.button>

            {/* Image */}
            <motion.div
              className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center p-12"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <Image
                src={selectedImage.path}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-600 text-sm font-light tracking-widest">
              {selectedIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Gallery;
