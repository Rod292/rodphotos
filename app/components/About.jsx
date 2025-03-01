'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
            <Image
              src="/profilepicture.JPG"
              alt="Portrait du photographe"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
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
              Photographe autodidacte basé à Paris, je capture des moments authentiques à travers mon objectif depuis plus de 8 ans.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Ma passion pour la photographie m'a amené à explorer différents styles, des paysages urbains aux portraits intimes, en passant par la photographie de rue.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Je cherche à capturer l'essence des moments et des lieux, en mettant l'accent sur la lumière naturelle et les compositions authentiques.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About; 