import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSports } from '@/lib/data-fetchers';
import { ArrowRight } from 'lucide-react';
import { ContactCta } from '@/components/shared/ContactCta';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { Trophy } from 'lucide-react';

export const metadata = {
  title: 'Our Sports & Activities',
  description: 'Explore badminton, table tennis, snooker, carrom, chess, ludo & fitness facilities at Champions Sports Arena, Jaipur.',
};

export default async function SportsListingPage() {
  const sports = await getSports();

  return (
    <>
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Our Sports & Activities</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Sports
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-body-lg text-text-secondary">
            From high-intensity racquet sports to strategic mind games and complete fitness solutions, we offer world-class facilities for every enthusiast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sports?.map((sport) => (
            <Card key={sport._id} className="flex flex-col group hover:shadow-md transition-shadow">
              <div className="h-48 bg-surface-alt relative overflow-hidden">
                <FallbackImage 
                  src={sport.featuredImageId?.url || ''} 
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 p-2 rounded-full shadow-sm text-primary">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
              <CardHeader>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  {sport.category?.replace('-', ' ')}
                </div>
                <CardTitle>{sport.name}</CardTitle>
                <CardDescription className="line-clamp-2">{sport.shortDescription}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href={`/sports/${sport.slug}`} className="flex items-center text-primary group-hover:text-primary-dark transition-colors">
                    Explore {sport.name} <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
