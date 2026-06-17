import { Section, SectionHeader } from '@/components/ui/Section';
import { getFacilitiesContent } from '@/lib/data-fetchers';
import { CheckCircle2 } from 'lucide-react';
import { PhotoStrip } from '@/components/shared/PhotoStrip';
import { ContactCta } from '@/components/shared/ContactCta';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { Building2 } from 'lucide-react';

export const metadata = {
  title: 'Our Facilities',
  description: 'Discover Champions Sports Arena\'s courts, equipment, amenities, and safety standards in Jaipur.',
};

export default async function FacilitiesPage() {
  const content = await getFacilitiesContent();

  return (
    <>
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Our Facilities</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Facilities
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-text-secondary">
            {content?.introText || 'We have invested in top-tier infrastructure to ensure your sporting experience is safe, comfortable, and professional.'}
          </p>
        </div>

        {/* Alternate blocks for specifications */}
        <div className="space-y-16">
          
          {/* Courts & Equipment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-surface-alt rounded-lg aspect-video overflow-hidden relative">
              <FallbackImage 
                src="" 
                alt="Courts and Equipment"
                fallbackIcon="Building2"
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="font-heading font-bold text-3xl mb-6">Courts & Equipment</h3>
              <div 
                className="prose prose-green dark:prose-invert text-text-secondary mb-6"
                dangerouslySetInnerHTML={{ __html: content?.courtsHtml || '<p>BWF-approved synthetic mats on wooden flooring. Anti-glare LED lighting designed specifically for high-speed racquet sports.</p>' }}
              />
              <ul className="space-y-3">
                {['BWF Approved Mats', 'Wooden Base', 'Anti-Glare LED (1000 Lux)', 'ITTF Certified Tables'].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-body-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="font-heading font-bold text-3xl mb-6">Amenities</h3>
              <div 
                className="prose prose-green dark:prose-invert text-text-secondary mb-6"
                dangerouslySetInnerHTML={{ __html: content?.amenitiesHtml || '<p>A comfortable environment for players and visitors alike.</p>' }}
              />
              <ul className="space-y-3">
                {['Ample Parking Space', 'Clean Restrooms & Change Rooms', 'RO Drinking Water', 'Visitor Seating Area', 'Lockers available'].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-body-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-alt rounded-lg aspect-video order-1 lg:order-2 overflow-hidden relative">
              <FallbackImage 
                src="" 
                alt="Amenities"
                fallbackIcon="Building2"
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Safety & Hygiene */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-surface-alt rounded-lg aspect-video overflow-hidden relative">
              <FallbackImage 
                src="" 
                alt="Safety and Hygiene"
                fallbackIcon="Building2"
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="font-heading font-bold text-3xl mb-6">Safety & Hygiene</h3>
              <div 
                className="prose prose-green dark:prose-invert text-text-secondary mb-6"
                dangerouslySetInnerHTML={{ __html: content?.safetyHtml || '<p>We prioritize your health and safety above all.</p>' }}
              />
              <ul className="space-y-3">
                {['Daily Deep Cleaning', 'First Aid Station', '24/7 CCTV Surveillance', 'Well Ventilated'].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-body-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </Section>

      <PhotoStrip />
      <ContactCta />
    </>
  );
}
