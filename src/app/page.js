import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SafeImage } from '@/components/ui/SafeImage';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Carousel } from '@/components/ui/Carousel';
import { Accordion } from '@/components/ui/Accordion';
import { ContactCta } from '@/components/shared/ContactCta';
import { Trophy, Users, Building, Medal, ArrowRight, CheckCircle2, Calendar, MapPin, Dumbbell, Shield, Star } from 'lucide-react';
import { getSports, getCoaches, getTestimonials, getEvents, getFaqs, getGalleryImages, getVideos } from '@/lib/data-fetchers';
import { formatDate } from '@/lib/utils';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { ClickableAvatar } from '@/components/shared/ClickableAvatar';
import { SchemaMarkup, generateLocalBusinessSchema } from '@/components/seo/SchemaMarkup';
import { IMAGES, getSportImage } from '@/lib/images';

export const metadata = {
  title: 'Bharti Sports Arena – Badminton Academy & Multi-Sport Arena in Sikar',
  description: 'Train under professional coaches at Bharti Sports Arena, Sikar\'s growing multi-sport academy offering badminton, table tennis, snooker, fitness & more.',
};

export default async function Home() {
  const [sports, coaches, testimonials, events, faqs, galleryImages, videos] = await Promise.all([
    getSports(),
    getCoaches(),
    getTestimonials(),
    getEvents(),
    getFaqs(),
    getGalleryImages(),
    getVideos('homepage-arena-tour'),
  ]);

  const tourVideo = videos?.[0];

  const schema = generateLocalBusinessSchema({
    name: "Bharti Sports Arena",
    description: "Professional multi-sport academy offering coaching and casual play in Sikar.",
    url: "https://bhartisportsarena.com",
    image: "https://bhartisportsarena.com/images/hero.jpg",
    address: { street: "Kanwarpura Chouraha, Near Prince Education Hub, Bikaner Agra Bypass Road", city: "Sikar", state: "Rajasthan", zip: "332001" },
    phone: "+919352812625"
  });

  return (
    <>
      <SchemaMarkup schema={schema} />

      {/* ── 1. HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative min-h-[600px] lg:min-h-[720px] flex items-center overflow-hidden">
        {/* Full-bleed background image */}
        <Image
          src="/images/homepage-hero-new.jpg"
          alt="Sikar Sports Arena — Indoor Badminton Court"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center"
        />
        {/* Dark gradient overlay — ensures WHITE text is fully readable */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(120deg, rgba(5,20,10,0.60) 0%, rgba(5,20,60,0.50) 55%, rgba(5,20,10,0.45) 100%)' }}
        />
        {/* Subtle bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-[2]" style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }} />

        {/* Decorative floating orbs */}
        <div className="absolute top-24 right-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-[2] pointer-events-none" />
        <div className="absolute bottom-24 left-16 w-80 h-80 bg-secondary/15 rounded-full blur-3xl z-[2] pointer-events-none" />

        <div className="container mx-auto px-6 sm:px-8 relative z-10 pt-48 md:pt-36 lg:pt-28 max-md:mt-12 pb-24 text-center lg:text-left">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-sm font-semibold text-white mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              SIKAR'S PREMIUM SPORTS ARENA
            </div>

            <h1 className="mb-6 text-white drop-shadow-lg">
              <span className="block text-accent md:text-white text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.1] tracking-tight">
                Train. Play.
              </span>
              <span className="block text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.1] tracking-tight text-accent mt-1">
                Compete.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Modern indoor facilities, professional coaches, and a growing community.
              Elevate your game at Bharti Sports Arena.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-8 lg:mb-0">
              <Link
                href="/sports"
                className="inline-flex items-center justify-center h-14 px-8 rounded-lg bg-primary text-white font-bold text-base hover:bg-primary-dark transition-colors shadow-lg gap-2"
              >
                Explore Sports <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/919352812625"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-14 px-8 rounded-lg bg-accent text-gray-900 font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
              >
                Enquire on WhatsApp
              </a>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-6 mt-8 lg:mt-16 justify-center lg:justify-start">
              {[
                { icon: Trophy, label: 'Indoor Badminton Courts' },
                { icon: Users, label: 'Professional Coaching' },
                { icon: Building, label: 'Modern Facility' },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/15">
                  <div className="w-9 h-9 rounded-lg bg-primary/50 flex items-center justify-center">
                    <feat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-white">{feat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SPORTS OFFERED ────────────────────────────────────────────── */}
      <Section id="sports">
        <SectionHeader
          overline="OUR SPORTS"
          title="World-Class Facilities"
          description="We offer a wide range of sports and activities tailored for both professional athletes and casual players."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sports && sports.length > 0
            ? sports.slice(0, 8).map((sport) => (
              <Card key={sport._id} className="flex flex-col group">
                <div className="relative overflow-hidden h-[220px] md:h-[250px] lg:h-[320px]">
                  <SafeImage
                    src={getSportImage(sport)}
                    alt={sport.name}
                    fallbackText={sport.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {(sport.category || sport.name === 'Table Tennis') && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        {sport.name === 'Table Tennis' ? 'INDOOR TABLE' : sport.category.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{sport.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {sport.shortDescription ||
                      (sport.name === 'Badminton' ? 'Fast-paced indoor badminton for all skill levels.' :
                        sport.name === 'Table Tennis' ? 'Quick rallies and sharp reflexes on premium tables.' : '')}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-0">
                  <Link
                    href={`/sports/${sport.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark transition-colors group/link"
                  >
                    Explore {sport.name}
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            ))
            : /* Empty state — 4 placeholder cards with sports images */
            [
              { name: 'Badminton', img: IMAGES.badminton, href: '/sports/badminton', desc: 'Professional indoor courts with BWF-approved mats.' },
              { name: 'Table Tennis', img: IMAGES.tableTennis, href: '/sports/table-tennis', desc: 'ITTF certified tables for all skill levels.' },
              { name: 'Fitness Zone', img: IMAGES.fitness, href: '/sports/fitness', desc: 'Fully equipped gym for strength & conditioning.' },
              { name: 'Snooker', img: IMAGES.snooker, href: '/sports/snooker', desc: 'Premium snooker tables in a great atmosphere.' },
            ].map((item) => (
              <Card key={item.name} className="flex flex-col group">
                <div className="relative overflow-hidden h-[220px] md:h-[250px] lg:h-[320px]">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-0">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark transition-colors group/link"
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            ))
          }
        </div>
      </Section>

      {/* ── 3. PROFESSIONAL COACHING ─────────────────────────────────────── */}
      <Section alt id="coaching">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4">
            <SectionHeader
              overline="EXPERT GUIDANCE"
              title="Professional Coaching"
              description="Train with certified professionals who have competed at national and international levels. Personalized attention for rapid improvement."
              align="left"
              className="mb-8"
            />
            <Link
              href="/coaching"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              View All Coaches
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {coaches && coaches.length > 0
                ? coaches.slice(0, 3).map((coach) => (
                  <Card key={coach._id} className="text-center h-full flex flex-col">
                    <div className="w-24 h-24 mx-auto mt-6 rounded-full overflow-hidden relative ring-4 ring-primary/20 ring-offset-2 ring-offset-surface bg-surface-alt">
                      <FallbackImage src={coach.imageUrl || ''} alt={coach.name} className="w-full h-full" fallbackIcon="UserRound" />
                    </div>
                    <CardContent className="flex-grow flex flex-col pt-4">
                      <CardTitle as="h4" className="text-lg">{coach.name}</CardTitle>
                      <p className="text-sm text-primary font-semibold mb-3 mt-1">{coach.specialization}</p>
                      <div className="mb-4">
                        {coach.yearsOfExperience > 0 && <Badge variant="primary">{coach.yearsOfExperience} Yrs Experience</Badge>}
                      </div>
                      <Link href={`/coaching#${coach._id}`} className="mt-auto inline-flex items-center justify-center text-sm text-primary font-semibold hover:text-primary-dark transition-colors">
                        View Profile →
                      </Link>
                    </CardContent>
                  </Card>
                ))
                : /* Placeholder coaching cards */
                [
                  { name: 'Head Coach', spec: 'Badminton', exp: 12, img: IMAGES.coachingAdult },
                  { name: 'Sr. Coach', spec: 'Table Tennis', exp: 8, img: IMAGES.coaching },
                  { name: 'Fitness Coach', spec: 'Strength & Conditioning', exp: 6, img: IMAGES.fitnessAction },
                ].map((c, i) => (
                  <Card key={i} className="text-center h-full flex flex-col">
                    <div className="w-24 h-24 mx-auto mt-6 rounded-full overflow-hidden relative ring-4 ring-primary/20 ring-offset-2 ring-offset-surface">
                      <Image src={c.img} alt={c.name} fill className="object-cover" />
                    </div>
                    <CardContent className="flex-grow flex flex-col pt-4">
                      <CardTitle as="h4" className="text-lg">{c.name}</CardTitle>
                      <p className="text-sm text-primary font-semibold mb-3 mt-1">{c.spec}</p>
                      <Badge variant="primary">{c.exp} Yrs Experience</Badge>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          </div>
        </div>
      </Section>

      {/* ── 4. WHY CHOOSE US ─────────────────────────────────────────────── */}
      <Section id="features">
        <SectionHeader
          title="Why Choose Sports Arena?"
          description="We are committed to providing the best environment for your athletic journey."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center mt-10">
          {[
            { icon: Medal, title: 'National Coaches', desc: 'Learn from experts with proven track records at state & national level.', color: 'from-primary/20 to-primary/5' },
            { icon: Building, title: 'Modern Facility', desc: 'BWF-approved mats, premium LED lighting, fully air-conditioned.', color: 'from-secondary/20 to-secondary/5' },
            { icon: Users, title: 'Multi-Sport Hub', desc: '7+ sports and fitness activities all under one roof.', color: 'from-accent/20 to-accent/5' },
            { icon: Trophy, title: 'Tournaments', desc: 'Regular competitive events and championships for all age groups.', color: 'from-success/20 to-success/5' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-7 rounded-2xl border border-border bg-white dark:bg-surface hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2 text-text-primary">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. FITNESS & STRENGTH ────────────────────────────────────────── */}
      <Section alt id="fitness">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image grid with real Unsplash images */}
          <div className="grid grid-cols-2 gap-4 h-96">
            <div className="relative rounded-2xl overflow-hidden h-full hover:scale-[1.02] transition-transform duration-500 shadow-md">
              <Image src={IMAGES.fitness} alt="Fitness zone" fill className="object-cover" />
            </div>
            <div className="grid grid-rows-2 gap-4 h-full">
              <div className="relative rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-500 shadow-md">
                <Image src={IMAGES.fitnessAction} alt="Fitness training" fill className="object-cover" />
              </div>
              <div className="relative rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-500 shadow-md">
                <Image src={IMAGES.fitnessWeights} alt="Weights area" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div>
            <SectionHeader
              overline="BEYOND THE COURT"
              title="Fitness & Strength Zone"
              description="A fully equipped gym area to complement your sports training with strength and conditioning."
              align="left"
            />
            <ul className="space-y-4 mb-8">
              {['Basic Equipments', 'Free Weights & Barbells', 'Functional Training Area', 'Expert Trainers On-Site'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/sports/fitness"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              Join Fitness Zone <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ── 6. GALLERY PREVIEW ───────────────────────────────────────────── */}
      <Section id="gallery-preview">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <SectionHeader
            title="Inside the Arena"
            align="left"
            className="mb-0"
          />
          <Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap shrink-0">
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(galleryImages && galleryImages.length > 0
            ? galleryImages.slice(0, 6).map((img) => ({ url: img.imageUrl, title: img.title, id: img._id }))
            : [
              { url: IMAGES.gallery1, title: 'Badminton Courts', id: '1' },
              { url: IMAGES.gallery2, title: 'Table Tennis Arena', id: '2' },
              { url: IMAGES.gallery3, title: 'Fitness Zone', id: '3' },
              { url: IMAGES.gallery4, title: 'Snooker Tables', id: '4' },
              { url: IMAGES.gallery5, title: 'Arena Overview', id: '5' },
              { url: IMAGES.gallery6, title: 'Badminton Action', id: '6' },
            ]
          ).map((img, idx) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden rounded-xl shadow-sm ${idx === 0 || idx === 3 ? 'md:row-span-2' : ''}`}
            >
              <div className={idx === 0 || idx === 3 ? 'aspect-[3/4] md:h-full' : 'aspect-square'}>
                {img?.url ? (
                  <Image
                    src={img.url}
                    alt={img.title || 'Gallery'}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-alt/50 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-semibold text-sm">{img.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 7. ARENA TOUR VIDEO ──────────────────────────────────────────── */}
      {tourVideo && (
        <Section alt id="video-tour" className="text-center">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              overline="EXPERIENCE"
              title="Take a Virtual Tour"
            />
            <div className="mt-6 relative aspect-video bg-surface-alt rounded-2xl overflow-hidden border border-border shadow-xl">
              <DynamicVideo
                video={tourVideo}
                fallbackMessage="Arena Tour Video Coming Soon"
                className="absolute inset-0 z-0"
              />
            </div>
          </div>
        </Section>
      )}

      {/* ── 8. ACADEMY FEATURES ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'var(--gradient-stats)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="text-white py-16 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-heading font-bold text-3xl md:text-4xl mb-10 text-white">Why Bharti Sports Arena</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Medal, title: 'Professional Coaching', desc: 'Dedicated coaches providing personalized training for all skill levels.' },
                { icon: Building, title: 'Indoor Badminton Courts', desc: 'Well-maintained indoor courts with quality flooring and lighting.' },
                { icon: Star, title: 'Modern Playing Environment', desc: 'Clean, comfortable, and purpose-built for a premium sports experience.' },
                { icon: Dumbbell, title: 'Quality Sports Equipment', desc: 'Well-maintained tables, nets, and equipment across all sports.' },
              ].map((feat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/15 flex items-center justify-center">
                    <feat.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-white">{feat.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOUNDER'S NOTE ───────────────────────────────────────────────── */}
      <Section id="founders-note">
        <SectionHeader
          overline="OUR STORY"
          title="A Note from Our Founder"
        />
        <div className="max-w-5xl mx-auto mt-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-stretch">

            {/* PHOTO PANEL (Top on Mobile, Right on Desktop) */}
            <div className="order-1 md:order-2 md:w-[260px] shrink-0 bg-surface-alt rounded-2xl border-t-[3px] border-t-primary/50 border-x border-b border-border flex flex-col relative overflow-hidden group">
              {/* Corner bracket accents (top-left, bottom-right) */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/70 rounded-tl-2xl z-20 pointer-events-none hidden md:block" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/70 rounded-br-2xl z-20 pointer-events-none hidden md:block" />

              {/* Desktop: Photo Body (Hidden on Mobile) */}
              <div className="hidden md:flex flex-1 items-center justify-center relative min-h-[200px]">
                <ClickableAvatar
                  src="/images/founder.jpg"
                  alt="Captain Shubhkaran Khichar"
                  containerClassName="w-48 h-48 rounded-full ring-4 ring-primary/20 relative z-10 bg-surface-alt shadow-xl"
                  imageSizes="256px"
                />
              </div>

              {/* Mobile: Horizontal Card / Desktop: Bottom Attribution Strip */}
              <div className="flex items-center p-5 md:p-4 bg-surface-alt md:bg-black/20 md:border-t md:border-border mt-auto relative z-20">
                <ClickableAvatar
                  src="/images/founder.jpg"
                  alt="Captain Shubhkaran Khichar"
                  containerClassName="w-16 h-16 md:w-10 md:h-10 rounded-full shrink-0 ring-2 ring-primary/10 mr-4 md:mr-3 bg-surface-alt shadow-sm"
                  imageSizes="128px"
                />
                <div>
                  <h4 className="font-heading font-semibold text-text-primary text-base md:text-sm leading-tight">&mdash; Captain Shubhkaran Khichar</h4>
                  <p className="text-sm md:text-xs text-primary font-medium mt-1 md:mt-0.5">Founder, Bharti Sports Arena</p>
                </div>
              </div>
            </div>

            {/* QUOTE BOX (Bottom on Mobile, Left on Desktop) */}
            <div className="order-2 md:order-1 flex-1 bg-surface-alt rounded-2xl border border-border border-l-2 border-l-primary flex flex-col relative">
              <div className="flex-1 p-6 sm:p-10 relative">
                {/* Decorative Quote Mark */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-primary/10 font-serif text-8xl leading-none select-none pointer-events-none">
                  &ldquo;
                </div>
                <p className="relative z-10 text-lg md:text-xl text-text-primary leading-relaxed font-serif italic mt-6 md:mt-4">
                  &quot;When I came back to Sikar after years at sea, I saw talented kids with nowhere proper to train &mdash; no real courts, no real coaching, no real facility built for the sport itself. That&apos;s why we started Bharti Sports Arena. Sports gave me the discipline and health that carried me across oceans, and I wanted this district to have a place that could do the same for its own athletes. We didn&apos;t set out to open just another gym &mdash; we set out to build the first true multi-sport arena in Sikar, and we intend to keep it the best one. Whether you&apos;re here to play, train, or compete, this is your home ground.&quot;
                </p>
              </div>

              {/* Attribution Row */}
              <div className="flex items-center gap-4 px-6 py-5 sm:px-10 border-t border-border bg-surface-alt/30 rounded-b-2xl">
                <ClickableAvatar
                  src="/images/founder.jpg"
                  alt="Captain Shubhkaran Khichar"
                  containerClassName="w-12 h-12 rounded-full shrink-0 ring-2 ring-primary/10 bg-surface-alt shadow-sm"
                  imageSizes="96px"
                />
                <div>
                  <h4 className="font-heading font-semibold text-text-primary">&mdash; Captain Shubhkaran Khichar</h4>
                  <p className="text-sm text-primary font-medium">Founder, Bharti Sports Arena</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Section>

      {/* ── 9. TESTIMONIALS ──────────────────────────────────────────────── */}
      <Section id="testimonials">
        <SectionHeader
          overline="COMMUNITY"
          title="What Our Members Say"
        />
        {testimonials && testimonials.length > 0 && (
          <Carousel options={{ align: 'start' }} className="mt-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial._id} className="h-full hover:translate-y-0">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-4">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179z" /></svg>
                  </div>
                  <div className="flex text-accent mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-text-secondary italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-surface-alt ring-2 ring-primary/10">
                      <FallbackImage
                        src={testimonial.photoId?.url || ''}
                        alt={testimonial.customerName || testimonial.name || 'User'}
                        fallbackIcon="UserRound"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-text-primary">{testimonial.customerName || testimonial.name}</h4>
                      <p className="text-sm text-text-disabled">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        )}
      </Section>

      {/* ── 10. UPCOMING EVENTS ──────────────────────────────────────────── */}
      {events?.length > 0 && (
        <Section alt id="upcoming-events">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <SectionHeader
              overline="COMMUNITY"
              title="Upcoming Events"
              align="left"
              className="mb-0"
            />
            <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap shrink-0">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <Card key={event._id} className="flex flex-col h-full">
                <div className="relative h-48 bg-surface-alt overflow-hidden">
                  <div className="absolute top-4 left-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl flex flex-col items-center justify-center w-14 h-14 z-10 shadow-lg">
                    {(() => {
                      const parsedDate = event.startDate ? new Date(event.startDate) : null;
                      const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
                      return isValidDate ? (
                        <>
                          <span className="text-[10px] uppercase font-bold">{parsedDate.toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-bold font-heading leading-none">{parsedDate.getDate()}</span>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-center leading-tight">Date TBA</span>
                      );
                    })()}
                  </div>
                  <FallbackImage src={event.imageUrl || IMAGES.event} alt={event.title} className="w-full h-full" />
                </div>
                <CardContent className="pt-6 flex-grow flex flex-col">
                  <CardTitle as="h3" className="text-xl mb-2 line-clamp-2">{event.title}</CardTitle>
                  <div className="space-y-2 mt-auto mb-6">
                    <div className="flex items-start gap-2 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-start gap-2 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      )}



      {/* ── 12. FAQ PREVIEW ──────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <Section alt id="faq">
          <SectionHeader
            overline="SUPPORT"
            title="Frequently Asked Questions"
          />
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqs.slice(0, 4)} className="mb-8" />
            <div className="text-center">
              <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                View All FAQs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* ── 13. CONTACT CTA BANNER ───────────────────────────────────────── */}
      <ContactCta />

      {/* ── 14. GOOGLE MAP ───────────────────────────────────────────────── */}
      <div className="w-full h-[400px] relative border-t border-border">
        <iframe
          src={process.env.NEXT_PUBLIC_MAP_EMBED_URL || "https://maps.google.com/maps?q=27.6025,75.1104468+(Bharti%20Sports%20Arena)&z=16&output=embed"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 grayscale contrast-125 opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
          title="Sports Arena Location"
        />
      </div>
    </>
  );
}
