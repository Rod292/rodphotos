import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Header = ({ activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' }
  ];

  // Déterminer la couleur du texte en fonction de la section active ET du scroll
  const whiteTextSections = ['gallery', 'about', 'contact'];
  const isWhiteTextSection = whiteTextSections.includes(activeSection);
  
  // Si scrolled est true, utiliser toujours du texte noir, sinon se baser sur la section active
  const textColor = scrolled ? 'text-black' : (isWhiteTextSection ? 'text-white' : 'text-black');
  const hoverTextColor = scrolled ? 'hover:text-gray-800' : (isWhiteTextSection ? 'hover:text-gray-300' : 'hover:text-gray-800');
  const underlineColor = scrolled ? 'bg-black' : (isWhiteTextSection ? 'bg-white' : 'bg-black');

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          className={`text-2xl font-medium ${textColor}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button onClick={() => setActiveSection('home')} className={textColor}>ROD</button>
        </motion.div>

        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <motion.button
                  className={`relative py-2 ${textColor} ${
                    activeSection === item.id 
                      ? 'font-medium' 
                      : hoverTextColor
                  }`}
                  onClick={() => setActiveSection(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${underlineColor}`}
                      layoutId="navigation-underline"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              </li>
            ))}
          </ul>
          
          <motion.a
            href="https://www.arodestudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-8 px-4 py-2 rounded-full border flex items-center space-x-2 ${
              scrolled
                ? 'border-black text-black hover:bg-black hover:text-white'
                : (isWhiteTextSection 
                  ? 'border-white text-white hover:bg-white hover:text-black' 
                  : 'border-black text-black hover:bg-black hover:text-white')
            } transition-colors duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">🏄‍♂️</span>
            <span>Arode Studio</span>
          </motion.a>
        </nav>

        <motion.button
          className={`block md:hidden ${textColor}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header; 