import { photos, CATEGORY_SLUGS } from './data/photos';

const BASE_URL = 'https://www.photosrod.com';

export default function sitemap() {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  const categoryPages = CATEGORY_SLUGS.map(slug => ({
    url: `${BASE_URL}/gallery/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const photoPages = photos.map(photo => ({
    url: `${BASE_URL}/gallery/${photo.id}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...photoPages];
}
