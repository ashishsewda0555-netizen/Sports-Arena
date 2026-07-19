'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { X } from 'lucide-react';

export function CoachCard({ coach }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <Card id={coach._id} className="flex flex-col h-full group">
        <div className="aspect-[4/5] bg-surface-alt relative overflow-hidden">
          <FallbackImage 
            src={coach.imageUrl || ''} 
            alt={coach.name} 
            fallbackIcon="UserRound"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {coach.yearsOfExperience > 0 && <Badge variant="accent">{coach.yearsOfExperience} Years Exp.</Badge>}
              {coach.certifications?.slice(0,1).map((cert, i) => (
                <Badge key={i} variant="default" className="bg-white/90 text-text-primary line-clamp-1 truncate max-w-[150px]">{cert}</Badge>
              ))}
            </div>
          </div>
        </div>
        <CardContent className="pt-6 flex-grow flex flex-col relative">
          <CardTitle as="h3" className="text-2xl mb-1">{coach.name}</CardTitle>
          <p className="text-primary font-medium mb-3">
            {coach.specializations?.map(s => s.name || s).join(', ') || ''}
          </p>
          <div 
            className="text-body-sm text-text-secondary line-clamp-3 mb-4 flex-grow leading-relaxed"
          >
            {coach.bioShort || coach.bioFull || ''}
          </div>
          
          {coach.achievements?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase text-text-primary mb-2 tracking-wider">Key Achievements</p>
              <ul className="text-body-sm text-text-secondary space-y-1 list-disc list-inside">
                {coach.achievements.slice(0, 2).map((achievement, i) => (
                  <li key={i} className="line-clamp-1">{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {coach.bioFull && (
            <div className="mt-auto pt-2 border-t border-border/50">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
              >
                Read More &rarr;
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for Full Bio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-sm transition-opacity">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          {/* Modal Content */}
          <div className="relative bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header / Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-alt hover:bg-border text-text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex flex-col md:flex-row h-full overflow-y-auto">
              {/* Left col: Image & Quick Stats (sticky on md) */}
              <div className="md:w-2/5 p-6 md:p-8 bg-surface-alt/30 border-b md:border-b-0 md:border-r border-border shrink-0">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-6 relative">
                  <FallbackImage 
                    src={coach.imageUrl || ''} 
                    alt={coach.name} 
                    fallbackIcon="UserRound"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-1 text-text-primary">{coach.name}</h3>
                <p className="text-primary font-semibold mb-4">
                  {coach.specializations?.map(s => s.name || s).join(', ') || ''}
                </p>
                
                <div className="space-y-4">
                  {coach.yearsOfExperience > 0 && (
                    <div>
                      <p className="text-xs text-text-disabled uppercase tracking-wider font-semibold mb-1">Experience</p>
                      <p className="text-sm text-text-primary font-medium">{coach.yearsOfExperience} Years</p>
                    </div>
                  )}
                  {coach.certifications?.length > 0 && (
                    <div>
                      <p className="text-xs text-text-disabled uppercase tracking-wider font-semibold mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {coach.certifications.map((cert, i) => (
                          <Badge key={i} variant="secondary" className="text-[11px] py-0.5">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right col: Bio & Details */}
              <div className="md:w-3/5 p-6 md:p-8">
                <div className="mb-8">
                  <h4 className="text-lg font-bold font-heading mb-3 text-text-primary">About {coach.name.split(' ')[0]}</h4>
                  <div className="prose prose-sm dark:prose-invert text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {coach.bioFull}
                  </div>
                </div>

                {coach.achievements?.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold font-heading mb-3 text-text-primary">Key Achievements</h4>
                    <ul className="space-y-2">
                      {coach.achievements.map((achievement, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-secondary">
                          <span className="text-primary mt-1 text-[10px]">●</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
