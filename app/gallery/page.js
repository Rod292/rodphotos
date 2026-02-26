import Gallery from '../components/Gallery';
import { photos, categories } from '../data/photos';

export const metadata = {
  title: 'Galerie',
  description: 'Galerie de photographies par ROD — Paysages, Portraits, Street, Voyage',
  openGraph: {
    title: 'Galerie | ROD Photographie',
    description: 'Galerie de photographies par ROD — Paysages, Portraits, Street, Voyage',
    images: [{ url: '/photos/A7403945.jpg', width: 1200, height: 800, alt: 'Surfeur sur une vague turquoise' }],
  },
  alternates: {
    canonical: '/gallery',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'ROD Photographie — Galerie',
  description: 'Galerie de photographies par ROD',
  url: 'https://rodphotos.com/gallery',
  numberOfItems: photos.length,
  about: categories.filter(c => c.id !== 'all').map(c => c.label),
};

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Gallery />
    </>
  );
}
