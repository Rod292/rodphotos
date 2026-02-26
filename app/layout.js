import { Montserrat } from 'next/font/google';
import './styles/globals.css';
import Header from './components/Header';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata = {
  title: 'ROD - Photographie',
  description: 'Portfolio de photographie minimaliste par ROD, photographe breton',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={montserrat.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
