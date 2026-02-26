import HeroLoader from './components/HeroLoader';

export const metadata = {
  title: 'ROD - Photographie',
  description: 'Portfolio de photographie minimaliste par ROD, photographe breton — paysages, portraits, street et voyage.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <HeroLoader />;
}
