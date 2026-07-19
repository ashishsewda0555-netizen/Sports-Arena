'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

export function ClickableAvatar({ src, alt, containerClassName, imageSizes }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={`relative overflow-hidden group cursor-pointer ${containerClassName}`}
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          quality={100} 
          className="object-cover object-[center_15%] transition-transform duration-300 group-hover:scale-105" 
          sizes={imageSizes} 
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <ZoomIn className="text-white w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-8">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)} />
          
          {/* Close button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface/20 hover:bg-surface/40 text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Full Image */}
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center pointer-events-none animate-in zoom-in-95 duration-200">
            <Image 
              src={src} 
              alt={`Full view of ${alt}`} 
              fill 
              quality={100}
              className="object-contain" 
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
