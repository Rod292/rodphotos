import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './styles/globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'ROD - Photographie',
  description: 'Portfolio de photographie minimaliste par ROD, photographe breton. Paysages, portraits, street photography et surf.',
  keywords: ['photographie', 'photographe', 'bretagne', 'paysage', 'portrait', 'street', 'surf', 'ROD'],
  authors: [{ name: 'ROD' }],
  creator: 'ROD',
  metadataBase: new URL('https://rod-photos.com'),
  openGraph: {
    title: 'ROD - Photographie',
    description: 'Portfolio de photographie minimaliste par ROD, photographe breton.',
    url: 'https://rod-photos.com',
    siteName: 'ROD Photographie',
    images: [
      {
        url: '/photos/A7403945.jpg',
        width: 1200,
        height: 630,
        alt: 'ROD Photographie',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROD - Photographie',
    description: 'Portfolio de photographie minimaliste par ROD, photographe breton.',
    images: ['/photos/A7403945.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ROD Photographie',
  description: 'Photographe professionnel basé en Bretagne, spécialisé dans les paysages, portraits, street photography et photographie de surf.',
  url: 'https://rod-photos.com',
  image: 'https://rod-photos.com/photos/A7403945.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  },
  priceRange: '$$',
  sameAs: [
    'https://instagram.com',
    'https://arode.studio',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
} 