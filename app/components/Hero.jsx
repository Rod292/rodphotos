'use client';

import React, { useEffect, useRef, useMemo, useSyncExternalStore, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { photos } from '../data/photos';
import PhotoDetail from './PhotoDetail';

const images = photos.map(p => p.path);

function normalizeAngle(deg) {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

function subscribeResize(callback) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getWindowSnapshot() {
  return `${window.innerWidth},${window.innerHeight}`;
}

function getServerSnapshot() {
  return '1200,800';
}

const ROTATION_SPEED = 3; // degrees per second (360° / 120s)
const PAN_SENSITIVITY = 0.3; // pixels to degrees ratio
const WHEEL_SENSITIVITY = 0.1;
const RESUME_DELAY = 1000; // ms before auto-rotation resumes

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  const sizeKey = useSyncExternalStore(subscribeResize, getWindowSnapshot, getServerSnapshot);
  const windowSize = useMemo(() => {
    const [w, h] = sizeKey.split(',').map(Number);
    return { width: w, height: h };
  }, [sizeKey]);

  const rawAngle = useMotionValue(0);
  const smoothAngle = useSpring(rawAngle, { stiffness: 100, damping: 30 });

  const isInteracting = useRef(false);
  const resumeTimeout = useRef(null);
  const didPan = useRef(false);
  const panStartAngle = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const containerRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const hasInitiallyAnimated = useRef(false);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [sourceRect, setSourceRect] = useState(null);

  // Auto-rotation via requestAnimationFrame (disabled when prefers-reduced-motion)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const tick = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (!isInteracting.current && !selectedPhoto) {
        rawAngle.set(rawAngle.get() + ROTATION_SPEED * delta);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [rawAngle, selectedPhoto, prefersReducedMotion]);

  // Wheel handler for desktop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (selectedPhoto) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      rawAngle.set(rawAngle.get() + delta * WHEEL_SENSITIVITY);

      isInteracting.current = true;
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = setTimeout(() => {
        isInteracting.current = false;
      }, RESUME_DELAY);
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [rawAngle, selectedPhoto]);

  const handlePanStart = useCallback(() => {
    panStartAngle.current = rawAngle.get();
    didPan.current = false;
    isInteracting.current = true;
    clearTimeout(resumeTimeout.current);
  }, [rawAngle]);

  const handlePan = useCallback((_, info) => {
    if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
      didPan.current = true;
    }
    rawAngle.set(panStartAngle.current + info.offset.x * PAN_SENSITIVITY);
  }, [rawAngle]);

  const handlePanEnd = useCallback((_, info) => {
    // Apply inertia: project velocity forward
    const velocity = info.velocity.x * PAN_SENSITIVITY;
    rawAngle.set(rawAngle.get() + velocity * 0.3);

    resumeTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, RESUME_DELAY);

    // Reset didPan after click events have fired
    setTimeout(() => {
      didPan.current = false;
    }, 100);
  }, [rawAngle]);

  // Mark initial animation as done
  useEffect(() => {
    const timer = setTimeout(() => { hasInitiallyAnimated.current = true; }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => clearTimeout(resumeTimeout.current);
  }, []);

  const isMobile = windowSize.width < 768;

  const positions = useMemo(() => {
    const count = images.length;
    const radius = isMobile
      ? windowSize.height * 0.7
      : Math.min(windowSize.width, windowSize.height) * 0.65;

    return images.map((_, i) => {
      const angle = (i / count) * 360;
      const rad = (angle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const y = -Math.cos(rad) * radius;
      const normalizedAngle = ((angle % 360) + 360) % 360;
      const distFromTop = Math.min(
        Math.abs(normalizedAngle - 90),
        Math.abs(normalizedAngle - 450)
      ) / 180;

      return {
        x,
        y,
        rotation: angle,
        zIndex: 100 - Math.floor(distFromTop * 100),
      };
    });
  }, [windowSize]);

  const handlePhotoClick = useCallback((index) => {
    if (didPan.current) return;
    const el = thumbnailRefs.current[index];
    if (el) {
      const domRect = el.getBoundingClientRect();
      const currentAngle = smoothAngle.get();
      const itemRotation = positions[index]?.rotation || 0;
      setSourceRect({
        cx: domRect.x + domRect.width / 2,
        cy: domRect.y + domRect.height / 2,
        thumbWidth: Math.min(isMobile ? 250 : 250, windowSize.width * (isMobile ? 0.55 : 0.2)),
        thumbHeight: Math.min(isMobile ? 340 : 350, windowSize.width * (isMobile ? 0.75 : 0.25)),
        totalRotation: normalizeAngle(currentAngle + itemRotation),
      });
    }
    setSelectedPhoto(photos[index]);
  }, [smoothAngle, positions, isMobile, windowSize]);

  const handleCloseDetail = useCallback(() => {
    setSelectedPhoto(null);
    setSourceRect(null);
    isInteracting.current = true;
    clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, RESUME_DELAY);
  }, []);

  return (
    <motion.section
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-white touch-none cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ minHeight: '100dvh' }}>
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            rotate: smoothAngle,
            originY: 0,
            originX: 0.5,
            bottom: isMobile ? '-10%' : '0',
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image}
              ref={(el) => { thumbnailRefs.current[index] = el; }}
              className="absolute cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedPhoto?.id === photos[index].id ? 0 : 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : (selectedPhoto?.id === photos[index].id ? 0 : (hasInitiallyAnimated.current ? 0.3 : 0.8)),
                delay: prefersReducedMotion ? 0 : (hasInitiallyAnimated.current ? 0 : index * 0.05),
              }}
              style={{
                width: `${Math.min(isMobile ? 250 : 250, windowSize.width * (isMobile ? 0.55 : 0.2))}px`,
                height: `${Math.min(isMobile ? 340 : 350, windowSize.width * (isMobile ? 0.75 : 0.25))}px`,
                left: positions[index]?.x || 0,
                top: positions[index]?.y || 0,
                transform: `translate(-50%, -50%) rotate(${positions[index]?.rotation || 0}deg)`,
                zIndex: positions[index]?.zIndex || 0,
              }}
              onClick={() => handlePhotoClick(index)}
            >
              <div className="w-full h-full relative rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={image}
                  alt={photos[index].alt}
                  fill
                  sizes="(max-width: 768px) 200px, 250px"
                  className="object-cover"
                  priority={index < 3}
                  {...(index === 0 ? { fetchPriority: 'high' } : {})}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient for button readability */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent z-30 pointer-events-none" />

        {/* Swipe hint — mobile only */}
        {isMobile && (
          <motion.div
            className="absolute z-40 flex items-center gap-3 text-zinc-400"
            style={{ bottom: '14%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 8, delay: 1.5, times: [0, 0.05, 0.85, 1] }}
          >
            <motion.svg
              width="18" height="18" viewBox="0 0 18 18" fill="none"
              animate={{ x: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
            >
              <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
            <span className="text-xs tracking-widest uppercase">Glissez &amp; cliquez sur les images</span>
            <motion.svg
              width="18" height="18" viewBox="0 0 18 18" fill="none"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
            >
              <path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </motion.div>
        )}

        <motion.div
          className="absolute z-40 flex flex-col sm:flex-row gap-4"
          style={{ bottom: isMobile ? '5%' : '32px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}
        >
          <Link href="/gallery">
            <motion.span
              className="btn-dark inline-block text-center"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              Découvrir la galerie
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <PhotoDetail photo={selectedPhoto} sourceRect={sourceRect} onClose={handleCloseDetail} />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Hero;
