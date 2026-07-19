import Link from 'next/link';
import Image from 'next/image';
import { SafeImage } from '@/components/ui/SafeImage';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { getSports } from '@/lib/data-fetchers';
import { ArrowRight, Trophy, Dumbbell, Table2, Target } from 'lucide-react';
import { ContactCta } from '@/components/shared/ContactCta';
import { IMAGES, getSportImage } from '@/lib/images';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata = {
  title: 'Our Sports & Activities',
  description: 'Explore badminton, table tennis, snooker, carrom, chess & fitness facilities at Bharti Sports Arena, Sikar.',
};

/** Curated fallback sports for when the DB is empty */
const FALLBACK_SPORTS = [
  {
    _id: 'fb-badminton',
    name: 'Badminton',
    slug: 'badminton',
    category: 'racquet',
    shortDescription: 'Professional indoor courts with BWF-approved synthetic mats and anti-glare LED lighting.',
    image: IMAGES.badminton,
  },
  {
    _id: 'fb-table-tennis',
    name: 'Table Tennis',
    slug: 'table-tennis',
    category: 'racquet',
    shortDescription: 'ITTF certified tables in a dedicated hall. Perfect for beginners and competitive players.',
    image: IMAGES.tableTennis,
  },
  {
    _id: 'fb-fitness',
    name: 'Fitness Zone',
    slug: 'fitness',
    category: 'fitness',
    shortDescription: 'Fully equipped gym with cardio, free weights, strength machines, and expert trainers.',
    image: IMAGES.fitness,
  },
  {
    _id: 'fb-snooker',
    name: 'Snooker',
    slug: 'snooker',
    category: 'cue-sports',
    shortDescription: 'Premium snooker tables in a relaxed, well-lit environment for casual and serious players.',
    image: IMAGES.snooker,
  },
  {
    _id: 'fb-chess',
    name: 'Chess & Strategy',
    slug: 'chess',
    category: 'mind-sports',
    shortDescription: 'Dedicated zones for chess and other mind sports. Build your strategic thinking.',
    image: IMAGES.chess,
  },
  {
    _id: 'fb-carrom',
    name: 'Carrom',
    slug: 'carrom',
    category: 'board-sports',
    shortDescription: 'Traditional Indian board game available for all age groups in a friendly setting.',
    image: IMAGES.carrom,
  },
];

export default async function SportsListingPage() {
  const dbSports = await getSports();
  const sports = dbSports && dbSports.length > 0 ? dbSports : FALLBACK_SPORTS;
  const usingFallback = !dbSports || dbSports.length === 0;

  return (
    <>
      {/* Page Banner */}
      <PageHeader bgImage="/images/page-hero.png">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-white text-sm font-semibold mb-5">
          <Trophy className="w-4 h-4" />
          World-Class Facilities
        </div>
        <h1>Our Sports &amp; Activities</h1>
        <div className="breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span>Sports</span>
        </div>
      </PageHeader>

      <Section>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-text-secondary leading-relaxed">
            From high-intensity racquet sports to strategic mind games and complete fitness solutions,
            we offer world-class facilities for every enthusiast.
          </p>
          {usingFallback && (
            <p className="text-sm text-text-disabled mt-3 italic">
              Showing featured sports — visit us for the full experience!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport) => {
            const imgSrc = sport.image || getSportImage(sport);
            const href = `/sports/${sport.slug}`;
            return (
              <Card key={sport._id} className="flex flex-col group overflow-hidden">
                {/* Image */}
                <div className="relative h-[220px] md:h-[250px] lg:h-[320px] overflow-hidden">
                  <SafeImage
                    src={imgSrc}
                    alt={sport.name}
                    fallbackText={sport.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {sport.category?.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{sport.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{sport.shortDescription}</CardDescription>
                </CardHeader>

                <CardFooter className="mt-auto pt-2 pb-5">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors group/link"
                  >
                    Explore {sport.name}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Why Sports Arena CTA band */}
      <div className="bg-surface-alt border-y border-border py-10 md:py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">Not sure which sport to try?</h2>
          <p className="text-text-secondary mb-8 md:mb-10 max-w-lg mx-auto">
            Book a free trial session and our coaches will help you find the perfect sport for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/919352812625"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 h-12 px-8 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-md w-full sm:w-auto"
            >
              Book a Free Trial
            </a>
            <Link
              href="/contact"
              className="inline-flex justify-center items-center gap-2 h-12 px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors w-full sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <ContactCta />
    </>
  );
}
