'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Video, Link as LinkIcon } from 'lucide-react';
import { getWhatsAppLink, getTelLink } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const phone = '+919876543210';
  const email = 'hello@sportsarena.com';
  const address = '123 Arena Street, Sports City, ST 12345';

  return (
    <footer className="bg-footer-bg text-footer-text pt-16 pb-8 lg:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-heading font-bold text-2xl text-white">
              SportsArena
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              A premium multi-sport facility offering professional coaching, casual play, and state-of-the-art amenities for athletes of all levels.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors text-white" aria-label="Instagram">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors text-white" aria-label="Facebook">
                <LinkIcon className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors text-white" aria-label="YouTube">
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg text-white">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="hover:text-footer-link-hover transition-colors">About Us</Link></li>
              <li><Link href="/coaching" className="hover:text-footer-link-hover transition-colors">Coaching</Link></li>
              <li><Link href="/pricing" className="hover:text-footer-link-hover transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/events" className="hover:text-footer-link-hover transition-colors">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-footer-link-hover transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Sports */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg text-white">Sports</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/sports/badminton" className="hover:text-footer-link-hover transition-colors">Badminton</Link></li>
              <li><Link href="/sports/table-tennis" className="hover:text-footer-link-hover transition-colors">Table Tennis</Link></li>
              <li><Link href="/sports/fitness" className="hover:text-footer-link-hover transition-colors">Fitness Zone</Link></li>
              <li><Link href="/sports/snooker" className="hover:text-footer-link-hover transition-colors">Snooker</Link></li>
              <li><Link href="/sports" className="hover:text-footer-link-hover transition-colors underline underline-offset-4">View All Sports</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg text-white">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-footer-link-hover shrink-0 mt-0.5" />
                <span className="text-sm">{address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-footer-link-hover shrink-0" />
                <a href={getTelLink(phone)} className="text-sm hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-footer-link-hover shrink-0" />
                <a href={`mailto:${email}`} className="text-sm hover:text-white transition-colors">{email}</a>
              </li>
            </ul>
            <div className="mt-2">
              <Link href="/contact" className="text-sm font-semibold text-footer-link-hover hover:text-white transition-colors uppercase tracking-wider">
                Get Directions →
              </Link>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-footer-text/70">
            &copy; {currentYear} Sports Arena. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-footer-text/70">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
