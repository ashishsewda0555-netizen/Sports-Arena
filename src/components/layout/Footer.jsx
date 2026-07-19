'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ArrowRight, Send } from 'lucide-react';
import { getTelLink } from '@/lib/utils';
import { fetchApi } from '@/lib/apiClient';

/** Ensure a URL has a protocol prefix so it doesn't resolve as a relative path. */
function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const Instagram = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Facebook = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Youtube = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Coaching', href: '/coaching' },
  { name: 'Facilities', href: '/facilities' },
  { name: 'Pricing & Plans', href: '/pricing' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Events', href: '/events' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Contact', href: '/contact' },
];

const sportsLinks = [
  { name: 'Badminton', href: '/sports/badminton' },
  { name: 'Table Tennis', href: '/sports/table-tennis' },
  { name: 'Fitness Zone', href: '/sports/fitness' },
  { name: 'Snooker', href: '/sports/snooker' },
  { name: 'Chess & Carrom', href: '/sports/chess' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const phone1 = '+91 9352812625';
  const phone2 = '+91 9571794918';
  const email = 'bhartisportsarena@gmail.com';
  const address = 'Kanwarpura Chouraha, Near Prince Education Hub, Bikaner Agra Bypass Road, Sikar, Rajasthan 332001';

  const [socialLinks, setSocialLinks] = useState(null);

  useEffect(() => {
    fetchApi('/public/social-links')
      .then((data) => setSocialLinks(data))
      .catch(() => {}); // Silently fail — icons just stay hidden
  }, []);

  return (
    <footer style={{ background: 'var(--gradient-footer)' }} className="relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-secondary" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 pt-16 pb-8">
        <div className="container mx-auto px-4">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
            
            {/* Col 1: Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-5 group">
                <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0">
                  <Image src="/images/logo.jpg" alt="Bharti Sports Arena Logo" fill className="object-cover" sizes="44px" />
                </div>
                <span className="font-heading font-bold text-2xl text-white group-hover:text-accent transition-colors">
                  Bharti Sports Arena
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-footer-link)' }}>
                A growing multi-sport academy in Sikar offering professional coaching, indoor badminton courts, table tennis, snooker, and more for players of all levels.
              </p>

              {/* Social Icons — fetched from admin Social Links */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Instagram, label: 'Instagram', url: socialLinks?.instagramUrl || 'https://www.instagram.com/bharti_sports_arena/' },
                  { icon: Facebook, label: 'Facebook', url: socialLinks?.facebookUrl || 'https://www.facebook.com/p/Bharti-Sport-Arena-61590606722869/' },
                  { icon: Youtube, label: 'YouTube', url: socialLinks?.youtubeUrl },
                ]
                  .filter(({ url }) => normalizeUrl(url)) // hide icons with no configured URL
                  .map(({ icon: Icon, label, url }) => (
                  <a
                    key={label}
                    href={normalizeUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-white/15" style={{ color: 'var(--color-footer-heading)' }}>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm hover:text-white group transition-colors duration-200"
                      style={{ color: 'var(--color-footer-link)' }}
                    >
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Sports */}
            <div>
              <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-white/15" style={{ color: 'var(--color-footer-heading)' }}>
                Our Sports
              </h4>
              <ul className="space-y-3">
                {sportsLinks.map((sport) => (
                  <li key={sport.name}>
                    <Link
                      href={sport.href}
                      className="flex items-center gap-2 text-sm hover:text-white group transition-colors duration-200"
                      style={{ color: 'var(--color-footer-link)' }}
                    >
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      {sport.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/sports"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold mt-2 transition-colors"
                    style={{ color: 'var(--color-footer-link-hover)' }}
                  >
                    View All Sports <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Info */}
            <div>
              <h4 className="font-heading font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-white/15" style={{ color: 'var(--color-footer-heading)' }}>
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--color-footer-link)' }}>
                    {address}
                  </span>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <a
                      href={getTelLink(phone1.replace(/\s/g, ''))}
                      className="text-sm font-medium hover:text-white transition-colors"
                      style={{ color: 'var(--color-footer-link)' }}
                    >
                      {phone1}
                    </a>
                    <a
                      href={getTelLink(phone2.replace(/\s/g, ''))}
                      className="text-sm font-medium hover:text-white transition-colors"
                      style={{ color: 'var(--color-footer-link)' }}
                    >
                      {phone2}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-medium hover:text-white transition-colors"
                    style={{ color: 'var(--color-footer-link)' }}
                  >
                    {email}
                  </a>
                </li>
              </ul>

              {/* Newsletter CTA */}
              <div className="mt-6 p-4 rounded-xl bg-white/8 border border-white/12">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--color-footer-heading)' }}>
                  Get Arena Updates
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 h-9 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent transition-colors"
                    aria-label="Newsletter email"
                  />
                  <button
                    className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                    aria-label="Subscribe"
                  >
                    <Send className="w-4 h-4 text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-center sm:text-left" style={{ color: 'var(--color-footer-muted)' }}>
              &copy; {currentYear} Bharti Sports Arena. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--color-footer-muted)' }}>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="opacity-30">|</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <span className="opacity-30">|</span>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
