'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ArrowUp, Heart } from '@phosphor-icons/react';
import { photos, categories } from '../data/photos';
import PhotoDetail from './PhotoDetail';
import FavoriteButton from './FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';
import { useLightboxHistory } from '../hooks/useLightboxHistory';
import { spring, fade } from '../lib/motion';

function subscribeResize(callback) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
const getColumnCount = () => (window.innerWidth < 768 ? 2 : 4);
const getServerColumnCount = () => 4;

// Maçonnerie calculée à partir du format réel de chaque photo. Les positions sont
// exprimées en largeur de colonne (--col-w, en unités de container query) : pas de
// mesure JS, rendu serveur possible, et chaque vignette garde le même parent,
// ce qui permet d'animer son déplacement quand le filtre change.
function getMasonryLayout(items, columnCount, gap) {
  const colRatios = new Array(columnCount).fill(0);
  const colCounts = new Array(columnCount).fill(0);

  const positions = items.map((item) => {
    const col = colRatios.indexOf(Math.min(...colRatios));
    const ratio = item.height / item.width;
    const position = {
      left: `calc(${col} * (var(--col-w) + ${gap}px))`,
      top: `calc(${colRatios[col]} * var(--col-w) + ${colCounts[col] * gap}px)`,
      width: 'var(--col-w)',
      height: `calc(${ratio} * var(--col-w))`,
    };
    colRatios[col] += ratio;
    colCounts[col] += 1;
    return position;
  });

  const columnHeights = colRatios
    .map((r, i) => `calc(${r} * var(--col-w) + ${Math.max(0, colCounts[i] - 1) * gap}px)`);

  return {
    positions,
    containerStyle: {
      '--col-w': `calc((100cqw - ${(columnCount - 1) * gap}px) / ${columnCount})`,
      height: `max(${columnHeights.join(', ')})`,
    },
  };
}

