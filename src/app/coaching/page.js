import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getCoaches } from '@/lib/data-fetchers';
import { Medal, Target, Users, UserRound, Dumbbell, Clock } from 'lucide-react';
import { ContactCta } from '@/components/shared/ContactCta';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { CoachCard } from '@/components/shared/CoachCard';

import { SchemaMarkup, generateServiceSchema } from '@/components/seo/SchemaMarkup';

export const metadata = {
  title: 'Professional Sports Coaching in Jaipur',
  description: 'Beginner to advanced coaching across badminton, table tennis & more, led by professional coaches at Bharti Sports Arena, Jaipur.',
};

export default async function CoachingPage() {
  const coaches = await getCoaches();

  const schema = generateServiceSchema({
    name: "Professional Sports Coaching",
    description: "Beginner to advanced coaching across multiple sports by professional coaches.",
    providerName: "Bharti Sports Arena",
    providerUrl: "https://bhartisportsarena.com"
  });

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="page-banner relative">
        {/* Blurred background image — replaces the default page-banner bg */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/sports/coaching-hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.02)',
          }}
        />
        {/* Dark gradient overlay — same treatment as default page-banner */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(120deg, rgba(5,20,10,0.85) 0%, rgba(5,20,60,0.75) 55%, rgba(5,20,10,0.85) 100%)',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1>Professional Coaching</h1>
          <div className="breadcrumb">
            Home <span className="mx-2">/</span> Coaching
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-heading font-bold text-3xl mb-6">Our Coaching Philosophy</h2>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            We believe in a holistic approach to sports education. Our programs are designed not just to improve technique, but to build character, resilience, and a deep understanding of the game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches?.map((coach) => (
            <CoachCard key={coach._id} coach={coach} />
          ))}
        </div>
      </Section>

      <Section alt id="batch-structure">
        <SectionHeader
          overline="PROGRAMS"
          title="Batch Structure"
          description="Structured learning paths for every age and skill level."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-8">
          <Card>
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-5">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Junior Batches (Age 5-14)</h3>
              <p className="text-body-sm text-text-secondary mb-4 leading-relaxed">Focuses on fundamentals, motor skills, and developing a love for the game in a fun environment.</p>
              <div className="text-sm font-medium text-primary">Indicative Timing: 4:00 PM - 6:00 PM</div>
              <div className="text-sm font-medium text-primary mt-1">Price: ₹1,500/month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-5">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Senior Batches (Age 15+)</h3>
              <p className="text-body-sm text-text-secondary mb-4 leading-relaxed">Tailored for older beginners and intermediate players looking to refine their skills and stay fit.</p>
              <div className="text-sm font-medium text-primary">Indicative Timing: 4:00 PM - 6:00 PM</div>
              <div className="text-sm font-medium text-primary mt-1">Price: ₹2,000/month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-5">
                <Dumbbell className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Casual Play</h3>
              <p className="text-body-sm text-text-secondary mb-4 leading-relaxed">Flexible casual play sessions for hobbyists and fitness enthusiasts.</p>
              <div className="text-sm font-medium text-primary">Price: ₹1,500/month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-5">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Pay & Play</h3>
              <p className="text-body-sm text-text-secondary mb-4 leading-relaxed">No commitment needed — just pay and play by the hour, subject to court availability.</p>
              <div className="text-sm font-medium text-primary">Price: ₹500/hour</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent">
                <Medal className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl mb-2">Tournament Preparation (Advanced)</h3>
                <p className="text-body-sm text-text-secondary mb-2 leading-relaxed">Intensive training, fitness conditioning, and match-play strategy for competitive athletes aiming for state and national level tournaments.</p>
                <div className="text-sm font-medium text-primary">Selection basis only. Morning & Evening sessions.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
      <ContactCta customText="Book a Free Trial Session with one of our expert coaches today." />
    </>
  );
}
