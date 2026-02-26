import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: '404 — Page introuvable',
};

export default function NotFound() {
  return (
    <section className="min-h-[100dvh] w-full flex items-center justify-center bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Background photo with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/photos/DSCF5470.jpg"
          alt=""
          fill
          className="object-cover opacity-20 blur-sm"
          priority
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        <p className="text-8xl md:text-9xl font-light tracking-tighter mb-4 text-zinc-300">
          404
        </p>
        <h1 className="text-xl md:text-2xl font-light tracking-tight mb-3">
          Page introuvable
        </h1>
        <p className="text-zinc-500 font-light mb-10 leading-relaxed">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-block text-center">
            Retour à l&apos;accueil
          </Link>
          <Link href="/gallery" className="btn-primary inline-block text-center">
            Voir la galerie
          </Link>
        </div>
      </div>
    </section>
  );
}
