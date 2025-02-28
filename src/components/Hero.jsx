import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';

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
  
  // Chargement des images
  useEffect(() => {
    const importImages = async () => {
      try {
        const imageModules = import.meta.glob('../../photos/*.jpg');
        
        const promises = Object.keys(imageModules).map(async (path) => {
          const imgModule = await imageModules[path]();
          return imgModule.default;
        });
        
        const results = await Promise.all(promises);
        
        // Utiliser toutes les images disponibles
        setImages(results);
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
      }
    };
    
    // S'assurer que les images ne sont chargées qu'une seule fois
    if (images.length === 0) {
      importImages();
    }
  }, [images.length]);

  // Démarrer l'animation de rotation une fois que les images sont chargées
  useEffect(() => {
    if (images.length > 0) {
      controls.start({
        rotate: 360,
        transition: {
          duration: 60, // Rotation plus rapide (1 minute par tour complet)
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
    const radius = Math.min(windowSize.width, windowSize.height) * 0.65;
    
    // Taille fixe pour toutes les images
    const fixedScale = 1.0;
    
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
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      {/* Section cercle de photos */}
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          animate={controls}
          style={{ originY: 0, originX: 0.5 }} // Point d'origine au bas du cercle
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
                width: `${Math.min(250, windowSize.width * 0.2)}px`, // Taille fixe pour toutes les images
                height: `${Math.min(350, windowSize.width * 0.25)}px`, // Taille fixe pour toutes les images
                left: positions[index]?.x || 0,
                top: positions[index]?.y || 0,
                transform: `translate(-50%, -50%) rotate(${positions[index]?.rotation || 0}deg)`,
                zIndex: positions[index]?.zIndex || 0,
              }}
            >
              <img
                src={image}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-lg"
                style={{ 
                  filter: `brightness(1.05) contrast(1.05)`,
                  imageRendering: 'high-quality'
                }}
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Bouton pour accéder à la galerie */}
        <motion.div 
          className="absolute bottom-32 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            onClick={() => setActiveSection('gallery')}
            className="px-8 py-4 bg-black text-white rounded-full text-lg font-light tracking-wider shadow-lg backdrop-blur-sm border border-gray-800"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            Découvrir la galerie
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero; 