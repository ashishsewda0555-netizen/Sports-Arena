import { getSports, getEvents } from '@/lib/data-fetchers';

export default async function sitemap() {
  const baseUrl = 'https://championssportsarena.com';

  const [sports, events] = await Promise.all([
    getSports(),
    getEvents(),
  ]);

  const staticRoutes = [
    '',
    '/about',
    '/sports',
    '/coaching',
    '/pricing',
    '/facilities',
    '/events',
    '/gallery',
    '/testimonials',
    '/faq',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const sportRoutes = (sports || []).map((sport) => ({
    url: `${baseUrl}/sports/${sport.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // We are currently rendering events on the events listing page. 
  // If we add event detail pages later, we would map them here:
  // const eventRoutes = (events || []).map((event) => ({
  //   url: `${baseUrl}/events/${event._id}`,
  //   lastModified: new Date(event.startDate),
  //   changeFrequency: 'monthly',
  //   priority: 0.7,
  // }));

  return [...staticRoutes, ...sportRoutes];
}
