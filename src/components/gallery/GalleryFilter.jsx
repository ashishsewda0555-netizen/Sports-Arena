'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FallbackImage } from '@/components/ui/FallbackImage';

export function GalleryFilter({ images }) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(images?.map(img => img.category).filter(Boolean))];

  // Filter images
  const filteredImages = activeCategory === 'All' 
    ? images 
    : images?.filter(img => img.category === activeCategory);

  return (
    <div>
      {/* Horizontal Scrollable Filter Bar */}
      {categories.length > 1 && (
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border",
                activeCategory === category 
                  ? "bg-primary text-white border-primary shadow-md" 
                  : "bg-surface text-text-secondary border-border hover:border-primary/40 hover:text-primary"
              )}
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages?.length > 0 ? filteredImages.map((image) => (
          <div key={image._id} className="relative aspect-square bg-surface-alt rounded-xl overflow-hidden group cursor-pointer">
            <FallbackImage 
              src={image.imageUrl || ''} 
              alt={image.title || 'Gallery Image'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
               <p className="text-white font-medium text-sm">{image.title}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center text-text-secondary bg-surface rounded-xl border border-border">
            No images found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
