import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPricingPlans } from '@/lib/data-fetchers';
import { CheckCircle2 } from 'lucide-react';
import { ContactCta } from '@/components/shared/ContactCta';

export const metadata = {
  title: 'Pricing & Membership Plans',
  description: 'View coaching plans, casual play rates, and fitness membership pricing at Champions Sports Arena, Jaipur. Contact us for current offers.',
};

export default async function PricingPage() {
  const plans = await getPricingPlans();

  // Group plans by category (coaching, casual, fitness)
  const coachingPlans = plans?.filter(p => p.category === 'coaching') || [];
  const casualPlans = plans?.filter(p => p.category === 'casual') || [];
  const fitnessPlans = plans?.filter(p => p.category === 'fitness') || [];

  return (
    <>
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Pricing & Plans</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> Pricing
          </div>
        </div>
      </div>

      <div className="bg-warning/10 text-center py-3 border-y border-warning/20">
        <p className="text-body-sm text-warning font-medium">Prices are indicative. Contact us for current offers and family discounts.</p>
      </div>

      <Section>
        {coachingPlans.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 text-center">Coaching Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {coachingPlans.map(renderPlanCard)}
            </div>
          </div>
        )}

        {casualPlans.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 text-center">Casual Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {casualPlans.map(renderPlanCard)}
            </div>
          </div>
        )}

        {fitnessPlans.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-3xl mb-8 text-center">Fitness Zone</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {fitnessPlans.map(renderPlanCard)}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-body-lg text-text-secondary mb-4">Have questions about our pricing?</p>
          <Button asChild variant="ghost">
            <Link href="/faq">View FAQs</Link>
          </Button>
        </div>
      </Section>
      <ContactCta />
    </>
  );
}

function renderPlanCard(plan) {
  return (
    <Card key={plan._id} className={plan.isPopular ? 'border-primary ring-1 ring-primary relative' : ''}>
      {plan.isPopular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 z-10">
          <Badge variant="accent" className="shadow-md">Most Popular</Badge>
        </div>
      )}
      <CardHeader className="text-center bg-surface-alt/50 border-b border-border">
        <CardTitle className="text-xl mb-1">{plan.name}</CardTitle>
        <p className="text-body-sm text-text-secondary">{plan.description}</p>
        <div className="mt-6 flex justify-center items-baseline gap-1">
          <span className="text-body-sm text-text-secondary">From</span>
          <span className="text-3xl font-bold font-heading">₹{plan.price}</span>
          <span className="text-text-secondary">/{plan.period}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-4 mb-8">
          {plan.inclusions?.map((feature, idx) => (
            <li key={idx} className="flex gap-3 text-body-sm">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="w-full" variant={plan.isPopular ? 'primary' : 'secondary'}>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">Enquire Now</a>
        </Button>
      </CardContent>
    </Card>
  );
}
