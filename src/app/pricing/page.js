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
  description: 'View coaching plans, casual play rates, and fitness membership pricing at Bharti Sports Arena, Jaipur. Contact us for current offers.',
};

export default async function PricingPage() {
  const plans = await getPricingPlans();

  // Group plans by category (coaching, casual, fitness)
  const coachingPlans = plans?.filter(p => p.category === 'coaching') || [];
  const casualPlans = plans?.filter(p => p.category === 'casual-play') || [];
  const fitnessPlans = plans?.filter(p => p.category === 'fitness-zone') || [];

  return (
    <>
      <div className="page-banner">
        <div className="container mx-auto px-4 relative z-10">
          <h1>Pricing & Plans</h1>
          <div className="breadcrumb">
            Home <span className="mx-2">/</span> Pricing
          </div>
        </div>
      </div>

      <div className="bg-warning/10 text-center py-3 border-y border-warning/20">
        <p className="text-body-sm text-warning font-medium">Prices are indicative. Contact us for current offers and family discounts.</p>
      </div>

      <Section>
        {coachingPlans.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl">Pricing & Plans</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {coachingPlans.map(renderPlanCard)}
            </div>
          </div>
        )}

        {casualPlans.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="overline">PAY & PLAY</span>
              <h2 className="font-heading font-bold text-3xl">Casual Play</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {casualPlans.map(renderPlanCard)}
            </div>
          </div>
        )}

        {fitnessPlans.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <span className="overline">HEALTH & FITNESS</span>
              <h2 className="font-heading font-bold text-3xl">Fitness Zone</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {fitnessPlans.map(renderPlanCard)}
            </div>
          </div>
        )}

        <div className="mt-20 text-center">
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
    <Card key={plan._id} className={plan.isPopular ? 'border-primary ring-2 ring-primary/20 scale-[1.03] shadow-xl relative z-10' : ''}>
      {plan.isPopular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 z-10">
          <Badge variant="accent" className="shadow-md">Most Popular</Badge>
        </div>
      )}
      <CardHeader className="text-center border-b border-border bg-gradient-to-b from-surface-alt/50 to-transparent">
        <CardTitle className="text-xl mb-1">{plan.planName}</CardTitle>
        <p className="text-body-sm text-text-secondary">{plan.description}</p>
        <div className="mt-6 flex justify-center items-baseline gap-1">
          <span className="text-body-sm text-text-secondary">From</span>
          <span className="text-4xl font-bold font-heading text-primary">₹{plan.priceNumeric || (plan.priceLabel && plan.priceLabel.replace('₹', '')) || '0'}</span>
          <span className="text-text-secondary">/{plan.billingPeriod}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-4 mb-8">
          {plan.inclusions?.map((feature, idx) => (
            <li key={idx} className="flex gap-3 text-body-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="w-full" variant={plan.isPopular ? 'primary' : 'secondary'}>
          <a href="https://wa.me/919352812625" target="_blank" rel="noopener noreferrer">Enquire Now</a>
        </Button>
      </CardContent>
    </Card>
  );
}
