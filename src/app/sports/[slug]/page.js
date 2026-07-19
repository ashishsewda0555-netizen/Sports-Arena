import Link from 'next/link';
import Image from 'next/image';
import { SafeImage } from '@/components/ui/SafeImage';
import { Section, SectionHeader } from '@/components/ui/Section';
import { getSportBySlug, getSports } from '@/lib/data-fetchers';
import { CheckCircle2, ArrowRight, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { ContactCta } from '@/components/shared/ContactCta';
import { SchemaMarkup, generateServiceSchema } from '@/components/seo/SchemaMarkup';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { IMAGES, getSportImage, SPORT_IMAGES } from '@/lib/images';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  if (!sport) {
    return {
      title: `${slug ? slug.replace(/-/g, ' ') : 'Sport'} | Bharti Sports Arena`,
      description: 'Discover our sports facilities at Bharti Sports Arena, Sikar.',
    };
  }

  const title = sport.ctaType === 'coaching-enquiry'
    ? `${sport.name} Coaching & Courts in Sikar | Bharti Sports Arena`
    : `${sport.name} Facility in Sikar | Bharti Sports Arena`;

  return {
    title,
    description: sport.shortDescription,
    openGraph: { title, description: sport.shortDescription },
  };
}

/**
 * Beautiful placeholder page shown when a sport slug has no DB record.
 * Never shows a plain 404 — always gives the user a useful, visually rich page.
 */
