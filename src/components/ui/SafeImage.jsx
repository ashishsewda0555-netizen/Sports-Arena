'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

const ALLOWED_HOSTS = ['images.unsplash.com', 'res.cloudinary.com'];

export function SafeImage({ src, alt, fallbackText, className, fill, sizes, priority }) {
  const [error, setError] = useState(false);

  // Guard against unconfigured or missing external URLs to prevent next/image SSR crashes
  let isSafe = false;
  if (src) {
    if (src.startsWith('/')) {
      isSafe = true;
    } else if (src.startsWith('http')) {
      try {
        const url = new URL(src);
        if (ALLOWED_HOSTS.includes(url.hostname)) {
          isSafe = true;
        }
      } catch (e) {
        // Invalid URL string
      }
    }
  }

  if (!isSafe || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-surface-alt text-text-disabled w-full h-full min-h-[150px] ${className}`}>
        <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
        <span className="text-xs font-semibold uppercase tracking-wider">{fallbackText || 'Image Unavailable'}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || 'Image'}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setError(true)}
    />
  );
}
