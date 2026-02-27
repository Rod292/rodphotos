'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import { categories, getPhotosByCategory } from '../../data/photos';
import PhotoDetail from '../../components/PhotoDetail';
import FavoriteButton from '../../components/FavoriteButton';
import { useFavorites } from '../../hooks/useFavorites';

const CategoryPage = ({ slug }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sourceRect, setSourceRect] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const thumbnailRefs = useRef([]);
  const { toggle, isFavorite } = useFavorites();

  const category = categories.find(c => c.id === slug);
  const filteredImages = getPhotosByCategory(slug);
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

  const handleImageLoad = useCallback((imageId) => {
    setImagesLoaded(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const handleImageError = useCallback((imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const prevPhoto = selectedIndex !== null && selectedIndex > 0 ? filteredImages[selectedIndex - 1] : null;
  const nextPhoto = selectedIndex !== null && selectedIndex < filteredImages.length - 1 ? filteredImages[selectedIndex + 1] : null;

  return (
    <motion.section
      className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-zinc-950 text-zinc-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm tracking-wide"
          >
            <ArrowLeft size={18} weight="light" />
            Toutes les photos
          </Link>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl tracking-tighter leading-none mb-8 md:mb-12 font-light"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {category?.label || slug}
        </motion.h1>

        <div className="columns-2 md:columns-4 gap-2 md:gap-3">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.path}
              ref={(el) => { thumbnailRefs.current[index] = el; }}
              className="mb-2 md:mb-3 break-inside-avoid rounded-lg overflow-hidden cursor-pointer group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: (index % 4) * 0.06 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openImage(index)}
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
            isFavorite={selectedImage ? isFavorite(selectedImage.id) : false}
            onToggleFavorite={toggle}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default CategoryPage;
