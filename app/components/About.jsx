'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const About = () => {
  return (
    <motion.section 
      className="min-h-screen w-full pt-24 pb-16 px-4 md:px-8 bg-white"
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
            <p className="text-gray-700 mb-4 leading-relaxed">
              Passionné de photographie depuis plus de 10 ans, je capture des moments uniques et des émotions authentiques à travers mon objectif.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Mon approche photographique se concentre sur la simplicité et l'authenticité, cherchant à révéler la beauté dans les détails du quotidien et les paysages qui nous entourent.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Basé à Paris, je travaille sur des projets personnels et des commandes, toujours avec le même souci du détail et la recherche d'une esthétique minimaliste.
            </p>
          </motion.div>
        </div>
        
        {/* Section équipement */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-light mb-6">Équipement</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              <span className="text-gray-700">Fujifilm X-T4</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              <span className="text-gray-700">Fujifilm 23mm f/1.4</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              <span className="text-gray-700">Fujifilm 35mm f/2</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              <span className="text-gray-700">Fujifilm 56mm f/1.2</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              <span className="text-gray-700">Sony A7 IV</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              <span className="text-gray-700">Sony 24-70mm f/2.8 GM</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About; 