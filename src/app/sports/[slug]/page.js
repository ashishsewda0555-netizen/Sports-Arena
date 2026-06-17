import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { getSportBySlug, getSports } from '@/lib/data-fetchers';
import { CheckCircle2, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { ContactCta } from '@/components/shared/ContactCta';
import { SchemaMarkup, generateServiceSchema } from '@/components/seo/SchemaMarkup';
import { FallbackImage } from '@/components/ui/FallbackImage';

export async function generateMetadata({ params }) {
  const sport = await getSportBySlug(params.slug);
  if (!sport) return { title: 'Not Found' };
  
  const title = sport.ctaType === 'coaching-enquiry'
    ? `${sport.name} Coaching & Courts in Jaipur | Champions Sports Arena`
    : `${sport.name} Facility in Jaipur | Champions Sports Arena`;

  return {
    title,
    description: sport.shortDescription,
    openGraph: {
      title,
      description: sport.shortDescription,
    },
  };
}

export default async function SportDetailPage({ params }) {
  const sport = await getSportBySlug(params.slug);
  
  if (!sport) {
    notFound();
  }

  const allSports = await getSports();
  const relatedSports = allSports?.filter(s => s._id !== sport._id).slice(0, 3);

  const schema = generateServiceSchema({
    name: sport.name,
    description: sport.shortDescription,
    providerName: "Champions Sports Arena",
    providerUrl: "https://championssportsarena.com"
  });

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">{sport.name}</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Sports <span className="mx-2">/</span> {sport.name}
          </div>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Gallery Preview */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-surface-alt rounded-lg aspect-video w-full overflow-hidden relative">
              <FallbackImage 
                src={sport.featuredImageId?.url || ''} 
                alt={`${sport.name} main facility`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sport.galleryImageIds?.slice(0, 2).map((img, idx) => (
                <div key={idx} className="bg-surface-alt rounded-lg aspect-video w-full overflow-hidden relative">
                  <FallbackImage 
                    src={img.url || ''} 
                    alt={`${sport.name} gallery image ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              ))}
              {/* If fewer than 2 gallery images exist, show empty fallbacks to maintain layout */}
              {Array.from({ length: Math.max(0, 2 - (sport.galleryImageIds?.length || 0)) }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-surface-alt rounded-lg aspect-video w-full overflow-hidden relative">
                  <FallbackImage 
                    src="" 
                    alt="Gallery placeholder"
                    className="w-full h-full object-cover opacity-50" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
                {sport.category?.replace('-', ' ')}
              </span>
              <div 
                className="prose prose-lg dark:prose-invert text-text-secondary"
                dangerouslySetInnerHTML={{ __html: sport.longDescription }}
              />
            </div>

            {sport.keyFeatures?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-xl mb-4 text-text-primary">Key Features</h3>
                <ul className="space-y-3">
                  {sport.keyFeatures.map((feature, idx) => (
                    <li key={idx} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sport.benefits?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-xl mb-4 text-text-primary">Benefits</h3>
                <ul className="space-y-3">
                  {sport.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-6 border-t border-border">
              <Button asChild size="lg">
                <Link href={sport.ctaType === 'coaching-enquiry' ? '/coaching' : '/pricing'}>
                  {sport.ctaType === 'coaching-enquiry' ? 'Enquire About Coaching' : 'View Pricing & Join'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Related Sports */}
      {relatedSports?.length > 0 && (
        <Section alt>
          <SectionHeader
            title="You may also like"
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedSports.map((s) => (
              <Link key={s._id} href={`/sports/${s.slug}`} className="group block">
                <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-all">
                  <h4 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{s.name}</h4>
                  <p className="text-body-sm text-text-secondary line-clamp-2 mb-4">{s.shortDescription}</p>
                  <span className="text-sm font-medium text-primary flex items-center">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <ContactCta />
    </>
  );
}
