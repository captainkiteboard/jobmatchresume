import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  i18n: {
    locales: ['en', 'nl', 'de', 'fr', 'it', 'es', 'pt'],
    defaultLocale: 'en',
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
