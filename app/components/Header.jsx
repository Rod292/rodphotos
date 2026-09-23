'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { spring } from '../lib/motion';
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

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 10);
  });

  const closeMenu = () => setIsMenuOpen(false);

  // Menu mobile : Échap pour fermer, page figée derrière
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const headerBg = (scrolled || isMenuOpen || !isHome)
    ? 'bg-white/90 backdrop-blur-md shadow-xs'
    : 'bg-transparent';

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        <Link href="/" aria-label="ROD - Accueil">
          <span className="text-2xl tracking-tight font-light text-zinc-900">
            ROD
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}>
                <span
                  className={`relative text-sm tracking-wide transition-colors ${
                    active ? 'text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-px bg-zinc-900"
                      layoutId="nav-underline"
                      transition={spring.snappy}
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 -mr-2 text-zinc-900"
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
            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={spring.smooth}
            aria-label="Navigation mobile"
          >
            <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring.smooth, delay: index * 0.05 }}
                >
                  <Link href={item.href} onClick={closeMenu} aria-current={isActive(item.href) ? 'page' : undefined}>
                    <span className={`block py-2 text-lg font-light tracking-wide transition-colors ${
                      isActive(item.href) ? 'text-zinc-900' : 'text-zinc-600'
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
