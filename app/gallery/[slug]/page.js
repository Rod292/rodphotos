import { notFound } from 'next/navigation';
import { photos, categories, getPhotoById, getAdjacentPhotos, CATEGORY_SLUGS } from '../../data/photos';
import PhotoPage from './PhotoPage';
import CategoryPage from './CategoryPage';

export function generateStaticParams() {
  const photoParams = photos.map(p => ({ slug: p.id }));
  const categoryParams = CATEGORY_SLUGS.map(slug => ({ slug }));
  return [...photoParams, ...categoryParams];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (CATEGORY_SLUGS.includes(slug)) {
    const category = categories.find(c => c.id === slug);
    const label = category?.label || slug;
    return {
      title: `${label}`,
      description: `Photographies ${label.toLowerCase()} par ROD — Portfolio photographe breton`,
      openGraph: {
        title: `${label} | ROD Photographie`,
        description: `Photographies ${label.toLowerCase()} par ROD`,
        images: [{ url: '/photos/DSCF5550.jpg', width: 1200, height: 800 }],
      },
      alternates: { canonical: `/gallery/${slug}` },
    };
  }

  const photo = getPhotoById(slug);
  if (!photo) return {};

  return {
    title: photo.title,
    description: photo.description,
    openGraph: {
      title: `${photo.title} | ROD Photographie`,
      description: photo.description,
      images: [{ url: photo.path, width: 1200, height: 800, alt: photo.alt }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${photo.title} | ROD Photographie`,
      description: photo.description,
      images: [photo.path],
    },
    alternates: { canonical: `/gallery/${slug}` },
  };
}

export default async function SlugPage({ params }) {
  const { slug } = await params;

  if (CATEGORY_SLUGS.includes(slug)) {
    return <CategoryPage slug={slug} />;
  }

  const photo = getPhotoById(slug);
  if (!photo) notFound();

  const { prev, next } = getAdjacentPhotos(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: photo.title,
    description: photo.description,
    contentUrl: `https://rodphotos.com${photo.path}`,
    thumbnailUrl: `https://rodphotos.com${photo.path}`,
    author: { '@type': 'Person', name: 'ROD' },
    copyrightHolder: { '@type': 'Person', name: 'ROD' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PhotoPage photo={photo} prev={prev} next={next} />
    </>
  );
}
