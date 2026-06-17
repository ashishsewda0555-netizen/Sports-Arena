import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Carousel } from '@/components/ui/Carousel';
import { Accordion } from '@/components/ui/Accordion';
import { ContactCta } from '@/components/shared/ContactCta';
import { Trophy, Users, Building, Medal, ArrowRight, Play, CheckCircle2, Calendar, MapPin, UserRound } from 'lucide-react';
import { getSports, getCoaches, getTestimonials, getEvents, getPricingPlans, getFaqs, getSiteStatistics, getGalleryImages, getVideos } from '@/lib/data-fetchers';
import { formatDate } from '@/lib/utils';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { DynamicVideo } from '@/components/ui/DynamicVideo';
import { SchemaMarkup, generateLocalBusinessSchema } from '@/components/seo/SchemaMarkup';

export const metadata = {
  title: 'Champions Sports Arena – Badminton Academy & Multi-Sport Arena in Jaipur',
  description: 'Train under national-level coaches at Champions Sports Arena, Jaipur\'s premier multi-sport arena offering badminton, table tennis, snooker, fitness & more.',
};

export default async function Home() {
  const [sports, coaches, testimonials, events, pricingPlans, faqs, stats, galleryImages, videos] = await Promise.all([
    getSports(),
    getCoaches(),
    getTestimonials(),
    getEvents(),
    getPricingPlans(),
    getFaqs(),
    getSiteStatistics(),
    getGalleryImages(),
    getVideos('homepage-arena-tour'),
  ]);

  const tourVideo = videos?.[0];

  const schema = generateLocalBusinessSchema({
    name: "Champions Sports Arena",
    description: "Premium multi-sport facility offering professional coaching and casual play in Jaipur.",
    url: "https://championssportsarena.com",
    image: "https://championssportsarena.com/images/hero.jpg",
    address: { street: "123 Arena Street", city: "Jaipur", state: "Rajasthan", zip: "302001" },
    phone: "+919876543210"
  });

  return (
    <>
      <SchemaMarkup schema={schema} />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[480px] lg:min-h-[600px] flex items-center bg-surface-alt overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent z-10" />
        
        <div className="container mx-auto px-4 relative z-20 pt-24 pb-16 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="overline">PREMIUM SPORTS ARENA & ACADEMY</div>
            <h1 className="mb-6 font-display-xl text-text-primary">
              Train. Play. Compete.<br />
              <span className="text-primary">All Under One Roof.</span>
            </h1>
            <p className="text-body-lg text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0">
              State-of-the-art facilities, professional coaching, and a vibrant community. Elevate your game today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/sports">Explore Sports</Link>
              </Button>
              <Button asChild variant="accent" size="lg">
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  Enquire Now - WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPORTS OFFERED */}
      <Section id="sports">
        <SectionHeader
          overline="OUR SPORTS"
          title="World-Class Facilities"
          description="We offer a wide range of sports and activities tailored for both professional athletes and casual players."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sports?.slice(0, 7).map((sport) => (
            <Card key={sport._id} className="flex flex-col group">
              <FallbackImage 
                src={sport.imageUrl || ''} 
                alt={sport.name} 
                className="h-48 w-full"
              />
              <CardHeader>
                <CardTitle>{sport.name}</CardTitle>
                <CardDescription>{sport.shortDescription}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href={`/sports/${sport.slug}`} className="flex items-center text-primary">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. PROFESSIONAL COACHING */}
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
            <Button asChild>
              <Link href="/coaching">View All Coaches</Link>
            </Button>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {coaches?.slice(0, 3).map((coach) => (
                <Card key={coach._id} className="text-center h-full flex flex-col">
                  <div className="w-24 h-24 mx-auto mt-6 rounded-full bg-surface-alt mb-4 overflow-hidden relative">
                    <FallbackImage src={coach.imageUrl || ''} alt={coach.name} className="w-full h-full" />
                  </div>
                  <CardContent className="flex-grow flex flex-col">
                    <CardTitle as="h4">{coach.name}</CardTitle>
                    <p className="text-body-sm text-primary font-medium mb-2">{coach.specialization}</p>
                    <div className="mb-4">
                      <Badge variant="default">{coach.experienceYears} Years Exp.</Badge>
                    </div>
                    <Button asChild variant="ghost" className="mt-auto mx-auto w-full">
                      <Link href={`/coaching#${coach._id}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 4. WHY CHOOSE US */}
      <Section id="features">
        <SectionHeader
          title="Why Choose Sports Arena?"
          description="We are committed to providing the best environment for your athletic journey."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center mt-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Medal className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">National Coaches</h3>
            <p className="text-body-sm text-text-secondary">Learn from experts with proven track records.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Modern Facility</h3>
            <p className="text-body-sm text-text-secondary">BWF-approved mats, premium lighting, air-conditioned.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Multi-Sport</h3>
            <p className="text-body-sm text-text-secondary">7+ sports and fitness activities available.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Tournaments</h3>
            <p className="text-body-sm text-text-secondary">Regular competitive events for all age groups.</p>
          </div>
        </div>
      </Section>

      {/* 5. FITNESS & STRENGTH */}
      <Section alt id="fitness">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4 h-96">
            <FallbackImage className="rounded-lg h-full" />
            <div className="grid grid-rows-2 gap-4 h-full">
              <FallbackImage className="rounded-lg h-full" />
              <FallbackImage className="rounded-lg h-full" />
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
              {['Cardio Equipment', 'Free Weights', 'Functional Training', 'Strength Machines'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link href="/sports/fitness">Join Fitness Zone</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* NEW: 6. GALLERY PREVIEW */}
      <Section id="gallery-preview">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <SectionHeader
            title="Inside the Arena"
            align="left"
            className="mb-0"
          />
          <Button asChild variant="ghost" className="shrink-0">
            <Link href="/gallery">View Full Gallery <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
        
        {galleryImages?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Simple Masonry-like layout using grid spans */}
            {galleryImages.slice(0, 6).map((img, idx) => (
              <FallbackImage 
                key={img._id} 
                src={img.url || ''} 
                alt={img.title || 'Gallery'}
                className={`rounded-lg ${idx === 0 || idx === 3 ? 'md:row-span-2 md:aspect-[3/4]' : 'aspect-square'}`}
              />
            ))}
          </div>
        ) : (
          <div className="h-64 bg-surface-alt rounded-lg flex items-center justify-center text-text-disabled">Gallery coming soon</div>
        )}
      </Section>

      {/* NEW: 7. ARENA TOUR VIDEO */}
      <Section alt id="video-tour" className="text-center">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            overline="EXPERIENCE"
            title="Take a Virtual Tour"
          />
          <div className="mt-8 relative aspect-video bg-surface-alt rounded-xl overflow-hidden group border border-border shadow-lg">
            <DynamicVideo 
              video={tourVideo} 
              fallbackMessage="Arena Tour Video Coming Soon" 
              className="absolute inset-0 z-0" 
            />
          </div>
        </div>
      </Section>

      {/* 8. STATISTICS BAND */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-heading font-bold text-4xl lg:text-5xl mb-2">{stats?.yearsOfExcellence || '10'}+</div>
              <div className="text-sm uppercase tracking-wider font-semibold opacity-80">Years</div>
            </div>
            <div>
              <div className="font-heading font-bold text-4xl lg:text-5xl mb-2">{stats?.studentsTrained || '500'}+</div>
              <div className="text-sm uppercase tracking-wider font-semibold opacity-80">Students</div>
            </div>
            <div>
              <div className="font-heading font-bold text-4xl lg:text-5xl mb-2">{stats?.activeCoaches || '15'}+</div>
              <div className="text-sm uppercase tracking-wider font-semibold opacity-80">Coaches</div>
            </div>
            <div>
              <div className="font-heading font-bold text-4xl lg:text-5xl mb-2">{stats?.totalCourts || '12'}</div>
              <div className="text-sm uppercase tracking-wider font-semibold opacity-80">Courts & Tables</div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. TESTIMONIALS */}
      <Section id="testimonials">
        <SectionHeader
          overline="COMMUNITY"
          title="What Our Members Say"
        />
        {testimonials && testimonials.length > 0 && (
          <Carousel options={{ align: 'start' }} className="mt-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial._id} className="h-full">
                <CardContent className="pt-6">
                  <div className="flex text-accent mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-text-secondary italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-surface-alt">
                      <FallbackImage 
                        src={testimonial.photoId?.url || ''} 
                        alt={testimonial.customerName || testimonial.name || 'User'} 
                        fallbackIcon="UserRound"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-text-primary">{testimonial.customerName || testimonial.name}</h4>
                      <p className="text-body-sm text-text-disabled">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        )}
      </Section>

      {/* NEW: 10. UPCOMING EVENTS */}
      {events?.length > 0 && (
        <Section alt id="upcoming-events">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <SectionHeader
              overline="COMMUNITY"
              title="Upcoming Events"
              align="left"
              className="mb-0"
            />
            <Button asChild variant="ghost" className="shrink-0">
              <Link href="/events">View All Events <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <Card key={event._id} className="flex flex-col h-full">
                <div className="relative h-48 bg-surface-alt overflow-hidden">
                  <div className="absolute top-4 left-4 bg-primary text-white rounded-md flex flex-col items-center justify-center w-14 h-14 z-10 shadow-md">
                    <span className="text-xs uppercase font-semibold">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-bold font-heading leading-none">{new Date(event.startDate).getDate()}</span>
                  </div>
                  <FallbackImage src={event.imageUrl || ''} alt={event.title} className="w-full h-full" />
                </div>
                <CardContent className="pt-6 flex-grow flex flex-col">
                  <CardTitle as="h3" className="text-xl mb-2 line-clamp-2">{event.title}</CardTitle>
                  <div className="space-y-2 mt-auto mb-6">
                    <div className="flex items-start gap-2 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-start gap-2 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
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

      {/* 11. PRICING PREVIEW */}
      <Section id="pricing">
        <SectionHeader
          overline="MEMBERSHIP"
          title="Simple, Transparent Pricing"
          description="Find a plan that fits your goals, whether you're a casual player or a dedicated athlete."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
          {pricingPlans?.slice(0, 3).map((plan) => (
            <Card key={plan._id} className={plan.isPopular ? 'border-primary ring-1 ring-primary' : ''}>
              <CardHeader className="text-center">
                {plan.isPopular && <Badge variant="accent" className="mx-auto mb-4">Most Popular</Badge>}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4 flex justify-center items-baseline gap-1">
                  <span className="text-3xl font-bold font-heading">₹{plan.price}</span>
                  <span className="text-text-secondary">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8 mt-4">
                  {plan.inclusions?.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex gap-3 text-body-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.isPopular ? 'primary' : 'secondary'}>
                  <Link href="/pricing">View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* 12. FAQ PREVIEW */}
      <Section alt id="faq">
        <SectionHeader
          overline="SUPPORT"
          title="Frequently Asked Questions"
        />
        <div className="max-w-3xl mx-auto">
          {faqs && faqs.length > 0 && (
            <Accordion items={faqs.slice(0, 4)} className="mb-8" />
          )}
          <div className="text-center">
            <Button asChild variant="ghost">
              <Link href="/faq">View All FAQs <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* 13. CONTACT CTA BANNER */}
      <ContactCta />
      
      {/* NEW: 14. GOOGLE MAP */}
      <div className="w-full h-[400px] bg-surface-alt relative">
        <iframe 
          src={process.env.NEXT_PUBLIC_MAP_EMBED_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.23689431835!2d75.71078716281729!3d26.885141679549303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        ></iframe>
      </div>
    </>
  );
}
