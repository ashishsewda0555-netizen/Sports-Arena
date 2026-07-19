import Image from 'next/image';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { Section, SectionHeader } from '@/components/ui/Section';
import { getAboutContent } from '@/lib/data-fetchers';
import { Target, Lightbulb, Star, Users, Trophy } from 'lucide-react';
import { PhotoStrip } from '@/components/shared/PhotoStrip';
import { ContactCta } from '@/components/shared/ContactCta';
import { IMAGES } from '@/lib/images';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata = {
  title: 'About Us',
  description: "Learn about Bharti Sports Arena's story, mission, and facilities serving Sikar's sports community.",
};

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <>
      {/* Page Banner */}
      <PageHeader bgImage="/images/page-hero.png">
        <h1>About Us</h1>
        <div className="breadcrumb">
          Home <span className="mx-2">/</span> About
        </div>
      </PageHeader>

      {/* OUR STORY */}
      <Section id="story">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl group relative aspect-[4/3]">
            <Image
              src={content?.storyImageId?.url || IMAGES.story}
              alt="Our Story"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div>
            <SectionHeader
              overline="OUR STORY"
              title="A Legacy of Sporting Excellence"
              align="left"
              className="mb-6"
            />
            <div
              className="prose prose-lg prose-green dark:prose-invert max-w-none text-text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: content?.storyHtml ||
                  '<p>Bharti Sports Arena was founded with a simple vision — to create a space where people of all ages can discover the joy of sports and build a healthier lifestyle.</p><p>We believe that sports is not just about physical fitness, but about building character, discipline, and community. Our modern indoor facility combined with professional coaching ensures that every player, whether a beginner or experienced, has the perfect platform to improve their game.</p>',
              }}
            />
          </div>
        </div>
      </Section>

      {/* MISSION & VISION */}
      <Section alt id="mission-vision">
        <SectionHeader
          title="What Drives Us"
          description="Our mission and vision define everything we do at Sports Arena."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          <div className="bg-white dark:bg-surface p-9 rounded-2xl border border-border shadow-sm text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-4 text-text-primary">Our Mission</h3>
            <p className="text-text-secondary leading-relaxed">
              {content?.mission || 'To provide accessible, quality sporting facilities and professional coaching to nurture talent and promote a healthy, active lifestyle for people of all ages and skill levels.'}
            </p>
          </div>
          <div className="bg-white dark:bg-surface p-9 rounded-2xl border border-border shadow-sm text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-4 text-text-primary">Our Vision</h3>
            <p className="text-text-secondary leading-relaxed">
              {content?.vision || 'To be a trusted destination for sports enthusiasts in Sikar — fostering a growing community of players, learners, and passionate athletes.'}
            </p>
          </div>
        </div>
      </Section>

      {/* OUR FACILITIES */}
      <Section id="facilities">
        <SectionHeader
          overline="WHAT WE OFFER"
          title="Our Facilities"
          description="A modern indoor sports academy built for comfort, quality, and performance."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 max-w-5xl mx-auto">
          {[
            { icon: Trophy, title: 'Badminton Courts', desc: '2 professionally maintained indoor badminton courts with quality flooring.' },
            { icon: Star, title: 'Table Sports', desc: 'Table tennis and snooker tables available for all skill levels.' },
            { icon: Users, title: 'Expert Coaches', desc: '3 dedicated coaches providing personalized training and guidance.' },
            { icon: Target, title: 'Growing Community', desc: 'A vibrant and welcoming badminton community for players of all ages.' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-surface p-8 rounded-2xl border border-border shadow-sm text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-primary mb-2">{item.title}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <PhotoStrip />
      <ContactCta />
    </>
  );
}
