import { PlaySquare } from 'lucide-react';

export function DynamicVideo({ video, fallbackMessage = "Video coming soon", className = "" }) {
  if (!video || !video.embedUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-surface-alt text-text-disabled h-full w-full ${className}`}>
        <PlaySquare className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm font-medium opacity-70">{fallbackMessage}</p>
      </div>
    );
  }

  const { videoType, embedUrl, title } = video;

  if (videoType === 'self-hosted') {
    return (
      <video 
        src={embedUrl} 
        title={title || "Video Player"}
        controls
        playsInline
        className={`w-full h-full object-cover bg-black ${className}`}
      />
    );
  }

  // YouTube or Vimeo (iframe fallback)
  return (
    <iframe 
      src={embedUrl} 
      title={title || "Video Player"} 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
      className={`w-full h-full bg-black ${className}`}
    />
  );
}
