'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ArrowUp } from '@phosphor-icons/react';
import { photos, categories } from '../data/photos';
import PhotoDetail from './PhotoDetail';

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sourceRect, setSourceRect] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const thumbnailRefs = useRef([]);

  const filteredImages = filter === 'all'
    ? photos
    : photos.filter(img => img.category === filter);

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  const openImage = useCallback((index) => {
    const el = thumbnailRefs.current[index];
    if (el) {
      const domRect = el.getBoundingClientRect();
      setSourceRect({
        cx: domRect.x + domRect.width / 2,
        cy: domRect.y + domRect.height / 2,
        thumbWidth: domRect.width,
        thumbHeight: domRect.height,
        totalRotation: 0,
      });
    }
    setSelectedIndex(index);
  }, []);

  const closeImage = useCallback(() => {
    setSelectedIndex(null);
    setSourceRect(null);
  }, []);

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
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset loaded images when filter changes
  useEffect(() => {
    setImagesLoaded({});
  }, [filter]);

  const handleImageLoad = useCallback((imageId) => {
    setImagesLoaded(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentCategoryLabel = categories.find(c => c.id === filter)?.label || 'Toutes';

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
          role="toolbar"
          aria-label="Filtrer par catégorie"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setFilter(category.id)}
              aria-pressed={filter === category.id}
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

        <div aria-live="polite" className="sr-only">
          {filteredImages.length} photo{filteredImages.length > 1 ? 's' : ''} — {currentCategoryLabel}
        </div>

        <div
          key={filter}
          className="columns-2 md:columns-4 gap-2 md:gap-3"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.path}
              ref={(el) => { thumbnailRefs.current[index] = el; }}
              className="mb-2 md:mb-3 break-inside-avoid rounded-lg overflow-hidden cursor-pointer group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: Math.min(index * 0.04, 0.8) }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openImage(index)}
            >
              {!imagesLoaded[image.id] && (
                <div className="skeleton absolute inset-0" />
              )}
              <Image
                src={image.path}
                alt={image.alt}
                width={600}
                height={800}
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                onLoad={() => handleImageLoad(image.id)}
              />
              <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/30 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <p className="text-sm text-zinc-300 font-light tracking-wide">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>

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

      <AnimatePresence>
        {selectedImage && (
          <PhotoDetail
            photo={selectedImage}
            sourceRect={sourceRect}
            onClose={closeImage}
            onNext={goNext}
            onPrev={goPrev}
            navigationInfo={`${selectedIndex + 1} / ${filteredImages.length}`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Retour en haut"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={22} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Gallery;
