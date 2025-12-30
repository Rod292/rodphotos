'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Simuler un temps de chargement pour l'animation d'entrée
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 flex items-center justify-center bg-black z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white logo-wordmark text-5xl"
          >
            ROD
          </motion.div>
        </motion.div>
      ) : (
        <div className={`min-h-screen ${activeSection === 'home' ? 'overflow-hidden' : ''}`}>
          <Header activeSection={activeSection} setActiveSection={setActiveSection} />
          
          <main>
            <AnimatePresence mode="wait">
              {activeSection === 'home' && <Hero key="hero" setActiveSection={setActiveSection} />}
              {activeSection === 'gallery' && <Gallery key="gallery" />}
              {activeSection === 'about' && <About key="about" setActiveSection={setActiveSection} />}
              {activeSection === 'contact' && <Contact key="contact" />}
            </AnimatePresence>
          </main>
        </div>
      )}
    </AnimatePresence>
  );
} 