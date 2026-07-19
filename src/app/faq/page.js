import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { getFaqs } from '@/lib/data-fetchers';
import { SchemaMarkup, generateFaqSchema } from '@/components/seo/SchemaMarkup';
import { MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about coaching, pricing, timings, and facilities at Bharti Sports Arena, Sikar.',
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  // Group FAQs by category
  const groupedFaqs = faqs?.reduce((acc, faq) => {
    const category = faq.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(groupedFaqs || {});
  const schema = generateFaqSchema(faqs);

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="page-banner">
        <div className="container mx-auto px-4 relative z-10">
          <h1>Frequently Asked Questions</h1>
          <div className="breadcrumb">
            Home <span className="mx-2">/</span> FAQ
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-heading font-bold text-2xl capitalize text-text-primary">
                    {category.replace('-', ' ')}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <Accordion items={groupedFaqs[category]} />
              </div>
            ))
          ) : (
            <div className="text-center text-text-secondary py-12 bg-surface rounded-xl border border-border">
              FAQs will be updated soon.
            </div>
          )}

          {/* Still have questions? */}
          <div className="mt-16 relative overflow-hidden rounded-2xl text-center" style={{ background: 'var(--gradient-cta)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="p-10 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-3 text-white">Still have questions?</h3>
              <p className="text-white/75 mb-8 max-w-md mx-auto">We're here to help. Reach out to us via WhatsApp or our Contact Form.</p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="accent">
                  <a href="https://wa.me/919352812625" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
                </Button>
                <Button asChild className="bg-white text-secondary hover:bg-white/90 border-0">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
