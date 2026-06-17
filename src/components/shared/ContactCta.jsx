import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function ContactCta({ title = "Ready to get started?", customText, primaryButtonText = "Call Now" }) {
  return (
    <div className="bg-secondary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">{title}</h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          {customText || "Book a trial session, reserve a court, or just drop by to see our facilities in person."}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="accent">
            <a href="tel:+919876543210">{primaryButtonText}</a>
          </Button>
          <Button asChild className="bg-white text-secondary hover:bg-white/90">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:text-white hover:underline">
            <Link href="/contact">Get Directions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
