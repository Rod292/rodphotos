import { photos, CATEGORY_SLUGS } from './data/photos';

export default function sitemap() {
  const staticPages = [
    {
      url: 'https://rodphotos.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://rodphotos.com/gallery',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://rodphotos.com/about',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://rodphotos.com/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  const categoryPages = CATEGORY_SLUGS.map(slug => ({
    url: `https://rodphotos.com/gallery/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const photoPages = photos.map(photo => ({
    url: `https://rodphotos.com/gallery/${photo.id}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...photoPages];
}
