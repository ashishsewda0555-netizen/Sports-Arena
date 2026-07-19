export default function robots() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://magnificent-speculoos-5bca4d.netlify.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}