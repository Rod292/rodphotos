'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('./Hero'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-white" />,
});

export default function HeroLoader() {
  return <Hero />;
}
