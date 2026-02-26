'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/gallery', label: 'Galerie' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = (isHome && !scrolled && !isMenuOpen) ? 'text-black' : 'text-white';

  const headerBg = (scrolled || isMenuOpen || !isHome)
    ? 'bg-black/90 backdrop-blur-md shadow-xs'
    : 'bg-transparent';

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" aria-label="ROD - Accueil">
          <motion.span
            className={`text-2xl font-light ${textColor}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            ROD
          </motion.span>
        </Link>

        <nav className="hidden md:flex space-x-8" aria-label="Navigation principale">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={`text-sm font-light tracking-wide transition-colors ${
                    isActive
                      ? (isHome && !scrolled) ? 'text-black' : 'text-white'
                      : (isHome && !scrolled) ? 'text-black/60 hover:text-black' : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <button
          className={`md:hidden flex flex-col justify-center items-center w-8 h-8 ${textColor}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
        >
          <span className={`block w-6 h-0.5 bg-current mb-1.5 transition-transform duration-300 ${
            isMenuOpen ? 'rotate-45 translate-y-2' : ''
          }`} />
          <span className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-0' : 'opacity-100'
          }`} />
          <span className={`block w-6 h-0.5 bg-current mt-1.5 transition-transform duration-300 ${
            isMenuOpen ? '-rotate-45 -translate-y-2' : ''
          }`} />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            aria-label="Navigation mobile"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href} onClick={closeMenu}>
                    <span className={`block py-2 text-lg font-light tracking-wide transition-colors ${
                      pathname === item.href ? 'text-white' : 'text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
