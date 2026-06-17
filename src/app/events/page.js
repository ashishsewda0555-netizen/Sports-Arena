import { Section } from '@/components/ui/Section';
import { EventsTabs } from '@/components/events/EventsTabs';
import { ContactCta } from '@/components/shared/ContactCta';
import { getEvents, getPastEvents } from '@/lib/data-fetchers';
import { SchemaMarkup, generateEventSchema } from '@/components/seo/SchemaMarkup';

export const metadata = {
  title: 'Events & Tournaments',
  description: 'Stay updated on upcoming tournaments and past events at Champions Sports Arena, Jaipur\'s leading sports academy.',
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
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Events & Tournaments</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
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
