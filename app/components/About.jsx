'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const About = () => {
  return (
    <motion.section 
      className="min-h-screen w-full pt-24 pb-16 px-4 md:px-8 section-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-4xl">
        <motion.h1 
          className="text-3xl md:text-4xl font-light mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          À propos
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Photo de profil */}
          <motion.div 
            className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/ROD-optimized.jpg')",
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
              aria-label="Portrait de ROD"
            />
          </motion.div>
          
          {/* Texte de présentation */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-light mb-4">ROD</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Je suis ROD, un photographe breton de 24 ans passionné par la capture de moments simples, la nature, et les couleurs uniques du film argentique.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Mon approche photographique se concentre sur la beauté du quotidien, les paysages naturels et l'authenticité des instants capturés. J'aime particulièrement travailler avec la photographie argentique pour sa richesse de tons et son caractère inimitable.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Je réalise également des photos de surf, capturant l'énergie des vagues et la passion des surfeurs en action. Pour découvrir mon travail dédié à l'univers du surf, visitez Arode Studio.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Je propose mes photos à la vente et je réalise également des séances photo de style lifestyle pour vos futures campagnes. N'hésitez pas à me contacter pour discuter de vos projets ou pour acquérir mes œuvres.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Instagram
                </motion.button>
              </Link>
              
              <motion.button
                onClick={() => window.location.href = '#contact'}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact
              </motion.button>
              
              <Link href="https://arode.studio" target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="btn-primary flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">🏄</span> Arode Studio
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About; 