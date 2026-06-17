import { FallbackImage } from '@/components/ui/FallbackImage';
import { Section, SectionHeader } from '@/components/ui/Section';
import { getAboutContent } from '@/lib/data-fetchers';
import { Target, Lightbulb, Users, Trophy } from 'lucide-react';
import { PhotoStrip } from '@/components/shared/PhotoStrip';
import { ContactCta } from '@/components/shared/ContactCta';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Champions Sports Arena\'s story, mission, and world-class facilities serving Jaipur\'s sports community.',
};

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <>
      {/* HEADER BANNER */}
      <div className="bg-surface-alt py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">About Us</h1>
          <div className="text-body-sm text-text-secondary uppercase tracking-wider font-semibold">
            Home <span className="mx-2">/</span> About
          </div>
        </div>
      </div>

      {/* OUR STORY */}
      <Section id="story">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-surface-alt rounded-lg h-[400px] lg:h-[500px] relative overflow-hidden">
            <FallbackImage 
              src={content?.storyImageId?.url || ''} 
              alt="Our Story" 
              className="w-full h-full"
            />
          </div>
          <div>
            <SectionHeader
              overline="OUR STORY"
              title="A Legacy of Sporting Excellence"
              align="left"
              className="mb-6"
            />
            <div 
              className="prose prose-lg prose-green max-w-none text-text-secondary"
              dangerouslySetInnerHTML={{ __html: content?.storyHtml || '<p>Founded with a vision to create a world-class sporting environment, Sports Arena has grown from a single badminton court to a premier multi-sport facility.</p><p>We believe that sports is not just about physical fitness, but about building character, discipline, and community. Our state-of-the-art infrastructure combined with professional coaching ensures that every athlete, whether a beginner or a professional, has the perfect platform to achieve their goals.</p>' }}
            />
          </div>
        </div>
      </Section>

      {/* MISSION & VISION */}
      <Section alt id="mission-vision">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-surface p-8 rounded-lg border border-border shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-4">Our Mission</h3>
            <p className="text-text-secondary">
              {content?.mission || "To provide accessible, world-class sporting facilities and professional coaching to nurture talent and promote a healthy, active lifestyle."}
            </p>
          </div>
          <div className="bg-surface p-8 rounded-lg border border-border shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-[#1A1F1B] mx-auto mb-6">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-semibold text-2xl mb-4">Our Vision</h3>
            <p className="text-text-secondary">
              {content?.vision || "To be the premier destination for sports enthusiasts, fostering a community of champions and lifelong learners."}
            </p>
          </div>
        </div>
      </Section>

      {/* INFRASTRUCTURE */}
      <Section id="infrastructure">
        <SectionHeader
          overline="FACILITIES"
          title="World-Class Infrastructure"
          description="Built to BWF and international standards to ensure the best playing experience."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mt-12 max-w-5xl mx-auto">
          <div className="p-6">
            <div className="font-heading font-bold text-5xl text-primary mb-4">25k</div>
            <h4 className="font-semibold text-lg mb-2">Sq.Ft Area</h4>
            <p className="text-body-sm text-text-secondary">Sprawling facility designed for optimal airflow and space.</p>
          </div>
          <div className="p-6 border-y sm:border-y-0 sm:border-x border-border">
            <div className="font-heading font-bold text-5xl text-primary mb-4">12+</div>
            <h4 className="font-semibold text-lg mb-2">Courts & Tables</h4>
            <p className="text-body-sm text-text-secondary">BWF approved synthetic mats and ITTF certified tables.</p>
          </div>
          <div className="p-6">
            <div className="font-heading font-bold text-5xl text-primary mb-4">24/7</div>
            <h4 className="font-semibold text-lg mb-2">Security & Power</h4>
            <p className="text-body-sm text-text-secondary">Uninterrupted play with full power backup and CCTV.</p>
          </div>
        </div>
      </Section>

      <PhotoStrip />
      <ContactCta />
    </>
  );
}
