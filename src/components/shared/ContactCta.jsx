import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function ContactCta({ title = "Ready to get started?", customText, primaryButtonText = "Call Now" }) {
  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--gradient-cta)' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div className="text-white py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{title}</h2>
          <p className="text-white/75 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            {customText || "Book a trial session, reserve a court, or just drop by to see our facilities in person."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="accent" size="lg">
              <a href="tel:+919352812625">{primaryButtonText}</a>
            </Button>
            <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90 border-0">
              <a href="https://wa.me/919352812625" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white hover:text-white/90">
              <Link href="/contact">Get Directions →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
