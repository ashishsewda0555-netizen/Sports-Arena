'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

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
        <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-8 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
                activeCategory === category 
                  ? "bg-primary text-white border-primary" 
                  : "bg-surface-alt text-text-secondary border-border hover:border-primary/50"
              )}
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Static Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages?.length > 0 ? filteredImages.map((image) => (
          <div key={image._id} className="relative aspect-square bg-surface-alt rounded-md overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-text-disabled text-sm">Image {image.title}</div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
               <p className="text-white text-center font-medium">{image.title}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-text-secondary">
            No images found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
