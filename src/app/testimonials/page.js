import { Section } from '@/components/ui/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { getTestimonials } from '@/lib/data-fetchers';
import { ContactCta } from '@/components/shared/ContactCta';
import { Star, UserRound } from 'lucide-react';
import { FallbackImage } from '@/components/ui/FallbackImage';

export const metadata = {
  title: 'Testimonials & Reviews',
  description: 'Read what our members say about coaching, facilities, and experience at Champions Sports Arena, Jaipur.',
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">What Our Members Say</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Testimonials
          </div>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((testimonial) => (
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
                <div className="flex items-center gap-4 mt-auto">
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
        </div>

        <div className="mt-16 bg-surface p-8 rounded-lg border border-border text-center max-w-3xl mx-auto">
          <div className="flex justify-center text-accent mb-4">
            <Star className="w-8 h-8 fill-current" />
            <Star className="w-8 h-8 fill-current" />
            <Star className="w-8 h-8 fill-current" />
            <Star className="w-8 h-8 fill-current" />
            <Star className="w-8 h-8 fill-current" />
          </div>
          <h3 className="font-heading font-bold text-2xl mb-2">Rated 4.9/5 on Google</h3>
          <p className="text-text-secondary mb-6">Based on 200+ reviews from our amazing community.</p>
          <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-10 px-6 rounded-sm bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
            Read More Reviews on Google
          </a>
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
