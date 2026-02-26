import { Suspense } from 'react';
import Contact from '../components/Contact';

export const metadata = {
  title: 'Contact',
  description: 'Contactez ROD pour vos projets de photographie',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  );
}