function SportNotFoundPage({ slug, allSports }) {
  const safeSlug = slug || 'sport';
  const sportName = safeSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Pick the best placeholder image for this slug
  const imgSrc = SPORT_IMAGES[slug] || SPORT_IMAGES[sportName.toLowerCase()] || IMAGES.arenaInterior;

  return (
    <>
      {/* Hero-style sport banner */}
      <div className="relative min-h-[420px] flex items-end overflow-hidden">
        {/* Blurred background image — matches Coaching/Events pattern */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/sports/fitness-hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.02)',
          }}
        />
        {/* Dark gradient overlay — same treatment as Coaching/Events */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(120deg, rgba(5,20,10,0.85) 0%, rgba(5,20,60,0.75) 55%, rgba(5,20,10,0.85) 100%)',
          }}
        />
        <div className="relative z-10 container mx-auto px-4 pb-14 pt-28">
          <nav className="text-sm text-white/60 font-medium uppercase tracking-wider mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 opacity-40">/</span>
            <Link href="/sports" className="hover:text-white transition-colors">Sports</Link>
            <span className="mx-2 opacity-40">/</span>
            <span className="text-white">{sportName}</span>
          </nav>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3">{sportName}</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-gray-900 text-sm font-bold">
            🚀 Coming Soon
          </div>
        </div>
      </div>

      {/* Content Section */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border border-border p-10 text-center mb-12">
            <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏅</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              {sportName} — Coming to Sports Arena!
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6 max-w-lg mx-auto">
              We are setting up a world-class {sportName} facility at Bharti Sports Arena. 
              The courts, equipment, and coaching programs are being prepared to give you the best 
              experience possible. Stay tuned — or enquire now to be the first to know when we launch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919352812625"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Enquire on WhatsApp
              </a>
              <a
                href="tel:+919352812625"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </div>

          {/* What to expect */}
          <h3 className="text-xl font-bold text-text-primary mb-5 text-center">What to Expect</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              'Professional-grade equipment',
              'Certified coaching programs',
              'Beginner to advanced levels',
              'Flexible timing & memberships',
              'Safe and well-maintained courts',
              'Tournaments and events',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-text-primary font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Other Sports */}
        {allSports && allSports.length > 0 && (
          <>
            <div className="border-t border-border pt-12">
              <SectionHeader
                title="Explore Other Sports"
                description="While we set up this facility, explore the sports we offer right now."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {allSports.slice(0, 3).map((s) => (
                  <Link key={s._id} href={`/sports/${s.slug}`} className="group block">
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-4 shadow-sm">
                      <SafeImage
                        src={getSportImage(s)}
                        alt={s.name}
                        fallbackText={s.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-white font-bold text-lg drop-shadow">{s.name}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">{s.shortDescription}</p>
                    <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Sports
          </Link>
        </div>
      </Section>
      <ContactCta />
    </>
  );
}

export default async function SportDetailPage({ params }) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);

  // Fetch all sports for "related" and "not found" fallback sections
  const allSports = await getSports();

  // If no sport found in DB — show a beautiful placeholder page (never 404)
  if (!sport) {
    return <SportNotFoundPage slug={params.slug} allSports={allSports} />;
  }

  const relatedSports = allSports?.filter((s) => s._id !== sport._id).slice(0, 3);

  const schema = generateServiceSchema({
    name: sport.name,
    description: sport.shortDescription,
    providerName: 'Bharti Sports Arena',
    providerUrl: 'https://bhartisportsarena.com',
  });

  // Best image for the hero
  const originalHeroImage = sport.featuredImageId?.url || getSportImage(sport);
  let heroImage = originalHeroImage;
  if (slug === 'badminton') {
    heroImage = '/images/sports/new-badminton-header.jpg';
  }

  let middleImage = originalHeroImage;
  if (slug === 'table-tennis') {
    middleImage = '/images/sports/table-tennis-final-v3.jpg';
  } else if (slug === 'snooker') {
    middleImage = '/images/sports/new-snooker-middle.jpg';
  } else if (slug === 'table-soccer') {
    middleImage = '/images/sports/table-soccer-final-v3.jpg';
  }

  const hideThumbnails = ['table-tennis', 'snooker', 'table-soccer', 'badminton'].includes(slug);

  return (
    <>
      <SchemaMarkup schema={schema} />

      {/* Sport Hero Banner */}
      <div className="relative min-h-[380px] flex items-end overflow-hidden">
        <SafeImage
          src={heroImage}
          alt={`${sport.name} at Bharti Sports Arena`}
          fallbackText={sport.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/80" />
        <div className="relative z-10 container mx-auto px-4 pb-14 pt-28">
          <nav className="text-sm text-white/60 font-medium uppercase tracking-wider mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 opacity-40">/</span>
            <Link href="/sports" className="hover:text-white transition-colors">Sports</Link>
            <span className="mx-2 opacity-40">/</span>
            <span className="text-white">{sport.name}</span>
          </nav>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2">{sport.name}</h1>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold uppercase tracking-wider">
            {sport.category?.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative rounded-2xl aspect-video w-full overflow-hidden group shadow-md">
              <SafeImage
                src={middleImage}
                alt={`${sport.name} main facility`}
                fallbackText={sport.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {!hideThumbnails && (
              <div className="grid grid-cols-2 gap-4">
              {sport.galleryImageIds?.slice(0, 2).map((img, idx) => (
                <div key={idx} className="relative rounded-xl aspect-video w-full overflow-hidden group shadow-sm">
                  <SafeImage
                    src={img.url}
                    alt={`${sport.name} gallery ${idx + 1}`}
                    fallbackText="Gallery"
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
              {/* Fill remaining gallery slots with sport-related images */}
              {Array.from({ length: Math.max(0, 2 - (sport.galleryImageIds?.length || 0)) }).map((_, idx) => (
                <div key={`fill-${idx}`} className="relative rounded-xl aspect-video w-full overflow-hidden group shadow-sm bg-surface-alt">
                  <SafeImage
                    src={getSportImage(sport)}
                    alt={`${sport.name} facility`}
                    fallbackText={sport.name}
                    fill
                    sizes="25vw"
                    className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            {sport.longDescription ? (
              <div className="mb-6">
                <div
                  className="prose prose-lg dark:prose-invert text-text-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sport.longDescription }}
                />
              </div>
            ) : sport.description ? (
              <div className="mb-6">
                <p className="text-lg text-text-secondary leading-relaxed">{sport.description}</p>
              </div>
            ) : null}

            {sport.keyFeatures?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-bold text-xl mb-4 text-text-primary">Key Features</h3>
                <ul className="space-y-3">
                  {sport.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sport.benefits?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-bold text-xl mb-4 text-text-primary">Benefits</h3>
                <ul className="space-y-3">
                  {sport.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-text-secondary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
              <Link
                href={sport.ctaType === 'coaching-enquiry' ? '/coaching' : '/pricing'}
                className="inline-flex items-center justify-center h-13 px-7 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-md"
              >
                {sport.ctaType === 'coaching-enquiry' ? 'Enquire About Coaching' : 'View Pricing & Join'}
              </Link>
              <a
                href="https://wa.me/919352812625"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-13 px-7 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Related Sports */}
      {relatedSports?.length > 0 && (
        <Section alt>
          <SectionHeader title="You May Also Like" align="left" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedSports.map((s) => (
              <Link key={s._id} href={`/sports/${s.slug}`} className="group block">
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 shadow-sm">
                  <SafeImage
                    src={getSportImage(s)}
                    alt={s.name}
                    fallbackText={s.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-white font-bold text-lg drop-shadow">{s.name}</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">{s.shortDescription}</p>
                <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <ContactCta />
    </>
  );
}
