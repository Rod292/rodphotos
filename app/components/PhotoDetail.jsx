'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { X, CaretLeft, CaretRight, ShareNetwork, Check, Play, Pause } from '@phosphor-icons/react';
import FavoriteButton from './FavoriteButton';

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 300;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const PhotoDetail = ({ photo, sourceRect, onClose, onNext, onPrev, prevPhoto, nextPhoto, navigationInfo, isFavorite, onToggleFavorite }) => {
  const prefersReducedMotion = useReducedMotion();
  const photoContainerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const [isZoomed, setIsZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);
  const [fullImageLoaded, setFullImageLoaded] = useState(false);

  const scaleRef = useRef(1);
  const scale = useMotionValue(1);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  const dismissY = useMotionValue(0);
  const dismissScale = useTransform(dismissY, [0, 300], [1, 0.9]);
  const backdropOpacity = useTransform(dismissY, [0, 300], [1, 0]);
  const [isDismissing, setIsDismissing] = useState(false);

  const pinchStartDistRef = useRef(0);
  const pinchStartScaleRef = useRef(1);

  const pauseSlideshow = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Reset zoom and image loaded state when photo changes
  useEffect(() => {
    scaleRef.current = 1;
    scale.set(1);
    panX.set(0);
    panY.set(0);
    setIsZoomed(false);
    setFullImageLoaded(false);
    dismissY.set(0);
    setIsDismissing(false);
  }, [photo.id, scale, panX, panY, dismissY]);

  // Prefetch adjacent images with Next.js optimized URLs
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const isMobile = vw < 768;
    const displayWidth = isMobile ? vw : vw * 0.5;
    const neededWidth = Math.round(displayWidth * dpr);
    const availableWidths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const targetWidth = availableWidths.find(w => w >= neededWidth) || availableWidths[availableWidths.length - 1];

    [prevPhoto, nextPhoto].forEach(p => {
      if (p) {
        const img = new window.Image();
        img.src = `/_next/image?url=${encodeURIComponent(p.path)}&w=${targetWidth}&q=75`;
      }
    });
  }, [prevPhoto, nextPhoto]);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isPlaying || !onNext) return;
    const interval = setInterval(() => {
      onNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, onNext]);

  // Focus management
  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);
    return () => {
      clearTimeout(timer);
      previouslyFocusedRef.current?.focus();
    };
  }, []);

  // Keyboard + focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      pauseSlideshow();
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext && !isZoomed) onNext();
      if (e.key === 'ArrowLeft' && onPrev && !isZoomed) onPrev();

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, isZoomed, pauseSlideshow]);

  // Scroll wheel zoom (desktop)
  useEffect(() => {
    const el = imageWrapperRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.002;
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scaleRef.current + delta));
      scaleRef.current = newScale;
      scale.set(newScale);
      setIsZoomed(newScale > 1);
      if (newScale === 1) {
        panX.set(0);
        panY.set(0);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [scale, panX, panY]);

  // Pinch-to-zoom (mobile)
  useEffect(() => {
    const el = imageWrapperRef.current;
    if (!el) return;

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
        const dist = getDistance(e.touches);
        const ratio = dist / pinchStartDistRef.current;
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartScaleRef.current * ratio));
        scaleRef.current = newScale;
        scale.set(newScale);
        setIsZoomed(newScale > 1);
        if (newScale === 1) {
          panX.set(0);
          panY.set(0);
        }
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scale, panX, panY]);

  // Double-click/tap zoom toggle
  const handleDoubleClick = useCallback(() => {
    if (scaleRef.current > 1) {
      scaleRef.current = 1;
      scale.set(1);
      panX.set(0);
      panY.set(0);
      setIsZoomed(false);
    } else {
      scaleRef.current = 2;
      scale.set(2);
      setIsZoomed(true);
    }
  }, [scale, panX, panY]);

  // Dismiss drag end: swipe down to close
  const handleDismissDragEnd = useCallback((_, info) => {
    if (isZoomed) return;
    if (info.offset.y > 100 || info.velocity.y > 500) {
      setIsDismissing(true);
      onClose();
    } else {
      animate(dismissY, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  }, [isZoomed, onClose, dismissY]);

  // Drag end: swipe navigation when not zoomed
  const handleDragEnd = useCallback((_, info) => {
    if (isZoomed) return;
    pauseSlideshow();
    const { offset, velocity } = info;
    if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
      onPrev?.();
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
      onNext?.();
    }
  }, [isZoomed, onNext, onPrev, pauseSlideshow]);

  // Share handler
  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/gallery/${photo.id}`;
    const shareData = { title: photo.title, text: photo.description, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareStatus('copied');
      setTimeout(() => setShareStatus(null), 2000);
    }
  }, [photo]);

  // FLIP initial transform (skip when prefers-reduced-motion)
  const flipInitial = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        scaleX: 1, scaleY: 1, x: 0, y: 0,
        rotate: 0, rotateY: 0, borderRadius: '0rem', opacity: 1,
      };
    }

    if (!sourceRect) {
      return {
        scaleX: 0.3, scaleY: 0.3, x: 0, y: 0,
        rotate: 0, rotateY: 0, borderRadius: '0.5rem', opacity: 1,
      };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;

    let targetCx, targetCy, targetW, targetH;

    if (isMobile) {
      targetW = vw;
      targetH = vh * 0.5;
      targetCx = vw / 2;
      targetCy = targetH / 2;
    } else {
      const modalW = Math.min(1152, vw - 64);
      const photoW = modalW / 2;
      const photoH = vh * 0.8;
      targetCx = vw / 2 - modalW / 2 + photoW / 2;
      targetCy = vh / 2;
      targetW = photoW;
      targetH = photoH;
    }

    const dx = sourceRect.cx - targetCx;
    const dy = sourceRect.cy - targetCy;
    const sx = sourceRect.thumbWidth / targetW;
    const sy = sourceRect.thumbHeight / targetH;

    return {
      x: dx, y: dy, scaleX: sx, scaleY: sy,
      rotate: sourceRect.totalRotation || 0, rotateY: 0,
      borderRadius: '0.5rem', opacity: 1,
    };
  }, [sourceRect, prefersReducedMotion]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
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
        style={{ opacity: backdropOpacity }}
      />

      {/* Slideshow toggle */}
      {onNext && (
        <motion.button
          className="absolute top-6 left-6 z-20 text-zinc-400 hover:text-white p-2 transition-colors"
          onClick={() => setIsPlaying(prev => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? 'Pause diaporama' : 'Lancer le diaporama'}
        >
          {isPlaying ? <Pause size={28} weight="light" /> : <Play size={28} weight="light" />}
        </motion.button>
      )}

      {/* Close button */}
      <motion.button
        ref={closeButtonRef}
        className="absolute top-6 right-6 z-20 text-zinc-400 hover:text-white p-2 transition-colors"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Fermer"
      >
        <X size={28} weight="light" />
      </motion.button>

      {/* Navigation arrows */}
      {onPrev && (
        <motion.button
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-zinc-400 hover:text-white p-2 transition-colors"
          onClick={(e) => { e.stopPropagation(); pauseSlideshow(); onPrev(); }}
          aria-label="Image précédente"
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
        >
          <CaretLeft size={36} weight="light" />
        </motion.button>
      )}
      {onNext && (
        <motion.button
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-zinc-400 hover:text-white p-2 transition-colors"
          onClick={(e) => { e.stopPropagation(); pauseSlideshow(); onNext(); }}
          aria-label="Image suivante"
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.9 }}
        >
          <CaretRight size={36} weight="light" />
        </motion.button>
      )}

      {/* Screen reader announcement */}
      <div aria-live="polite" className="sr-only">
        {photo.title} — {navigationInfo}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:mx-8 overflow-y-auto md:overflow-hidden">
        {/* Photo with FLIP animation (parent) */}
        <div
          ref={photoContainerRef}
          className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-[80vh] flex-shrink-0"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            className="w-full h-full relative"
            style={!fullImageLoaded && photo.blurDataURL ? {
              backgroundImage: `url(${photo.blurDataURL})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            } : undefined}
            initial={flipInitial}
            animate={{
              x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0,
              rotateY: [0, -25, 0], borderRadius: '0rem', opacity: 1,
            }}
            exit={isDismissing
              ? { opacity: 0, y: 200, scale: 0.85 }
              : { opacity: 0, scale: 0.85, rotateY: 30 }}
            transition={{
              type: 'spring', stiffness: 70, damping: 20,
              rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.2 },
            }}
          >
            {/* Dismiss wrapper for swipe-to-close */}
            <motion.div
              drag={isZoomed ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              style={{ y: dismissY, scale: dismissScale }}
              onDragEnd={handleDismissDragEnd}
              className="w-full h-full touch-none"
            >
              {/* Inner wrapper for zoom/pan/swipe */}
              <motion.div
                ref={imageWrapperRef}
                className="w-full h-full relative touch-none"
                style={{ scale, x: isZoomed ? panX : 0, y: isZoomed ? panY : 0 }}
                drag={isZoomed ? true : 'x'}
                dragConstraints={isZoomed ? { left: -200, right: 200, top: -200, bottom: 200 } : { left: 0, right: 0 }}
                dragElastic={isZoomed ? 0.1 : 0.2}
                onDragEnd={handleDragEnd}
                onDoubleClick={handleDoubleClick}
              >
                {/* Gallery thumbnail as immediate placeholder (exact cached URL) */}
                {!fullImageLoaded && sourceRect?.thumbSrc && (
                  <img
                    src={sourceRect.thumbSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                    aria-hidden="true"
                  />
                )}
                <Image
                  src={photo.path}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                  draggable={false}
                  onLoad={() => setFullImageLoaded(true)}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Details panel */}
        <motion.div
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-white"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.25 }}
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

          {navigationInfo && (() => {
            const parts = navigationInfo.split(' / ');
            const current = parseInt(parts[0], 10);
            const total = parseInt(parts[1], 10);
            return (
              <div className="mb-6">
                <p className="text-zinc-500 text-sm font-light tracking-widest mb-2">{navigationInfo}</p>
                <div className="w-full max-w-[200px] h-px bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-zinc-500"
                    initial={false}
                    animate={{ width: `${(current / total) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Share button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-4 self-start"
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
