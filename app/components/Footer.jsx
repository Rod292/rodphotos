import { InstagramLogo, Envelope } from '@phosphor-icons/react/dist/ssr';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50 py-8 px-4 md:px-10">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-400 text-sm font-light tracking-wide">
          &copy; {year} ROD Photographie
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/pcklerod"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <InstagramLogo size={22} weight="light" />
          </a>
          <a
            href="mailto:photos.pers@gmail.com"
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Email"
          >
            <Envelope size={22} weight="light" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
