'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { InstagramLogo } from '@phosphor-icons/react';

const About = () => {
  return (
    <section
      className="min-h-[100dvh] w-full pt-24 pb-16 px-4 md:px-10 bg-white text-zinc-900">
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="text-4xl md:text-6xl tracking-tighter leading-none mb-10 md:mb-16 font-light">
          À propos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 md:gap-16 items-start">
          <motion.div
            className="relative w-full aspect-[3/4] max-h-[70vh] rounded-lg overflow-hidden"
          >
            <Image
              src="/ROD.png"
              alt="Portrait de ROD, photographe"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </motion.div>

          <motion.div
            className="flex flex-col justify-start pt-0 md:pt-8"
          >
            <h2 className="text-3xl md:text-4xl tracking-tighter font-light mb-6">ROD</h2>
            <div className="space-y-4 max-w-[65ch]">
              <p className="text-base text-zinc-600 leading-relaxed">
                Je suis ROD, un photographe breton de 25 ans passionné par la capture de moments simples, la nature, et les couleurs uniques du film argentique.
              </p>
              <p className="text-base text-zinc-600 leading-relaxed">
                {"Mon approche photographique se concentre sur la beauté du quotidien, les paysages naturels et l'authenticité des instants capturés. J'aime particulièrement travailler avec la photographie argentique pour sa richesse de tons et son caractère inimitable."}
              </p>
              <p className="text-base text-zinc-600 leading-relaxed">
                {"Je réalise également des photos de surf, capturant l'énergie des vagues et la passion des surfeurs en action."}
              </p>
              <p className="text-base text-zinc-600 leading-relaxed">
                {"Je propose mes photos à la vente et je réalise également des séances photo de style lifestyle pour vos futures campagnes. N'hésitez pas à me contacter pour discuter de vos projets ou pour acquérir mes œuvres."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/contact" className="btn-solid">
                Me contacter
              </Link>

              <a
                href="https://instagram.com/pcklerod"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <InstagramLogo size={18} weight="light" />
                Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
