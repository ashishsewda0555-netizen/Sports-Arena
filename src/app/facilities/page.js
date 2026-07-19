import Image from 'next/image';
import { Section, SectionHeader } from '@/components/ui/Section';
import { getFacilitiesContent } from '@/lib/data-fetchers';
import { CheckCircle2, Shield, Star, Sparkles, Users } from 'lucide-react';
import { PhotoStrip } from '@/components/shared/PhotoStrip';
import { ContactCta } from '@/components/shared/ContactCta';
import { IMAGES } from '@/lib/images';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata = {
  title: 'Our Facilities',
  description: "Discover Bharti Sports Arena's courts, equipment, amenities, and playing environment in Sikar.",
};

export default async function FacilitiesPage() {
  const content = await getFacilitiesContent();

  return (
    <>
      {/* Page Banner */}
      <PageHeader bgImage="/images/page-hero.png">
        <h1>Our Facilities</h1>
        <div className="breadcrumb">
          Home <span className="mx-2">/</span> Facilities
        </div>
      </PageHeader>

      <Section>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-text-secondary leading-relaxed">
            {content?.introText || 'We have invested in top-tier infrastructure to ensure your sporting experience is safe, comfortable, and professional.'}
          </p>
        </div>

        <div className="space-y-24">

          {/* Courts & Equipment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="relative rounded-2xl aspect-video overflow-hidden group shadow-lg">
              <Image
                src="/images/facility-courts.jpg"
                alt="Courts and Equipment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                Facility
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-5">Courts &amp; Equipment</h2>
              <div
                className="prose prose-green dark:prose-invert text-text-secondary mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content?.courtsHtml || '<p>BWF-approved synthetic mats on wooden flooring. Anti-glare LED lighting designed specifically for high-speed racquet sports. Each court is meticulously maintained for optimal performance.</p>' }}
              />
              <ul className="space-y-4 md:space-y-3 max-md:mt-5 max-md:mb-8">
                {['BWF Approved Synthetic Mats', 'Anti-Glare LED (1000 Lux)', 'ITTF Certified Tables'].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-sm font-medium text-text-primary">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
                Comfort
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-5">Amenities</h2>
              <div
                className="prose prose-green dark:prose-invert text-text-secondary mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content?.amenitiesHtml || '<p>A comfortable environment for players and visitors alike — from ample parking to clean change rooms, everything is designed with your convenience in mind.</p>' }}
              />
              <ul className="space-y-4 md:space-y-3 max-md:mt-5 max-md:mb-8">
                {['Ample Parking Space', 'Clean Restrooms & Change Rooms', 'RO Drinking Water Stations', 'Visitor Seating Gallery'].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-sm font-medium text-text-primary">
                    <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl aspect-video order-1 lg:order-2 overflow-hidden group shadow-lg">
              <Image
                src="/images/amenities-new.jpg"
                alt="Amenities"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Safety & Hygiene */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="relative rounded-2xl aspect-video overflow-hidden group shadow-lg">
              <Image
                src="/images/safety-new.jpg"
                alt="Safety and Hygiene"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-wider mb-4">
                Safety
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-5">Safety &amp; Hygiene</h2>
              <div
                className="prose prose-green dark:prose-invert text-text-secondary mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content?.safetyHtml || '<p>We prioritize your health and safety above all. Our facility undergoes daily deep cleaning and follows strict hygiene protocols so you can focus on your game.</p>' }}
              />
              <ul className="space-y-4 md:space-y-3 max-md:mt-5 max-md:mb-8">
                {['Daily Deep Cleaning Protocol', 'First Aid Station On-Site', '24/7 CCTV Surveillance', 'Well Ventilated & Air Circulated', 'Power Backup — Uninterrupted Play'].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-sm font-medium text-text-primary">
                    <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </Section>

      {/* Features Band */}
      <div className="relative bg-primary py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading font-bold text-3xl md:text-4xl mb-10 text-white">What Makes Us Special</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Indoor Playing Environment', desc: 'Weather-proof indoor facility for year-round play.' },
              { icon: Star, title: 'Professional Equipment', desc: 'Quality tables, nets, and gear for every sport.' },
              { icon: Sparkles, title: 'Clean & Comfortable', desc: 'Hygienic, well-ventilated spaces for players and visitors.' },
              { icon: Users, title: 'Growing Community', desc: 'A welcoming community of sports enthusiasts and learners.' },
            ].map((feat, i) => (
              <div key={i} className="text-center">
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

      <PhotoStrip />
      <ContactCta />
    </>
  );
}
