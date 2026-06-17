'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, UserRound, Building2 } from 'lucide-react';

const iconMap = {
  ImageIcon,
  UserRound,
  Building2,
};

export function FallbackImage({ src, alt, className, width, height, fill = true, sizes, priority, fallbackIcon = 'ImageIcon' }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const Icon = iconMap[fallbackIcon] || ImageIcon;

  // If no src is provided or image loading failed, show fallback
  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-surface-alt text-text-disabled ${className}`}>
        <Icon className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  // Next.js Image expects absolute URLs or paths starting with '/'
  const imageSrc = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-surface-alt animate-pulse z-0" />
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
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
