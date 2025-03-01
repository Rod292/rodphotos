'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Gestion du défilement pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Fermer le menu lorsqu'une section est sélectionnée
  useEffect(() => {
    setIsMenuOpen(false);
  }, [activeSection]);
  
  // Variantes d'animation pour le menu
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };
  
  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' }
  ];
  
  // Déterminer la couleur du texte en fonction de la section active
  const getTextColor = () => {
    if (activeSection === 'home' && !scrolled && !isMenuOpen) {
      return 'text-black';
    }
    return 'text-white';
  };
  
  return (
    <motion.header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || isMenuOpen || activeSection !== 'home' 
          ? 'bg-black/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className={`text-2xl font-light cursor-pointer ${getTextColor()}`}
          onClick={() => setActiveSection('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          ROD
        </motion.div>
        
        {/* Navigation desktop */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-sm font-light tracking-wide transition-colors ${
                activeSection === item.id 
                  ? (activeSection === 'home' && !scrolled) ? 'text-black' : 'text-white' 
                  : (activeSection === 'home' && !scrolled) ? 'text-black/70 hover:text-black' : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>
        
        {/* Bouton menu mobile */}
        <motion.button
          className={`md:hidden flex flex-col justify-center items-center w-8 h-8 ${getTextColor()}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            className={`block w-6 h-0.5 ${getTextColor()} mb-1.5 transition-transform ${
              isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <motion.span
            className={`block w-6 h-0.5 ${getTextColor()} transition-opacity ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <motion.span
            className={`block w-6 h-0.5 ${getTextColor()} mt-1.5 transition-transform ${
              isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </motion.button>
      </div>
      
      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md shadow-md"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {navItems.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`text-left py-2 text-lg font-light tracking-wide transition-colors ${
                    activeSection === item.id 
                      ? 'text-white' 
                      : 'text-gray-400'
                  }`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header; 