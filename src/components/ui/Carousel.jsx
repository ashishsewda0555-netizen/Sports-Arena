'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Carousel({ children, className, options, autoplay = true }) {
  const plugins = autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, ...options }, plugins);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 touch-pan-y">
          {React.Children.map(children, (child) => (
            <div className="flex-none pl-4 min-w-0 w-full sm:w-1/2 lg:w-1/3">
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="hidden lg:flex items-center justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className="p-2 rounded-full border border-border text-text-secondary hover:bg-surface hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className="p-2 rounded-full border border-border text-text-secondary hover:bg-surface hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
