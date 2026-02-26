'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { CaretLeft, CaretRight, ArrowLeft } from '@phosphor-icons/react';

const PhotoPage = ({ photo, prev, next }) => {
  return (
    <motion.section
      className="min-h-[100dvh] w-full bg-zinc-950 text-zinc-100 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Back button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm tracking-wide"
          >
            <ArrowLeft size={18} weight="light" />
            Retour à la galerie
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Photo */}
          <motion.div
            className="relative w-full lg:w-2/3 aspect-[4/3] rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            <Image
              src={photo.path}
              alt={photo.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="lg:w-1/3 flex flex-col justify-center pb-12 lg:pb-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.15 }}
          >
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">{photo.title}</h1>
            <p className="text-zinc-400 font-light leading-relaxed mb-8">{photo.description}</p>

            {photo.technical && (
              <div className="mb-8 space-y-2">
                <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-3">Détails techniques</h2>
                <p className="text-sm text-zinc-400">
                  <span className="text-zinc-300">Appareil</span> — {photo.technical.camera}
                </p>
                <p className="text-sm text-zinc-400">
                  <span className="text-zinc-300">Objectif</span> — {photo.technical.lens}
                </p>
                <p className="text-sm text-zinc-400">
                  <span className="text-zinc-300">ISO</span> — {photo.technical.iso}
                </p>
              </div>
            )}

            <Link
              href={`/contact?photo=${photo.id}`}
              className="btn-primary inline-block text-center self-start mb-8"
            >
              Demander un tirage
            </Link>

            {/* Prev/Next navigation */}
            <div className="flex items-center gap-4 pt-6 border-t border-zinc-800/50">
              {prev ? (
                <Link
                  href={`/gallery/${prev.id}`}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  <CaretLeft size={18} weight="light" />
                  {prev.title}
                </Link>
              ) : (
                <span />
              )}
              <span className="flex-1" />
              {next && (
                <Link
                  href={`/gallery/${next.id}`}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  {next.title}
                  <CaretRight size={18} weight="light" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default PhotoPage;
