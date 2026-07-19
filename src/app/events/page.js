import { Section } from '@/components/ui/Section';
import { EventsTabs } from '@/components/events/EventsTabs';
import { ContactCta } from '@/components/shared/ContactCta';
import { getEvents, getPastEvents } from '@/lib/data-fetchers';
import { SchemaMarkup, generateEventSchema } from '@/components/seo/SchemaMarkup';

export const metadata = {
  title: 'Events & Tournaments',
  description: 'Stay updated on upcoming tournaments and past events at Bharti Sports Arena, Sikar\'s leading sports academy.',
};

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents(),
    getPastEvents(),
  ]);

  return (
    <>
      {upcomingEvents?.map(event => (
        <SchemaMarkup key={event._id} schema={generateEventSchema(event)} />
      ))}
      <div className="page-banner relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/sports/events-hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.02)',
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(120deg, rgba(5,20,10,0.85) 0%, rgba(5,20,60,0.75) 55%, rgba(5,20,10,0.85) 100%)',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1>Events & Tournaments</h1>
          <div className="breadcrumb">
            Home <span className="mx-2">/</span> Events
          </div>
        </div>
      </div>

      <Section>
        <EventsTabs upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
      </Section>

      <ContactCta />
    </>
  );
}
