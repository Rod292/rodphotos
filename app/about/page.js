import About from '../components/About';

export const metadata = {
  title: 'À propos',
  description: 'Découvrez ROD, photographe breton passionné par la nature et le film argentique',
  openGraph: {
    title: 'À propos | ROD Photographie',
    description: 'Découvrez ROD, photographe breton passionné par la nature et le film argentique',
    images: [{ url: '/ROD.png', width: 1200, height: 800, alt: 'ROD — Photographe' }],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <About />;
}
