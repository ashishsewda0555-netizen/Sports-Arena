'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { FallbackImage } from '@/components/ui/FallbackImage';

export function EventsTabs({ upcomingEvents, pastEvents }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="mb-16">
      {/* Tab bar */}
      <div className="flex gap-2 mb-10 p-1 bg-surface-alt rounded-xl w-fit mx-auto">
        <button
          className={cn(
            "px-6 py-3 rounded-lg font-heading font-semibold text-base transition-all duration-200",
            activeTab === 'upcoming' 
              ? "bg-primary text-white shadow-md" 
              : "text-text-secondary hover:text-text-primary"
          )}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={cn(
            "px-6 py-3 rounded-lg font-heading font-semibold text-base transition-all duration-200",
            activeTab === 'past' 
              ? "bg-primary text-white shadow-md" 
              : "text-text-secondary hover:text-text-primary"
          )}
          onClick={() => setActiveTab('past')}
        >
          Past Events
        </button>
      </div>
      
      {events?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => renderEventCard(event, activeTab === 'past'))}
        </div>
      ) : (
        <div className="bg-surface p-12 rounded-2xl border border-border text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-8 h-8 text-text-disabled" />
          </div>
          <h3 className="font-heading font-semibold text-xl mb-2">No {activeTab} Events</h3>
          <p className="text-text-secondary">Check back soon for more updates.</p>
        </div>
      )}
    </div>
  );
}

function renderEventCard(event, isPast) {
  return (
    <Card key={event._id} className={cn("flex flex-col h-full group", isPast && "opacity-85")}>
      <div className="relative h-48 bg-surface-alt overflow-hidden">
        <div className="absolute top-4 left-4 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl flex flex-col items-center justify-center w-14 h-14 z-10 shadow-lg">
          {(() => {
            const parsedDate = event.eventDate ? new Date(event.eventDate) : null;
            const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
            return isValidDate ? (
              <>
                <span className="text-[10px] uppercase font-bold">{parsedDate.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-xl font-bold font-heading leading-none">{parsedDate.getDate()}</span>
              </>
            ) : (
              <span className="text-[10px] font-bold text-center leading-tight">Date TBA</span>
            );
          })()}
        </div>
        <FallbackImage 
          src={event.imageUrl || event.coverImageId?.imageUrl || ''} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <CardContent className="pt-6 flex-grow flex flex-col">
        <div className="flex gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {event.type}
          </span>
          {event.sportId && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
               Sport Event
            </span>
          )}
        </div>
        
        <CardTitle as="h3" className="text-xl mb-2 line-clamp-2">{event.title}</CardTitle>
        <p className="text-body-sm text-text-secondary line-clamp-3 mb-4 flex-grow leading-relaxed">{event.description}</p>
        
        <div className={cn("space-y-2 mt-auto", isPast && "mb-6")}>
          <div className="flex items-start gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <span>
              {formatDate(event.eventDate)} {event.endDate && event.endDate !== event.eventDate ? `- ${formatDate(event.endDate)}` : ''}
            </span>
          </div>
          {event.location && (
            <div className="flex items-start gap-2 text-sm text-text-secondary">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
        
        {isPast && (
          <Button variant="secondary" className="w-full" asChild>
            <Link href="/gallery">View Gallery</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
