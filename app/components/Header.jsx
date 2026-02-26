'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/gallery', label: 'Galerie' },
  { href: '/about', label: 'A propos' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 10);
  });

  const closeMenu = () => setIsMenuOpen(false);

  const onHeroWhiteBg = isHome && !scrolled && !isMenuOpen;
  const textColor = onHeroWhiteBg ? 'text-zinc-900' : 'text-zinc-100';

  const headerBg = (scrolled || isMenuOpen || !isHome)
    ? 'bg-zinc-950/90 backdrop-blur-md shadow-xs'
    : 'bg-transparent';

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        <Link href="/" aria-label="ROD - Accueil">
          <motion.span
            className={`text-2xl tracking-tight font-light ${textColor}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            ROD
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={`relative text-sm tracking-wide transition-colors ${
                    isActive
                      ? (onHeroWhiteBg ? 'text-zinc-900' : 'text-zinc-100')
                      : (onHeroWhiteBg ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-500 hover:text-zinc-300')
                  }`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      className={`absolute -bottom-1 left-0 right-0 h-px ${onHeroWhiteBg ? 'bg-zinc-900' : 'bg-zinc-400'}`}
                      layoutId="nav-underline"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
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
            className="md:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            aria-label="Navigation mobile"
          >
            <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 20, delay: index * 0.05 }}
                >
                  <Link href={item.href} onClick={closeMenu}>
                    <span className={`block py-2 text-lg font-light tracking-wide transition-colors ${
                      pathname === item.href ? 'text-zinc-100' : 'text-zinc-500'
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
