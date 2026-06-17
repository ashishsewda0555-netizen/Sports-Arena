import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { getFaqs } from '@/lib/data-fetchers';
import { SchemaMarkup, generateFaqSchema } from '@/components/seo/SchemaMarkup';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about coaching, pricing, timings, and facilities at Champions Sports Arena, Jaipur.',
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
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Frequently Asked Questions</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> FAQ
          </div>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="mb-12">
                <h2 className="font-heading font-bold text-2xl mb-6 capitalize text-primary border-b border-border pb-2">
                  {category.replace('-', ' ')}
                </h2>
                <Accordion items={groupedFaqs[category]} />
              </div>
            ))
          ) : (
            <div className="text-center text-text-secondary py-12">
              FAQs will be updated soon.
            </div>
          )}

          <div className="mt-16 bg-surface-alt p-8 rounded-lg text-center border border-border">
            <h3 className="font-heading font-bold text-2xl mb-4">Still have questions?</h3>
            <p className="text-text-secondary mb-6">We're here to help. Reach out to us via WhatsApp or Contact Form.</p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="accent">
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
