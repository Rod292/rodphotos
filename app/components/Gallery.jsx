'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Catégories de photos
  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'landscape', label: 'Paysages' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'street', label: 'Street' },
    { id: 'travel', label: 'Voyage' }
  ];
  
  // Données des images avec leurs catégories
  const imageData = [
    { name: 'A7403945.jpg', category: 'landscape' },
    { name: 'A7404333.jpg', category: 'travel' },
    { name: 'A7407595.jpg', category: 'landscape' },
    { name: 'DSCF0726.jpg', category: 'street' },
    { name: 'DSCF2813.jpg', category: 'portrait' },
    { name: 'DSCF5027.jpg', category: 'travel' },
    { name: 'DSCF5068.jpg', category: 'street' },
    { name: 'DSCF5448.jpg', category: 'portrait' },
    { name: 'DSCF5470.jpg', category: 'landscape' },
    { name: 'DSCF5481.jpg', category: 'travel' },
    { name: 'DSCF5513.jpg', category: 'street' },
    { name: 'DSCF5550.jpg', category: 'portrait' },
    { name: 'DSCF5660.jpg', category: 'landscape' },
    { name: 'DSCF7190.jpg', category: 'travel' },
    { name: 'DSCF7196.jpg', category: 'street' },
    { name: 'DSCF7645.jpg', category: 'portrait' },
    { name: 'DSCF7749.jpg', category: 'landscape' },
    { name: 'IMG_9816.jpg', category: 'travel' }
  ];
  
  // Chargement des images
  useEffect(() => {
    const loadImages = () => {
      try {
        // Créer les chemins d'accès aux images
        const imagePaths = imageData.map(img => ({
          path: `/photos/${img.name}`,
          category: img.category
        }));
        
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
  
  // Filtrer les images selon la catégorie sélectionnée
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(image => image.category === filter);
  
  // Ouvrir l'image en plein écran
  const openImage = (image) => {
    setSelectedImage(image.path);
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
      className="min-h-screen w-full pt-24 pb-16 px-4 md:px-8 section-content"
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
        
        {/* Filtres de catégories */}
        <motion.div 
          className="flex flex-wrap gap-2 md:gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors ${
                filter === category.id 
                  ? 'bg-white text-black' 
                  : 'bg-transparent text-white border border-white/30 hover:border-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gray-300 border-t-white rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                onClick={() => openImage(image)}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={image.path}
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
        
        {filteredImages.length === 0 && !loading && (
          <motion.p 
            className="text-center text-gray-400 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Aucune image trouvée dans cette catégorie.
          </motion.p>
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