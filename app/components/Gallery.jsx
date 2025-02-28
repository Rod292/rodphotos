'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Chargement des images
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Utiliser une approche différente pour Next.js
        // Nous allons charger les images statiquement depuis le dossier public
        const imageNames = [
          'A7403945.jpg', 'A7404333.jpg', 'A7407595.jpg', 
          'DSCF0726.jpg', 'DSCF2813.jpg', 'DSCF5027.jpg', 
          'DSCF5068.jpg', 'DSCF5448.jpg', 'DSCF5470.jpg',
          'DSCF5481.jpg', 'DSCF5513.jpg', 'DSCF5550.jpg',
          'DSCF5660.jpg', 'DSCF7190.jpg', 'DSCF7196.jpg',
          'DSCF7645.jpg', 'DSCF7749.jpg', 'IMG_9816.jpg'
        ];
        
        const imagePaths = imageNames.map(name => `/photos/${name}`);
        console.log("Images trouvées pour la galerie:", imagePaths.length);
        
        setImages(imagePaths);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
        setLoading(false);
      }
    };
    
    loadImages();
  }, []);
  
  // Ouvrir l'image en plein écran
  const openImage = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };
  
  // Fermer l'image en plein écran
  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  // Animation pour les images de la galerie
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.section 
      className="min-h-screen w-full pt-24 pb-16 px-4 md:px-8 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <motion.h1 
          className="text-3xl md:text-4xl font-light mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Galerie
        </motion.h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                onClick={() => openImage(image)}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={image}
                    alt={`Photo ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Modal pour afficher l'image en plein écran */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeImage}
        >
          <motion.button
            className="absolute top-4 right-4 text-white z-10 p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
          
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Photo en plein écran"
                fill
                sizes="100vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default Gallery; 