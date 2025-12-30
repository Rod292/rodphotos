'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const About = ({ setActiveSection }) => {
  return (
    <motion.section
      className="min-h-screen w-full pt-32 pb-24 px-6 md:px-12 section-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="section-title">À propos</h1>
          <div className="divider" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Profile Image */}
          <motion.div
            className="relative aspect-[4/5] overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Image
              src="/ROD-optimized.jpg"
              alt="Portrait de ROD"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 border border-white/10" />
          </motion.div>

          {/* Bio Content */}
          <motion.div
            className="flex flex-col justify-center lg:py-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <h2 className="font-display text-4xl md:text-5xl mb-8 tracking-wide">ROD</h2>

            <div className="space-y-5 text-white/70 leading-relaxed">
              <p>
                Je suis ROD, un photographe breton de 25 ans passionné par la capture
                de moments simples, la nature, et les couleurs uniques du film argentique.
              </p>
              <p>
                Mon approche photographique se concentre sur la beauté du quotidien,
                les paysages naturels et l'authenticité des instants capturés. J'aime
                particulièrement travailler avec la photographie argentique pour sa
                richesse de tons et son caractère inimitable.
              </p>
              <p>
                Je réalise également des photos de surf, capturant l'énergie des vagues
                et la passion des surfeurs en action. Pour découvrir mon travail dédié
                à l'univers du surf, visitez Arode Studio.
              </p>
              <p>
                Je propose mes photos à la vente et je réalise également des séances
                photo de style lifestyle pour vos futures campagnes.
              </p>
            </div>

            <div className="divider mt-10" />

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  className="btn-primary"
                  whileTap={{ scale: 0.98 }}
                >
                  Instagram
                </motion.button>
              </Link>

              <motion.button
                onClick={() => setActiveSection('contact')}
                className="btn-primary"
                whileTap={{ scale: 0.98 }}
              >
                Contact
              </motion.button>

              <Link
                href="https://arode.studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  className="btn-primary"
                  whileTap={{ scale: 0.98 }}
                >
                  Arode Studio
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
