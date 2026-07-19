import { Section } from '@/components/ui/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { getTestimonials } from '@/lib/data-fetchers';
import { ContactCta } from '@/components/shared/ContactCta';
import { Star, UserRound } from 'lucide-react';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Testimonials & Reviews',
  description: 'Read what our members say about coaching, facilities, and experience at Bharti Sports Arena, Sikar.',
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <div className="page-banner">
        <div className="container mx-auto px-4 relative z-10">
          <h1>What Our Members Say</h1>
          <div className="breadcrumb">
            Home <span className="mx-2">/</span> Testimonials
          </div>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial._id} className="h-full hover:translate-y-0">
              <CardContent className="pt-6">
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179z"/></svg>
                </div>
                <div className="flex text-accent mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-border mt-auto">
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
                    <p className="text-body-sm text-text-disabled">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Google Review Banner */}
        <div className="mt-20 relative overflow-hidden rounded-2xl text-center max-w-3xl mx-auto" style={{ background: 'var(--gradient-cta)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="p-10 relative z-10">
            <div className="flex justify-center text-accent mb-4">
              <Star className="w-8 h-8 fill-current" />
              <Star className="w-8 h-8 fill-current" />
              <Star className="w-8 h-8 fill-current" />
              <Star className="w-8 h-8 fill-current" />
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2 text-white">Rated 4.9/5 on Google</h3>
            <p className="text-white/75 mb-6">Based on 200+ reviews from our amazing community.</p>
            <Button asChild variant="accent">
              <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Read More Reviews on Google</a>
            </Button>
          </div>
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
