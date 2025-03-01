/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // La propriété swcMinify n'est plus nécessaire dans Next.js 15+
};

export default nextConfig; 