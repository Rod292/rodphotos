'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react';

const PhotoDetail = ({ photo, sourceRect, onClose, onNext, onPrev, navigationInfo }) => {
  const photoContainerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();

      // Focus trap
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
  }, [onClose, onNext, onPrev]);

  // Compute FLIP initial transform from sourceRect
  const flipInitial = useMemo(() => {
    if (!sourceRect) {
      // Fallback: simple scale-up from center
      return {
        scaleX: 0.3,
        scaleY: 0.3,
        x: 0,
        y: 0,
        rotate: 0,
        rotateY: 0,
        borderRadius: '0.5rem',
        opacity: 1,
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
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
      rotate: sourceRect.totalRotation || 0,
      rotateY: 0,
      borderRadius: '0.5rem',
      opacity: 1,
    };
  }, [sourceRect]);

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
      />

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
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
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
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Image suivante"
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.9 }}
        >
          <CaretRight size={36} weight="light" />
        </motion.button>
      )}

      {/* aria-live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {photo.title} — {navigationInfo}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:mx-8 overflow-y-auto md:overflow-hidden">
        {/* Photo with FLIP animation */}
        <div
          ref={photoContainerRef}
          className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-[80vh] flex-shrink-0"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            className="w-full h-full relative"
            initial={flipInitial}
            animate={{
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              rotate: 0,
              rotateY: [0, -25, 0],
              borderRadius: '0rem',
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              rotateY: 30,
            }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 20,
              rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.2 },
            }}
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
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.25 }}
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

          {navigationInfo && (
            <p className="text-zinc-600 text-sm font-light tracking-widest mb-6">{navigationInfo}</p>
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
