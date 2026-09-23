'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const Hero = dynamic(() => import('./Hero'), {
  ssr: false,
  loading: () => <div className="h-[100dvh] w-full bg-white" />,
});

export default function HeroLoader() {
  return (
    <div className="relative">
      <Hero />

      {/* Accroche rendue côté serveur : visible avant le chargement du carrousel et indexable */}
      <div className="hero-intro absolute inset-x-0 bottom-[5%] md:bottom-8 z-40 flex flex-col items-center text-center px-6 pointer-events-none">
        <h1 className="text-2xl md:text-4xl font-light tracking-tight text-zinc-900">
          Photographe en Bretagne
        </h1>
        <p className="mt-2 mb-6 text-sm md:text-base text-zinc-600 tracking-wide">
          Surf · Paysages · Street · Voyage — numérique &amp; argentique
        </p>
        <Link href="/gallery" className="btn-solid pointer-events-auto">
          Découvrir la galerie
        </Link>
      </div>
    </div>
  );
}
