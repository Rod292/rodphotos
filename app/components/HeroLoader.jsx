'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';

const Hero = dynamic(() => import('./Hero'), {
  ssr: false,
  loading: () => <div className="h-[100dvh] w-full bg-white" />,
});

export default function HeroLoader() {
  return (
    <div className="relative">
      {/* Titre de la page pour le référencement et les lecteurs d'écran, non affiché */}
      <h1 className="sr-only">ROD — Photographe en Bretagne</h1>

      <Hero />

      {/* Rendu côté serveur : visible avant le chargement du carrousel. Placé au centre
          de l'espace libre sous l'arc des cartes. */}
      <div className="hero-intro absolute inset-x-0 bottom-[16%] md:bottom-[22%] z-40 flex justify-center pointer-events-none">
        <Link
          href="/gallery"
          className="group btn-solid inline-flex items-center gap-2.5 px-7 py-3.5 text-base pointer-events-auto shadow-lg shadow-black/15"
        >
          Galerie
          <ArrowRight size={18} weight="bold" className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
