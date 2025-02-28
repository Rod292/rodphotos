import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-medium mb-3">ROD</h3>
              <p className="opacity-70 mb-4 max-w-md">
                Capturant la beauté éphémère de notre monde en mouvement à travers un objectif poétique.
              </p>
              <div className="flex space-x-4">
                {['Instagram', 'Twitter', 'Behance', 'Pinterest'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="opacity-60 hover:opacity-100"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-medium mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                {['Accueil', 'Galerie', 'À propos', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-medium mb-4">Services</h4>
              <ul className="space-y-2">
                {['Séances photo', 'Événements', 'Tirages d\'art', 'Cours de photographie'].map((service) => (
                  <li key={service}>
                    <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm opacity-70 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p>© {new Date().getFullYear()} ROD Photographie. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Conditions d'utilisation</a>
            <a href="#" className="hover:underline">Politique de confidentialité</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 