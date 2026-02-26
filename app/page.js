'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('./components/Hero'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-white" />,
});

export default function Home() {
  return <Hero />;
}
