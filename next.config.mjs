/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/principal-message",
        destination: "/about/principal-message",
        permanent: true,
      },
      {
        source: "/toppers",
        destination: "/achievements/toppers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
