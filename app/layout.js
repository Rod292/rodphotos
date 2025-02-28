import { Inter } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ROD - Photographie',
  description: 'Portfolio de photographie minimaliste',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 