const Gallery = ({ initialFilter = 'all' }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const columnCount = useSyncExternalStore(subscribeResize, getColumnCount, getServerColumnCount);
  const thumbnailRefs = useRef({});
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

  // Vignette masquée tant que sa photo est dans la visionneuse (y compris pendant le
  // retour) : la photo revient se poser dans un emplacement vide
  const [hiddenPhotoId, setHiddenPhotoId] = useState(null);
  if (selectedImage && hiddenPhotoId !== selectedImage.id) {
    setHiddenPhotoId(selectedImage.id);
  }

  const changeFilter = useCallback((id) => {
    setFilter(id);
    const url = id === 'all' || id === 'favorites' ? '/gallery' : `/gallery/${id}`;
    window.history.replaceState(null, '', url);
  }, []);

  const gap = columnCount === 2 ? 8 : 12;
  const masonry = useMemo(
    () => getMasonryLayout(filteredImages, columnCount, gap),
    [filteredImages, columnCount, gap]
  );

  // Précharge l'image pleine taille au survol pour une ouverture fluide
  const preloadFullImage = useCallback((photo) => {
    if (preloadedRef.current.has(photo.id)) return;
    preloadedRef.current.add(photo.id);

    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    // PhotoDetail utilise sizes="(max-width: 768px) 100vw, 50vw"
    const displayWidth = vw < 768 ? vw : vw * 0.5;
    const neededWidth = Math.round(displayWidth * dpr);
    const availableWidths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const targetWidth = availableWidths.find(w => w >= neededWidth) || availableWidths[availableWidths.length - 1];

    const img = new window.Image();
    img.src = `/_next/image?url=${encodeURIComponent(photo.path)}&w=${targetWidth}&q=75`;
  }, []);

  // Position de la vignette à l'écran : point de départ / d'arrivée de la visionneuse
  const getThumbnailRect = useCallback((photoId) => {
    const el = thumbnailRefs.current[photoId];
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      cx: rect.x + rect.width / 2,
      cy: rect.y + rect.height / 2,
      width: rect.width,
      height: rect.height,
      rotation: 0,
      src: el.querySelector('img')?.currentSrc || null,
    };
  }, []);

  const handleClosed = useCallback(() => setSelectedIndex(null), []);
  const closeImage = useLightboxHistory(selectedImage?.id, handleClosed);

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

  // En naviguant dans la visionneuse, la grille défile en arrière-plan pour garder la
  // vignette de la photo affichée à l'écran : la fermeture peut toujours y revenir
  useEffect(() => {
    if (!selectedImage) return;
    const el = thumbnailRefs.current[selectedImage.id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 80;
    if (rect.top < margin || rect.bottom > window.innerHeight - margin) {
      window.scrollBy({ top: rect.top + rect.height / 2 - window.innerHeight / 2, behavior: 'instant' });
    }
  }, [selectedImage]);

  const count = filteredImages.length;
  const prevPhoto = selectedIndex !== null ? filteredImages[(selectedIndex - 1 + count) % count] : null;
  const nextPhoto = selectedIndex !== null ? filteredImages[(selectedIndex + 1) % count] : null;

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Si le dernier favori est retiré pendant que le filtre Favoris est actif,
  // revenir sur « Toutes » pour ne pas rester sur un filtre devenu invisible
  if (filter === 'favorites' && favorites.length === 0) {
    setFilter('all');
  }

  const heading = filter === 'all' || filter === 'favorites'
    ? 'Galerie'
    : allCategories.find(c => c.id === filter)?.label || 'Galerie';

  const handleImageLoad = useCallback((imageId) => {
    setImagesLoaded(prev => (prev[imageId] ? prev : { ...prev, [imageId]: true }));
  }, []);

  const handleImageError = useCallback((imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentCategoryLabel = allCategories.find(c => c.id === filter)?.label || 'Toutes';

  return (
    <section className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-white text-zinc-900">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl md:text-6xl tracking-tighter leading-none mb-8 md:mb-12 font-light">
          {heading}
        </h1>

        <div
          className="flex flex-wrap gap-2 md:gap-3 mb-10"
          role="toolbar"
          aria-label="Filtrer par catégorie"
        >
          {allCategories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => changeFilter(category.id)}
              aria-pressed={filter === category.id}
              className={`relative px-5 py-2 rounded-full text-sm tracking-wide transition-colors ${
                filter === category.id
                  ? 'text-white'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
              whileTap={{ scale: 0.97 }}
              transition={spring.snappy}
            >
              {filter === category.id && (
                <motion.span
                  className="absolute inset-0 bg-zinc-900 rounded-full"
                  layoutId="filter-pill"
                  transition={spring.snappy}
                />
              )}
              <span className="relative z-10">
                {category.id === 'favorites' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Heart size={14} weight="fill" className="text-red-500" />
                    {category.label} ({favorites.length})
                  </span>
                ) : (
                  <>
                    {category.label}
                    <span className={`ml-1.5 ${filter === category.id ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {category.id === 'all' ? photos.length : photos.filter(p => p.category === category.id).length}
                    </span>
                  </>
                )}
              </span>
            </motion.button>
          ))}
        </div>

        <div aria-live="polite" className="sr-only">
          {filteredImages.length} photo{filteredImages.length > 1 ? 's' : ''} — {currentCategoryLabel}
        </div>

        {/* Maçonnerie : au changement de filtre, les photos restantes glissent vers leur
            nouvelle place et les autres s'effacent */}
        <div className="[container-type:inline-size]">
          <div className="relative" style={masonry.containerStyle}>
            <AnimatePresence initial={false}>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  ref={(el) => { thumbnailRefs.current[image.id] = el; }}
                  className={`absolute rounded-lg overflow-hidden group ${hiddenPhotoId === image.id ? 'invisible' : ''}`}
                  style={{
                    ...masonry.positions[index],
                    backgroundImage: image.blurDataURL ? `url(${image.blurDataURL})` : undefined,
                    backgroundSize: 'cover',
                  }}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: fade.fast }}
                  transition={{ layout: spring.smooth, default: fade.base }}
                >
                  <button
                    type="button"
                    className="block w-full h-full text-left cursor-pointer rounded-lg focus-visible:outline-offset-[-2px]"
                    aria-label={`Voir « ${image.title} »`}
                    onMouseEnter={() => preloadFullImage(image)}
                    onTouchStart={() => preloadFullImage(image)}
                    onFocus={() => preloadFullImage(image)}
                    onClick={() => setSelectedIndex(index)}
                  >
                    {imageErrors[image.id] ? (
                      <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
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
                      // Aperçu flou en fond du conteneur, l'image nette apparaît en fondu par-dessus
                      <Image
                        src={image.path}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        loading="lazy"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={`w-full h-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04] ${
                          imagesLoaded[image.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleImageLoad(image.id)}
                        onError={() => handleImageError(image.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="text-sm text-zinc-100 font-light tracking-wide">{image.title}</p>
                    </div>
                  </button>

                  {/* Favori : toujours visible sur écran tactile, au survol/focus sinon */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100 transition-opacity duration-300">
                    <FavoriteButton
                      isFavorite={isFavorite(image.id)}
                      onToggle={() => toggle(image.id)}
                      size={20}
                      overlay
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {filteredImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-zinc-600 text-lg font-light">
              {filter === 'favorites' ? 'Aucun favori pour le moment.' : 'Aucune image dans cette catégorie.'}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence onExitComplete={() => setHiddenPhotoId(null)}>
        {selectedImage && (
          <PhotoDetail
            photo={selectedImage}
            getThumbnailRect={getThumbnailRect}
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
            transition={fade.fast}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={22} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
