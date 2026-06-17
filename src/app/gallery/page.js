import { Section } from '@/components/ui/Section';
import { GalleryFilter } from '@/components/gallery/GalleryFilter';
import { ContactCta } from '@/components/shared/ContactCta';
import { getGalleryImages } from '@/lib/data-fetchers';

export const metadata = {
  title: 'Photo Gallery',
  description: 'See our courts, coaching sessions, tournaments, and facilities at Champions Sports Arena, Jaipur\'s premium sports arena.',
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Gallery</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Gallery
          </div>
        </div>
      </div>

      <Section>
        <GalleryFilter images={images} />
      </Section>

      <ContactCta />
    </>
  );
}
