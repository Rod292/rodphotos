'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ArrowUp, Heart } from '@phosphor-icons/react';
import { photos, categories } from '../data/photos';
import PhotoDetail from './PhotoDetail';
import FavoriteButton from './FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';

function getMasonryColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);

  items.forEach((item, index) => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push({ ...item, originalIndex: index });
    heights[shortest] += 1;
  });

  return columns;
}

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sourceRect, setSourceRect] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [columnCount, setColumnCount] = useState(4);
  const thumbnailRefs = useRef([]);
  const preloadedRef = useRef(new Set());
  const { favorites, toggle, isFavorite } = useFavorites();

  const allCategories = useMemo(() => {
    if (favorites.length === 0) return categories;
    return [...categories, { id: 'favorites', label: 'Favoris' }];
  }, [favorites.length]);

  const filteredImages = useMemo(() => {
    if (filter === 'all') return photos;
    if (filter === 'favorites') return photos.filter(img => favorites.includes(img.id));
    return photos.filter(img => img.category === filter);
  }, [filter, favorites]);

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      setColumnCount(window.innerWidth < 768 ? 2 : 4);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const masonryColumns = useMemo(
    () => getMasonryColumns(filteredImages, columnCount),
    [filteredImages, columnCount]
  );

  // Preload full-size image on hover for smooth FLIP animation
  const preloadFullImage = useCallback((photo) => {
    if (preloadedRef.current.has(photo.id)) return;
    preloadedRef.current.add(photo.id);

    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const isMobile = vw < 768;
    // PhotoDetail uses sizes="(max-width: 768px) 100vw, 50vw"
    const displayWidth = isMobile ? vw : vw * 0.5;
    const neededWidth = Math.round(displayWidth * dpr);
    const availableWidths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const targetWidth = availableWidths.find(w => w >= neededWidth) || availableWidths[availableWidths.length - 1];

    const img = new window.Image();
    img.src = `/_next/image?url=${encodeURIComponent(photo.path)}&w=${targetWidth}&q=75`;
  }, []);

  const openImage = useCallback((index) => {
    const el = thumbnailRefs.current[index];
    if (el) {
      const domRect = el.getBoundingClientRect();
      const imgEl = el.querySelector('img');
      const thumbSrc = imgEl?.currentSrc || null;
      console.log('[Gallery] openImage thumbSrc:', thumbSrc, 'imgEl:', imgEl, 'complete:', imgEl?.complete);
      setSourceRect({
        cx: domRect.x + domRect.width / 2,
        cy: domRect.y + domRect.height / 2,
        thumbWidth: domRect.width,
        thumbHeight: domRect.height,
        totalRotation: 0,
        thumbSrc,
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

  const prevPhoto = selectedIndex !== null && selectedIndex > 0
    ? filteredImages[selectedIndex - 1] : null;
  const nextPhoto = selectedIndex !== null && selectedIndex < filteredImages.length - 1
    ? filteredImages[selectedIndex + 1] : null;

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

  const handleImageError = useCallback((imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentCategoryLabel = allCategories.find(c => c.id === filter)?.label || 'Toutes';

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
          {allCategories.map(category => (
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
              <span className="relative z-10">
                {category.id === 'favorites' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Heart size={14} weight="fill" className="text-red-400" />
                    {category.label} ({favorites.length})
                  </span>
                ) : (
                  <>
                    {category.label}
                    <span className={`ml-1.5 ${filter === category.id ? 'text-zinc-500' : 'text-zinc-600'}`}>
                      {category.id === 'all' ? photos.length : photos.filter(p => p.category === category.id).length}
                    </span>
                  </>
                )}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <div aria-live="polite" className="sr-only">
          {filteredImages.length} photo{filteredImages.length > 1 ? 's' : ''} — {currentCategoryLabel}
        </div>

        {/* Masonry layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="flex gap-2 md:gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {masonryColumns.map((column, colIndex) => (
              <div key={colIndex} className="flex-1 flex flex-col gap-2 md:gap-3">
                {column.map((image, indexInColumn) => (
                  <motion.div
                    key={image.path}
                    ref={(el) => { thumbnailRefs.current[image.originalIndex] = el; }}
                    className="rounded-lg overflow-hidden cursor-pointer group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: (indexInColumn % 4) * 0.06 }}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => preloadFullImage(image)}
                    onTouchStart={() => preloadFullImage(image)}
                    onClick={() => openImage(image.originalIndex)}
                  >
                    {!imagesLoaded[image.id] && !imageErrors[image.id] && (
                      <div className="skeleton absolute inset-0" />
                    )}
                    {imageErrors[image.id] ? (
                      <div className="w-full aspect-[3/4] bg-zinc-900 flex items-center justify-center rounded-lg">
                        <div className="text-center text-zinc-600">
                          <svg className="mx-auto mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                          <p className="text-xs">Image indisponible</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={image.path}
                        alt={image.alt}
                        width={600}
                        height={800}
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        placeholder={image.blurDataURL ? 'blur' : 'empty'}
                        blurDataURL={image.blurDataURL}
                        onLoad={() => handleImageLoad(image.id)}
                        onError={() => handleImageError(image.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/30 transition-colors duration-500" />

                    {/* Favorite overlay */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FavoriteButton
                        isFavorite={isFavorite(image.id)}
                        onToggle={() => toggle(image.id)}
                        size={20}
                      />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="text-sm text-zinc-300 font-light tracking-wide">{image.alt}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredImages.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-zinc-500 text-lg font-light">
              {filter === 'favorites' ? 'Aucun favori pour le moment.' : 'Aucune image dans cette catégorie.'}
            </p>
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
            prevPhoto={prevPhoto}
            nextPhoto={nextPhoto}
            navigationInfo={`${selectedIndex + 1} / ${filteredImages.length}`}
            isFavorite={isFavorite(selectedImage.id)}
            onToggleFavorite={toggle}
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
