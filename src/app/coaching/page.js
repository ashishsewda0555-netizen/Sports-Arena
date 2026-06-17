import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getCoaches } from '@/lib/data-fetchers';
import { Medal, Target, Users, UserRound } from 'lucide-react';
import { ContactCta } from '@/components/shared/ContactCta';
import { FallbackImage } from '@/components/ui/FallbackImage';

import { SchemaMarkup, generateServiceSchema } from '@/components/seo/SchemaMarkup';

export const metadata = {
  title: 'Professional Sports Coaching in Jaipur',
  description: 'Beginner to advanced coaching across badminton, table tennis & more, led by national-level coaches at Champions Sports Arena, Jaipur.',
};

export default async function CoachingPage() {
  const coaches = await getCoaches();

  const schema = generateServiceSchema({
    name: "Professional Sports Coaching",
    description: "Beginner to advanced coaching across multiple sports by national-level coaches.",
    providerName: "Champions Sports Arena",
    providerUrl: "https://championssportsarena.com"
  });

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Professional Coaching</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Coaching
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-heading font-bold text-3xl mb-6">Our Coaching Philosophy</h2>
          <p className="text-body-lg text-text-secondary">
            We believe in a holistic approach to sports education. Our programs are designed not just to improve technique, but to build character, resilience, and a deep understanding of the game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches?.map((coach) => (
            <Card key={coach._id} id={coach._id} className="flex flex-col h-full">
              <div className="aspect-[4/5] bg-surface-alt relative overflow-hidden">
                <FallbackImage 
                  src={coach.imageUrl || ''} 
                  alt={coach.name} 
                  fallbackIcon="UserRound"
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardContent className="pt-6 flex-grow flex flex-col">
                <CardTitle as="h3" className="text-2xl mb-1">{coach.name}</CardTitle>
                <p className="text-primary font-medium mb-3">{coach.specialization}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="default">{coach.experienceYears} Years Exp.</Badge>
                  {coach.certifications?.slice(0,1).map((cert, i) => (
                    <Badge key={i} variant="default" className="line-clamp-1 truncate max-w-[150px]">{cert}</Badge>
                  ))}
                </div>
                <div 
                  className="text-body-sm text-text-secondary line-clamp-3 mb-6 flex-grow"
                  dangerouslySetInnerHTML={{ __html: coach.bio }}
                />
                
                {coach.achievements?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase text-text-primary mb-2">Key Achievements</p>
                    <ul className="text-body-sm text-text-secondary space-y-1 list-disc list-inside">
                      {coach.achievements.slice(0, 2).map((achievement, i) => (
                        <li key={i} className="line-clamp-1">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button variant="secondary" className="w-full mt-auto">Book a Trial Session</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section alt id="batch-structure">
        <SectionHeader
          overline="PROGRAMS"
          title="Batch Structure"
          description="Structured learning paths for every age and skill level."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Junior Batches (Age 5-15)</h3>
              <p className="text-body-sm text-text-secondary mb-4">Focuses on fundamentals, motor skills, and developing a love for the game in a fun environment.</p>
              <div className="text-sm font-medium">Indicative Timing: 4:00 PM - 6:00 PM</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Senior Batches (Age 16+)</h3>
              <p className="text-body-sm text-text-secondary mb-4">Tailored for older beginners and intermediate players looking to refine their skills and stay fit.</p>
              <div className="text-sm font-medium">Indicative Timing: 6:00 PM - 8:00 PM</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 shrink-0 rounded-full bg-accent/20 flex items-center justify-center text-[#1A1F1B]">
                <Medal className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl mb-2">Tournament Preparation (Advanced)</h3>
                <p className="text-body-sm text-text-secondary mb-2">Intensive training, fitness conditioning, and match-play strategy for competitive athletes aiming for state and national level tournaments.</p>
                <div className="text-sm font-medium">Selection basis only. Morning & Evening sessions.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
      <ContactCta customText="Book a Free Trial Session with one of our expert coaches today." />
    </>
  );
}
