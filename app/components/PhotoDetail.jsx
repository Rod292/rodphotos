'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
  usePresence,
} from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { X, CaretLeft, CaretRight, ShareNetwork, Check, Play, Pause } from '@phosphor-icons/react';
import FavoriteButton from './FavoriteButton';
import { spring, fade } from '../lib/motion';
import { isKeyboardInput } from '../lib/inputModality';

const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 400;
const DISMISS_OFFSET = 100;
const DISMISS_VELOCITY = 500;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const SLIDESHOW_DELAY_MS = 5000;
const SLIDE_ENTER_OFFSET = 200;
const SLIDE_EXIT_OFFSET = 300;
const THUMB_RADIUS = 8;

function isInViewport(rect) {
  return (
    rect.cy + rect.height / 2 > 0 &&
    rect.cy - rect.height / 2 < window.innerHeight &&
    rect.cx + rect.width / 2 > 0 &&
    rect.cx - rect.width / 2 < window.innerWidth
  );
}

function normalizeAngle(deg) {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

// Transformation qui superpose la photo de la visionneuse à sa vignette.
// La boîte de la photo a exactement le format de l'image : l'échelle est donc uniforme,
// sans déformation. Centre de la boîte = centre de la scène (flex centré).
function getThumbnailTransform(thumb, box, stage) {
  const stageRect = stage.getBoundingClientRect();
  const scale = Math.max(thumb.width / box.offsetWidth, thumb.height / box.offsetHeight);
  return {
    x: thumb.cx - (stageRect.left + stageRect.width / 2),
    y: thumb.cy - (stageRect.top + stageRect.height / 2),
    scale,
    rotate: normalizeAngle(thumb.rotation || 0),
    radius: THUMB_RADIUS / scale,
  };
}

function getOptimizedUrl(path) {
  const dpr = window.devicePixelRatio || 1;
  const vw = window.innerWidth;
  const displayWidth = vw < 768 ? vw : vw * 0.5;
  const neededWidth = Math.round(displayWidth * dpr);
  const availableWidths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const width = availableWidths.find(w => w >= neededWidth) || availableWidths[availableWidths.length - 1];
  return `/_next/image?url=${encodeURIComponent(path)}&w=${width}&q=75`;
}

const slideVariants = {
  enter: ({ direction = 1, reduced = false } = {}) => (reduced ? { opacity: 0 } : { x: direction * SLIDE_ENTER_OFFSET, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: ({ direction = 1, reduced = false } = {}) => (reduced ? { opacity: 0 } : { x: direction * -SLIDE_EXIT_OFFSET, opacity: 0 }),
};

const Slide = ({ photo, custom, isInitial, placeholderSrc, setBoxRef, radius, dragY, zoom, isZoomed, onSwipe, onDismiss, onDoubleClick }) => {
  const [loaded, setLoaded] = useState(false);
  const ratio = photo.width / photo.height;

  const handleDragEnd = (_, { offset, velocity }) => {
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) onSwipe(1);
      else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) onSwipe(-1);
    } else if (offset.y > DISMISS_OFFSET || velocity.y > DISMISS_VELOCITY) {
      onDismiss();
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center touch-none"
      variants={slideVariants}
      // La photo qui entre lit `custom` ici ; celle qui sort le reçoit d'AnimatePresence
      custom={custom}
      initial={isInitial ? false : 'enter'}
      animate="center"
      exit="exit"
      transition={{ x: spring.smooth, opacity: fade.base }}
      style={{ y: dragY }}
      // Suit le doigt : horizontal = photo voisine, vers le bas = fermer
      drag={!isZoomed}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={{ left: 0.9, right: 0.9, top: 0.05, bottom: 0.6 }}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        ref={setBoxRef}
        className="relative overflow-hidden"
        style={{
          // Plus grande boîte au format de la photo qui tient dans la scène (équivalent de object-fit: contain)
          width: `min(100cqw, 100cqh * ${ratio})`,
          height: `min(100cqh, 100cqw / ${ratio})`,
          borderRadius: radius,
          backgroundImage: photo.blurDataURL ? `url(${photo.blurDataURL})` : undefined,
          backgroundSize: 'cover',
        }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ scale: zoom.scale, x: zoom.panX, y: zoom.panY }}
          drag={isZoomed}
          dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
          dragElastic={0.1}
          onDoubleClick={onDoubleClick}
        >
          {/* Vignette déjà en cache : affichée tout de suite, sous l'image pleine résolution */}
          {placeholderSrc && !loaded && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={placeholderSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}
          <Image
            src={photo.path}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            priority
            draggable={false}
            onLoad={() => setLoaded(true)}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const PhotoDetail = ({
  photo,
  getThumbnailRect,
  onClose,
  onNext,
  onPrev,
  prevPhoto,
  nextPhoto,
  navigationInfo,
  isFavorite,
  onToggleFavorite,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isPresent, safeToRemove] = usePresence();

  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const boxRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const [placeholderSrc] = useState(() => getThumbnailRect?.(photo.id)?.src || null);
  const [direction, setDirection] = useState(1);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);

  // Transformation de la scène pour l'ouverture / fermeture depuis la vignette
  const flipX = useMotionValue(0);
  const flipY = useMotionValue(0);
  const flipScale = useMotionValue(1);
  const flipRotate = useMotionValue(0);
  const flipOpacity = useMotionValue(1);
  const radius = useMotionValue(0);

  // Fond et interface (boutons, panneau) apparaissent / disparaissent ensemble
  const presence = useMotionValue(0);
  const chromeOpacity = useMotionValue(0);
  const dragY = useMotionValue(0);
  const backdropOpacity = useTransform([presence, dragY], ([p, y]) => p * Math.max(0, 1 - Math.max(0, y) / 300));

  const scaleRef = useRef(1);
  const zoom = {
    scale: useMotionValue(1),
    panX: useMotionValue(0),
    panY: useMotionValue(0),
  };
  const pinchStartDistRef = useRef(0);
  const pinchStartScaleRef = useRef(1);

  const setBoxRef = useCallback((el) => {
    // Pendant un glissement, deux photos coexistent : on garde la dernière montée
    if (el) boxRef.current = el;
  }, []);

  const resetZoom = useCallback(() => {
    scaleRef.current = 1;
    zoom.scale.set(1);
    zoom.panX.set(0);
    zoom.panY.set(0);
    setIsZoomed(false);
  }, [zoom.scale, zoom.panX, zoom.panY]);

  // Ouverture : la photo part de sa vignette
  useLayoutEffect(() => {
    animate(presence, 1, fade.base);
    animate(chromeOpacity, 1, { ...fade.base, delay: 0.1 });

    if (prefersReducedMotion) return;
    const thumb = getThumbnailRect?.(photo.id);
    if (!thumb || !boxRef.current || !stageRef.current || !isInViewport(thumb)) {
      flipOpacity.set(0);
      flipScale.set(0.95);
      animate(flipOpacity, 1, fade.base);
      animate(flipScale, 1, spring.gentle);
      return;
    }
    const from = getThumbnailTransform(thumb, boxRef.current, stageRef.current);
    flipX.set(from.x);
    flipY.set(from.y);
    flipScale.set(from.scale);
    flipRotate.set(from.rotate);
    radius.set(from.radius);
    animate(flipX, 0, spring.gentle);
    animate(flipY, 0, spring.gentle);
    animate(flipScale, 1, spring.gentle);
    animate(flipRotate, 0, spring.gentle);
    animate(radius, 0, spring.gentle);
    // Uniquement au montage : les changements de photo passent par le glissement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fermeture (bouton, Échap, swipe, bouton retour du navigateur) : la photo
  // retourne dans sa vignette, puis le composant est retiré
  useEffect(() => {
    if (isPresent) return;
    animate(presence, 0, { duration: 0.4, ease: [0.16, 1, 0.3, 1] });
    animate(chromeOpacity, 0, fade.fast);

    // La position de la vignette est lue à l'image suivante : le re-rendu du parent
    // qui vient de fermer la visionneuse peut laisser ses transformations
    // (rotation du carrousel) momentanément non appliquées
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      const thumb = getThumbnailRect?.(photo.id);
      const animations = [
        animate(dragY, 0, spring.gentle),
        animate(zoom.scale, 1, spring.smooth),
        animate(zoom.panX, 0, spring.smooth),
        animate(zoom.panY, 0, spring.smooth),
      ];
      if (!prefersReducedMotion && thumb && boxRef.current && stageRef.current && isInViewport(thumb)) {
        const to = getThumbnailTransform(thumb, boxRef.current, stageRef.current);
        animations.push(
          animate(flipX, to.x, spring.gentle),
          animate(flipY, to.y, spring.gentle),
          animate(flipScale, to.scale, spring.gentle),
          animate(flipRotate, to.rotate, spring.gentle),
          animate(radius, to.radius, spring.gentle),
        );
      } else {
        animations.push(animate(flipOpacity, 0, fade.fast));
      }
      Promise.all(animations).then(() => { if (!cancelled) safeToRemove(); });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  const pauseSlideshow = useCallback(() => setIsPlaying(false), []);

  const navigate = useCallback((dir) => {
    const handler = dir > 0 ? onNext : onPrev;
    if (!handler) return;
    setDirection(dir);
    setHasNavigated(true);
    handler();
  }, [onNext, onPrev]);

  // Changement de photo : zoom et glissement vertical remis à zéro
  const [prevPhotoId, setPrevPhotoId] = useState(photo.id);
  if (prevPhotoId !== photo.id) {
    setPrevPhotoId(photo.id);
    setIsZoomed(false);
  }
  useEffect(() => {
    scaleRef.current = 1;
    zoom.scale.set(1);
    zoom.panX.set(0);
    zoom.panY.set(0);
    dragY.set(0);
  }, [photo.id, zoom.scale, zoom.panX, zoom.panY, dragY]);

  // Précharge les photos voisines
  useEffect(() => {
    [prevPhoto, nextPhoto].forEach(p => {
      if (p) {
        const img = new window.Image();
        img.src = getOptimizedUrl(p.path);
      }
    });
  }, [prevPhoto, nextPhoto]);

  // Diaporama : le minuteur repart à chaque photo, synchronisé avec la barre de progression
  useEffect(() => {
    if (!isPlaying || !onNext) return;
    const timeout = setTimeout(() => navigate(1), SLIDESHOW_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isPlaying, onNext, navigate, photo.id]);

  // Focus + page figée derrière la visionneuse. Le focus n'est rendu à la vignette que
  // si la visionneuse a été ouverte au clavier : après un clic, le rendre afficherait
  // un contour de focus clavier inutile sur la vignette
  useEffect(() => {
    previouslyFocusedRef.current = isKeyboardInput() ? document.activeElement : null;
    const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      previouslyFocusedRef.current?.focus({ preventScroll: true });
    };
  }, []);

  // Clavier + piège à focus
  useEffect(() => {
    if (!isPresent) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && !isZoomed) { pauseSlideshow(); navigate(1); }
      if (e.key === 'ArrowLeft' && !isZoomed) { pauseSlideshow(); navigate(-1); }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresent, onClose, navigate, isZoomed, pauseSlideshow]);

  // Zoom à la molette (desktop) et au pincement (mobile), sur la scène qui reste montée
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const applyScale = (newScale) => {
      scaleRef.current = newScale;
      zoom.scale.set(newScale);
      setIsZoomed(newScale > 1);
      if (newScale === 1) {
        zoom.panX.set(0);
        zoom.panY.set(0);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      applyScale(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scaleRef.current - e.deltaY * 0.002)));
    };

    const getDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchStartDistRef.current = getDistance(e.touches);
        pinchStartScaleRef.current = scaleRef.current;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const ratio = getDistance(e.touches) / pinchStartDistRef.current;
        applyScale(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartScaleRef.current * ratio)));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [zoom.scale, zoom.panX, zoom.panY]);

  const handleDoubleClick = useCallback(() => {
    if (scaleRef.current > 1) {
      resetZoom();
    } else {
      scaleRef.current = 2;
      animate(zoom.scale, 2, spring.snappy);
      setIsZoomed(true);
    }
  }, [resetZoom, zoom.scale]);

  const handleSwipe = useCallback((dir) => {
    pauseSlideshow();
    navigate(dir);
  }, [pauseSlideshow, navigate]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/gallery/${photo.id}`;
    const shareData = { title: photo.title, text: photo.description, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Partage annulé
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareStatus('copied');
      setTimeout(() => setShareStatus(null), 2000);
    }
  }, [photo]);

  const slideCustom = { direction, reduced: prefersReducedMotion };
  const navParts = navigationInfo?.split(' / ').map(n => parseInt(n, 10));

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className={`fixed inset-0 z-50 flex items-center justify-center ${isPresent ? '' : 'pointer-events-none'}`}
    >
      {/* Fond */}
      <motion.div
        className="absolute inset-0 bg-white/95 backdrop-blur-sm"
        onClick={onClose}
        style={{ opacity: backdropOpacity }}
      />

      {/* Progression du diaporama */}
      {isPlaying && (
        <motion.div
          key={photo.id}
          className="absolute top-0 left-0 right-0 z-30 h-0.5 bg-zinc-900/70 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: SLIDESHOW_DELAY_MS / 1000, ease: 'linear' }}
        />
      )}

      <>
        {onNext && (
          <motion.button
            className="absolute top-6 left-6 z-20 text-zinc-600 hover:text-zinc-900 p-2 transition-colors"
            style={{ opacity: chromeOpacity }}
            onClick={() => setIsPlaying(prev => !prev)}
            whileTap={{ scale: 0.9 }}
            aria-label={isPlaying ? 'Pause diaporama' : 'Lancer le diaporama'}
          >
            {isPlaying ? <Pause size={28} weight="light" /> : <Play size={28} weight="light" />}
          </motion.button>
        )}

        <motion.button
          ref={closeButtonRef}
          className="absolute top-6 right-6 z-20 text-zinc-600 hover:text-zinc-900 p-2 transition-colors"
          style={{ opacity: chromeOpacity }}
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          aria-label="Fermer"
        >
          <X size={28} weight="light" />
        </motion.button>

        {onPrev && (
          <motion.button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-zinc-600 hover:text-zinc-900 p-2 transition-colors"
            style={{ opacity: chromeOpacity }}
            onClick={(e) => { e.stopPropagation(); handleSwipe(-1); }}
            aria-label="Image précédente"
            whileTap={{ scale: 0.9 }}
          >
            <CaretLeft size={36} weight="light" />
          </motion.button>
        )}
        {onNext && (
          <motion.button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-zinc-600 hover:text-zinc-900 p-2 transition-colors"
            style={{ opacity: chromeOpacity }}
            onClick={(e) => { e.stopPropagation(); handleSwipe(1); }}
            aria-label="Image suivante"
            whileTap={{ scale: 0.9 }}
          >
            <CaretRight size={36} weight="light" />
          </motion.button>
        )}
      </>

      <div aria-live="polite" className="sr-only">
        {photo.title}{navigationInfo ? ` — ${navigationInfo}` : ''}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:mx-8 overflow-y-auto md:overflow-visible pointer-events-none">
        {/* Scène : zone allouée à la photo, sert de référence (container query) à sa taille */}
        <div
          ref={stageRef}
          className="relative w-full md:w-1/2 h-[60dvh] md:h-[80vh] flex-shrink-0 mt-16 md:mt-0 [container-type:size] pointer-events-auto"
        >
          <motion.div
            className="absolute inset-0"
            style={{ x: flipX, y: flipY, scale: flipScale, rotate: flipRotate, opacity: flipOpacity }}
          >
            <AnimatePresence initial={false} custom={slideCustom}>
              <Slide
                key={photo.id}
                photo={photo}
                custom={slideCustom}
                isInitial={!hasNavigated}
                placeholderSrc={hasNavigated ? null : placeholderSrc}
                setBoxRef={setBoxRef}
                radius={radius}
                dragY={dragY}
                zoom={zoom}
                isZoomed={isZoomed}
                onSwipe={handleSwipe}
                onDismiss={onClose}
                onDoubleClick={handleDoubleClick}
              />
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Panneau d'informations */}
        <motion.div
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-zinc-900 pointer-events-auto"
          style={{ opacity: chromeOpacity }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={photo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade.fast}
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl font-light tracking-tight">{photo.title}</h2>
                {onToggleFavorite && (
                  <FavoriteButton
                    isFavorite={isFavorite}
                    onToggle={() => onToggleFavorite(photo.id)}
                    size={24}
                  />
                )}
              </div>
              <p className="text-zinc-600 font-light leading-relaxed mb-8">{photo.description}</p>

              {photo.technical && (
                <div className="mb-8 space-y-2">
                  <h3 className="text-sm uppercase tracking-widest text-zinc-600 mb-3">Détails techniques</h3>
                  <p className="text-sm text-zinc-600">
                    <span className="text-zinc-700">Appareil</span> — {photo.technical.camera}
                  </p>
                  <p className="text-sm text-zinc-600">
                    <span className="text-zinc-700">Objectif</span> — {photo.technical.lens}
                  </p>
                  <p className="text-sm text-zinc-600">
                    <span className="text-zinc-700">ISO</span> — {photo.technical.iso}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {navParts && (
            <div className="mb-6">
              <p className="text-zinc-600 text-sm font-light tracking-widest mb-2">{navigationInfo}</p>
              <div className="w-full max-w-[200px] h-px bg-zinc-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-zinc-600"
                  initial={false}
                  animate={{ width: `${(navParts[0] / navParts[1]) * 100}%` }}
                  transition={spring.snappy}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors text-sm mb-4 self-start"
          >
            {shareStatus === 'copied' ? (
              <>
                <Check size={18} weight="light" />
                Lien copié
              </>
            ) : (
              <>
                <ShareNetwork size={18} weight="light" />
                Partager
              </>
            )}
          </button>

          {photo.purchasePrice && (
            <p className="text-sm text-zinc-600 mb-3">
              Tirages à partir de <span className="text-zinc-900">{photo.purchasePrice} €</span>
            </p>
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
    </div>
  );
};

export default PhotoDetail;
