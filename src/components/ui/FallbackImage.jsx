'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, UserRound, Building2 } from 'lucide-react';

const iconMap = {
  ImageIcon,
  UserRound,
  Building2,
};

const ALLOWED_HOSTS = ['images.unsplash.com', 'res.cloudinary.com'];

export function FallbackImage({ src, alt, className, width, height, fill = true, sizes, priority, fallbackIcon = 'ImageIcon' }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const Icon = iconMap[fallbackIcon] || ImageIcon;

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
        // Invalid URL
      }
    }
  }

  // If no src is provided, image loading failed, or host is unconfigured, show fallback
  if (!src || error || !isSafe) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-surface-alt to-surface text-text-disabled rounded-lg ${className}`}>
        <Icon className="w-8 h-8 opacity-40" />
      </div>
    );
  }

  // Next.js Image expects absolute URLs or paths starting with '/'
  const imageSrc = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 animate-shimmer rounded-lg z-0" />
      )}
      <Image
        src={imageSrc}
        alt={alt || 'Image'}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        className={`object-cover transition-opacity duration-500 z-10 relative ${loading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
