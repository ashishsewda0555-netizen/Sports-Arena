import Link from 'next/link';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { getGalleryImages } from '@/lib/data-fetchers';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export async function PhotoStrip() {
  const images = await getGalleryImages();
  
  // Use DB images if available, otherwise use verified fallback images
  const fallbackImages = [
    { url: IMAGES.gallery1 },
    { url: IMAGES.gallery2 },
    { url: IMAGES.gallery3 },
    { url: IMAGES.gallery4 },
  ];
  
  const stripImages = images && images.length > 0
    ? Array.from({ length: 4 }).map((_, i) => images[i] || fallbackImages[i] || { url: '' })
    : fallbackImages;

  return (
    <div className="w-full overflow-hidden flex h-48 md:h-72 my-0 group cursor-pointer relative">
      <Link href="/gallery" className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/60 via-black/30 to-black/60">
        <span className="bg-white text-primary font-semibold px-6 py-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
          View Full Gallery <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
      
      {/* Image 1: Always visible */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden border-r-2 border-bg">
        <FallbackImage src={stripImages[0].url} alt="Gallery image 1" className="group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      {/* Image 2: Hidden on smallest screens */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden border-r-2 border-bg hidden sm:block">
        <FallbackImage src={stripImages[1].url} alt="Gallery image 2" className="group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      {/* Image 3: Hidden on mobile */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden border-r-2 border-bg hidden md:block">
        <FallbackImage src={stripImages[2].url} alt="Gallery image 3" className="group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      {/* Image 4: Hidden on smaller tablets */}
      <div className="flex-1 bg-surface-alt relative overflow-hidden hidden lg:block">
        <FallbackImage src={stripImages[3].url} alt="Gallery image 4" className="group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>
  );
}
