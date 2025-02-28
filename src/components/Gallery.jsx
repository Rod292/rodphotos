import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState(['Toutes', 'Nature', 'Surf', 'Villes']);
  const [activeCategory, setActiveCategory] = useState('Toutes');

  useEffect(() => {
    const importImages = async () => {
      try {
        console.log("Tentative de chargement des images dans Gallery");
        
        // Utiliser un chemin relatif par rapport à la racine du projet
        const imageModules = import.meta.glob('/photos/*.jpg', { eager: false });
        
        // Alternative si le chemin ci-dessus ne fonctionne pas
        if (Object.keys(imageModules).length === 0) {
          console.log("Tentative avec un chemin alternatif dans Gallery");
          const altImageModules = import.meta.glob('../../photos/*.jpg', { eager: false });
          if (Object.keys(altImageModules).length > 0) {
            console.log("Chemin alternatif trouvé dans Gallery avec", Object.keys(altImageModules).length, "images");
            await processImages(altImageModules);
            return;
          }
        }
        
        console.log("Modules d'images trouvés dans Gallery:", Object.keys(imageModules).length);
        await processImages(imageModules);
      } catch (error) {
        console.error("Erreur lors du chargement des images dans Gallery:", error);
      }
    };
    
    // Fonction pour traiter les images avec la même logique de catégorisation
    const processImages = async (modules) => {
      const loadedImages = [];
      
      // Nouvelles catégories : Nature, Surf, Villes
      const categoryMap = {
        // Nature - paysages naturels, montagnes, forêts, etc.
        'A7404333.jpg': 'Nature',
        'DSCF7196.jpg': 'Nature',
        'DSCF5513.jpg': 'Nature',
        'DSCF5068.jpg': 'Nature',
        'DSCF7190.jpg': 'Nature',
        'A7403945.jpg': 'Nature',
        
        // Surf - plages, océan, surfeurs, etc.
        'DSCF5550.jpg': 'Surf',
        'A7407595.jpg': 'Surf',
        'DSCF5470.jpg': 'Surf',
        'IMG_9816.jpg': 'Surf',
        'DSCF0726.jpg': 'Surf',
        
        // Villes - architecture urbaine, rues, bâtiments, etc.
        'DSCF7749.jpg': 'Villes',
        'DSCF7645.jpg': 'Villes',
        'DSCF5660.jpg': 'Villes',
        'DSCF5481.jpg': 'Villes',
        'DSCF5448.jpg': 'Villes',
        'DSCF5027.jpg': 'Villes',
        'DSCF2813.jpg': 'Villes'
      };
      
      for (const path in modules) {
        console.log("Traitement du chemin d'image:", path);
        const imgModule = await modules[path]();
        const filename = path.split('/').pop();
        console.log("Nom de fichier extrait:", filename);
        
        // Attribuer une catégorie par défaut si non spécifiée
        const category = categoryMap[filename] || (
          // Répartition aléatoire mais équilibrée entre les catégories
          Math.random() < 0.33 ? 'Nature' : 
          Math.random() < 0.5 ? 'Surf' : 'Villes'
        );
        
        loadedImages.push({
          src: imgModule.default,
          category: category,
          id: path
        });
      }
      
      console.log("Total d'images chargées dans Gallery:", loadedImages.length);
      setImages(loadedImages);
    };
    
    importImages();
  }, []);

  const filteredImages = activeCategory === 'Toutes' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      className="py-24 px-6 bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-12 text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h2 
            className="text-4xl font-light mb-3"
            variants={item}
          >
            Galerie
          </motion.h2>
          
          <motion.div className="flex justify-center flex-wrap gap-3 mb-8" variants={item}>
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeCategory === category 
                    ? 'bg-white text-black' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md"
              variants={item}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              onClick={() => setSelectedImage(image)}
            >
              <motion.img
                src={image.src}
                alt={`Photo ${index + 1} - ${image.category}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                <p className="text-sm font-medium">{image.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal pour l'affichage en plein écran */}
      {selectedImage && (
        <motion.div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.button
            className="absolute top-4 right-4 text-white bg-black/20 p-2 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
          <motion.img
            src={selectedImage.src}
            alt="Photo en plein écran"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </motion.section>
  );
};

export default Gallery; 