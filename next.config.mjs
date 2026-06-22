/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  experimental: { mcpServer: false },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/catalogo.pdf",
        destination: "/recursos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;