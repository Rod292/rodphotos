'use client';

import React, { useEffect, useRef, useMemo, useSyncExternalStore } from 'react';
import { motion, useAnimation } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const imageNames = [
  'A7403945.jpg', 'A7404333.jpg', 'A7407595.jpg',
  'DSCF0726.jpg', 'DSCF2813.jpg', 'DSCF5027.jpg',
  'DSCF5068.jpg', 'DSCF5448.jpg', 'DSCF5470.jpg',
  'DSCF5481.jpg', 'DSCF5513.jpg', 'DSCF5550.jpg',
  'DSCF5660.jpg', 'DSCF7190.jpg', 'DSCF7196.jpg',
  'DSCF7645.jpg', 'DSCF7749.jpg', 'IMG_9816.jpg',
];
const images = imageNames.map(name => `/photos/${name}`);

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

const Hero = () => {
  const sizeKey = useSyncExternalStore(subscribeResize, getWindowSnapshot, getServerSnapshot);
  const windowSize = useMemo(() => {
    const [w, h] = sizeKey.split(',').map(Number);
    return { width: w, height: h };
  }, [sizeKey]);

  const controls = useAnimation();
  const containerRef = useRef(null);

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: {
        duration: 120,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      },
    });
  }, [controls]);

  const isMobile = windowSize.width < 768;

  const positions = useMemo(() => {
    const count = images.length;
    const radius = Math.min(windowSize.width, windowSize.height) * 0.65;

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

  return (
    <motion.section
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          animate={controls}
          style={{
            originY: 0,
            originX: 0.5,
            bottom: isMobile ? '25%' : '0',
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              style={{
                width: `${Math.min(isMobile ? 200 : 250, windowSize.width * (isMobile ? 0.22 : 0.2))}px`,
                height: `${Math.min(isMobile ? 280 : 350, windowSize.width * (isMobile ? 0.28 : 0.25))}px`,
                left: positions[index]?.x || 0,
                top: positions[index]?.y || 0,
                transform: `translate(-50%, -50%) rotate(${positions[index]?.rotation || 0}deg)`,
                zIndex: positions[index]?.zIndex || 0,
              }}
            >
              <div className="w-full h-full relative rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Photographie ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 200px, 250px"
                  className="object-cover"
                  preload={index < 3}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient for button readability */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-white via-white/60 to-transparent z-40 pointer-events-none" />

        <motion.div
          className="absolute z-50 flex flex-col sm:flex-row gap-4"
          style={{ bottom: isMobile ? '5%' : '32px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link href="/gallery">
            <motion.span
              className="btn-dark inline-block text-center"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.98 }}
            >
              Découvrir la galerie
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
