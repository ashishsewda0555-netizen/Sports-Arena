import { Section } from '@/components/ui/Section';
import { GalleryFilter } from '@/components/gallery/GalleryFilter';
import { ContactCta } from '@/components/shared/ContactCta';
import { getGalleryImages } from '@/lib/data-fetchers';

export const metadata = {
  title: 'Photo Gallery',
  description: 'See our courts, coaching sessions, tournaments, and facilities at Bharti Sports Arena, Jaipur\'s premium sports arena.',
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <div className="page-banner">
        <div className="container mx-auto px-4 relative z-10">
          <h1>Gallery</h1>
          <div className="breadcrumb">
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
