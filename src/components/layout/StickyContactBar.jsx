'use client';

import { useState, useEffect } from 'react';
import { PhoneCall, MessageCircle, Navigation } from 'lucide-react';
import { cn, getWhatsAppLink, getTelLink, getDirectionsLink } from '@/lib/utils';

export function StickyContactBar() {
  const [isVisible, setIsVisible] = useState(false);
  const phone = '+919352812625';
  const lat = '12.9716';
  const lng = '77.5946';

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approx 400px)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 h-[56px] glass-heavy shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-sticky-bar flex transition-transform duration-300 lg:hidden',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <a
        href={getTelLink(phone)}
        className="flex-1 flex flex-col items-center justify-center gap-1 text-text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors"
      >
        <PhoneCall className="w-5 h-5 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Call</span>
      </a>

      <a
        href={getWhatsAppLink(phone, 'Hi, I would like to know more about Sports Arena.')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-accent to-[#FF8F00] text-[#1A1F1B] hover:brightness-95 active:brightness-90 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
      </a>

      <a
        href={getDirectionsLink(lat, lng)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center gap-1 text-text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors"
      >
        <Navigation className="w-5 h-5 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Directions</span>
      </a>
    </div>
  );
}
