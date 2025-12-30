'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Hero = ({ setActiveSection }) => {
  // Importation dynamique des images
  const [images, setImages] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  // Contrôles d'animation
  const controls = useAnimation();
  
  // Référence pour le conteneur principal
  const containerRef = useRef(null);
  
  // Gestion du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Liste statique des images
  const imageNames = useMemo(() => [
    'A7403945.jpg', 'A7404333.jpg', 'A7407595.jpg',
    'DSCF0726.jpg', 'DSCF2813.jpg', 'DSCF5027.jpg',
    'DSCF5068.jpg', 'DSCF5448.jpg', 'DSCF5470.jpg',
    'DSCF5481.jpg', 'DSCF5513.jpg', 'DSCF5550.jpg',
    'DSCF5660.jpg', 'DSCF7190.jpg', 'DSCF7196.jpg',
    'DSCF7645.jpg', 'DSCF7749.jpg', 'IMG_9816.jpg'
  ], []);

  // Chargement des images
  useEffect(() => {
    if (images.length === 0) {
      setImages(imageNames.map(name => `/photos/${name}`));
    }
  }, [images.length, imageNames]);

  // Démarrer l'animation de rotation une fois que les images sont chargées
  useEffect(() => {
    if (images.length > 0) {
      controls.start({
        rotate: 360,
        transition: {
          duration: 120, // Rotation plus lente (2 minutes par tour complet)
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    }
  }, [images, controls]);

  // Calcul des positions optimisé avec useMemo
  const positions = useMemo(() => {
    if (images.length === 0) return [];
    
    const count = images.length;
    const positions = [];
    
    // Cercle complet (360 degrés)
    const circleWidth = 360;
    
    // Rayon du cercle adapté à la taille de l'écran
    const isMobile = windowSize.width < 768;
    const radius = Math.min(windowSize.width, windowSize.height) * (isMobile ? 0.65 : 0.65);
    
    // Taille fixe pour toutes les images
    const fixedScale = isMobile ? 0.9 : 1.0;
    
    // Espacement minimal entre les images (en degrés)
    const minAngleBetweenImages = 360 / (count * 1.5);
    
    for (let i = 0; i < count; i++) {
      // Répartir les angles uniformément sur le cercle complet
      const angleInDegrees = (i / count) * circleWidth;
      const angleInRadians = (angleInDegrees * Math.PI) / 180;
      
      // Calculer les positions x et y sur le cercle
      const x = Math.sin(angleInRadians) * radius;
      const y = -Math.cos(angleInRadians) * radius;
      
      // Rotation des images pour qu'elles restent orientées vers l'extérieur du cercle
      const rotation = angleInDegrees;
      
      // Calculer la distance par rapport au haut du cercle (pour le z-index)
      const normalizedAngle = (angleInDegrees % 360 + 360) % 360;
      const distanceFromTop = Math.min(
        Math.abs(normalizedAngle - 90),
        Math.abs(normalizedAngle - 450)
      ) / 180;
      
      // Utiliser une taille fixe pour toutes les images
      const scale = fixedScale;
      
      // Calculer le z-index pour éviter les chevauchements indésirables
      // Les images plus proches du haut auront un z-index plus élevé
      const zIndex = 100 - Math.floor(distanceFromTop * 100);
      
      positions.push({ 
        x, 
        y, 
        rotation, 
        scale, 
        zIndex,
        angle: angleInDegrees 
      });
    }
    
    return positions;
  }, [images.length, windowSize]);

  return (
    <motion.section 
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-white hero-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      {/* Section cercle de photos */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          animate={controls}
          style={{ 
            originY: 0, 
            originX: 0.5,
            // Ajuster la position du cercle sur mobile pour qu'il soit plus centré
            bottom: windowSize.width < 768 ? '25%' : '0'
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { duration: 0.8, delay: index * 0.05 }
              }}
              style={{
                // Taille encore plus grande sur mobile
                width: `${Math.min(windowSize.width < 768 ? 200 : 250, windowSize.width * (windowSize.width < 768 ? 0.22 : 0.2))}px`,
                height: `${Math.min(windowSize.width < 768 ? 280 : 350, windowSize.width * (windowSize.width < 768 ? 0.28 : 0.25))}px`,
                left: positions[index]?.x || 0,
                top: positions[index]?.y || 0,
                transform: `translate(-50%, -50%) rotate(${positions[index]?.rotation || 0}deg)`,
                zIndex: positions[index]?.zIndex || 0,
              }}
            >
              <div className="w-full h-full relative rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 200px, 250px"
                  style={{ 
                    objectFit: 'cover',
                    filter: 'brightness(1.05) contrast(1.05)',
                  }}
                  priority={index < 5} // Charger en priorité les 5 premières images
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Boutons */}
        <motion.div 
          className="absolute z-50 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
          style={{
            bottom: windowSize.width < 768 ? '5%' : '32px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            onClick={() => setActiveSection('gallery')}
            className="btn-dark"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            Découvrir la galerie
          </motion.button>
          
          <Link href="https://arode.studio" target="_blank" rel="noopener noreferrer">
            <motion.button
              className="btn-dark"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              Arode Studio
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero; 