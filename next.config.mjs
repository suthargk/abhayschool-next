import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

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
      {
        source: "/faculty",
        destination: "/about/faculty",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
