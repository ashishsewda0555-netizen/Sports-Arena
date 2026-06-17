import Link from 'next/link';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { getGalleryImages } from '@/lib/data-fetchers';

export async function PhotoStrip() {
  const images = await getGalleryImages();
  
  // Create an array of 4 items for the layout, padding with empty objects if fewer than 4 exist
  const stripImages = Array.from({ length: 4 }).map((_, i) => images?.[i] || { url: '' });

  return (
    <div className="w-full overflow-hidden flex h-48 md:h-64 my-12 group cursor-pointer relative">
      <Link href="/gallery" className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
        <span className="bg-white text-secondary font-semibold px-6 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          View Full Gallery
        </span>
      </Link>
      
      {/* Image 1: Always visible */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden border-r border-bg">
        <FallbackImage src={stripImages[0].url} alt="Gallery image 1" />
      </div>
      
      {/* Image 2: Hidden on smallest screens */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden border-r border-bg hidden sm:block">
        <FallbackImage src={stripImages[1].url} alt="Gallery image 2" />
      </div>
      
      {/* Image 3: Hidden on mobile */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden border-r border-bg hidden md:block">
        <FallbackImage src={stripImages[2].url} alt="Gallery image 3" />
      </div>
      
      {/* Image 4: Hidden on smaller tablets */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden hidden lg:block">
        <FallbackImage src={stripImages[3].url} alt="Gallery image 4" />
      </div>
    </div>
  );
}
