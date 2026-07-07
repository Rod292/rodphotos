import { Outfit } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './styles/globals.css';
import Header from './components/Header';
import ConditionalFooter from './components/ConditionalFooter';
import MotionProvider from './components/MotionProvider';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.photosrod.com'),
  title: {
    default: 'ROD - Photographie',
    template: '%s | ROD Photographie',
  },
  description: 'Portfolio de photographie minimaliste par ROD, photographe breton — paysages, portraits, street et voyage.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'ROD Photographie',
    title: 'ROD - Photographie',
    description: 'Portfolio de photographie minimaliste par ROD, photographe breton.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Golden Gate Bridge au coucher du soleil' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROD - Photographie',
    description: 'Portfolio de photographie minimaliste par ROD, photographe breton.',
    images: ['/og.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ROD Photographie',
  description: 'Photographe breton spécialisé en paysages, portraits, street et voyage.',
  url: 'https://www.photosrod.com',
  sameAs: ['https://instagram.com/pcklerod'],
  image: 'https://www.photosrod.com/og.jpg',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={outfit.className}>
        <a href="#main-content" className="skip-to-content">
          Aller au contenu principal
        </a>
        <MotionProvider>
          <Header />
          <main id="main-content">{children}</main>
          <ConditionalFooter />
        </MotionProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
