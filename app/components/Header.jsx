'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [activeSection]);

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' }
  ];

  const isLightSection = activeSection === 'home' && !scrolled && !isMenuOpen;

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out-expo ${
        scrolled || isMenuOpen || activeSection !== 'home'
          ? 'bg-black/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 md:px-8 py-5 flex justify-between items-center">
        {/* Logo */}
        <motion.button
          className={`logo-wordmark cursor-pointer transition-colors duration-300 ${
            isLightSection ? 'text-black' : 'text-white'
          }`}
          onClick={() => setActiveSection('home')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ROD
        </motion.button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`nav-link transition-colors duration-300 ${
                activeSection === item.id
                  ? isLightSection ? 'text-black' : 'text-white'
                  : isLightSection ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'
              } ${activeSection === item.id ? 'active' : ''}`}
              whileTap={{ scale: 0.98 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className={`md:hidden relative w-8 h-8 flex flex-col justify-center items-center ${
            isLightSection ? 'text-black' : 'text-white'
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <motion.span
            className={`block w-6 h-[1px] bg-current transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-[1px]' : '-translate-y-1'
            }`}
          />
          <motion.span
            className={`block w-6 h-[1px] bg-current transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <motion.span
            className={`block w-6 h-[1px] bg-current transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-[1px]' : 'translate-y-1'
            }`}
          />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-[72px] bg-black/98 backdrop-blur-lg"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="container mx-auto px-6 py-12 flex flex-col">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`text-left py-4 font-display text-3xl tracking-wide transition-colors ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-white/40 hover:text-white'
                  }`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.div
                className="divider mt-8"
                variants={itemVariants}
              />

              <motion.p
                className="text-white/30 text-sm mt-4"
                variants={itemVariants}
              >
                Photographe breton
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
