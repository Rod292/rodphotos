'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const About = () => {
  return (
    <motion.section
      className="min-h-screen w-full pt-24 pb-16 px-4 md:px-8 bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
          <motion.div
            className="relative w-full aspect-square rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/ROD.png"
              alt="Portrait de ROD, photographe"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              preload
            />
          </motion.div>

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
              {"Mon approche photographique se concentre sur la beauté du quotidien, les paysages naturels et l'authenticité des instants capturés. J'aime particulièrement travailler avec la photographie argentique pour sa richesse de tons et son caractère inimitable."}
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {"Je réalise également des photos de surf, capturant l'énergie des vagues et la passion des surfeurs en action."}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {"Je propose mes photos à la vente et je réalise également des séances photo de style lifestyle pour vos futures campagnes. N'hésitez pas à me contacter pour discuter de vos projets ou pour acquérir mes œuvres."}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="https://instagram.com/pcklerod" target="_blank" rel="noopener noreferrer">
                <motion.span
                  className="btn-primary inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Instagram
                </motion.span>
              </Link>

              <Link href="/contact">
                <motion.span
                  className="btn-primary inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
