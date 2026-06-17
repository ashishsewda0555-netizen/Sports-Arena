'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function EventsTabs({ upcomingEvents, pastEvents }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="mb-16">
      <div className="flex gap-4 border-b border-border mb-8">
        <button
          className={cn(
            "pb-4 font-heading font-bold text-xl lg:text-2xl transition-colors relative",
            activeTab === 'upcoming' ? "text-primary" : "text-text-secondary hover:text-text-primary"
          )}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
          {activeTab === 'upcoming' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
        <button
          className={cn(
            "pb-4 font-heading font-bold text-xl lg:text-2xl transition-colors relative",
            activeTab === 'past' ? "text-primary" : "text-text-secondary hover:text-text-primary"
          )}
          onClick={() => setActiveTab('past')}
        >
          Past Events
          {activeTab === 'past' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>
      
      {events?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => renderEventCard(event, activeTab === 'past'))}
        </div>
      ) : (
        <div className="bg-surface p-8 rounded-lg border border-border text-center">
          <Trophy className="w-12 h-12 text-text-disabled mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-xl mb-2">No {activeTab} Events</h3>
          <p className="text-text-secondary">Check back soon for more updates.</p>
        </div>
      )}
    </div>
  );
}

function renderEventCard(event, isPast) {
  return (
    <Card key={event._id} className={cn("flex flex-col h-full", isPast && "opacity-90")}>
      <div className="relative h-48 bg-surface-alt overflow-hidden">
        <div className="absolute top-4 left-4 bg-primary text-white rounded-md flex flex-col items-center justify-center w-14 h-14 z-10 shadow-md">
          <span className="text-xs uppercase font-semibold">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
          <span className="text-xl font-bold font-heading leading-none">{new Date(event.startDate).getDate()}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-text-disabled text-sm">Event Image</div>
      </div>
      <CardContent className="pt-6 flex-grow flex flex-col">
        <div className="flex gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
            {event.type}
          </span>
          {event.sportId && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded">
               Sport Event
            </span>
          )}
        </div>
        
        <CardTitle as="h3" className="text-xl mb-2 line-clamp-2">{event.title}</CardTitle>
        <p className="text-body-sm text-text-secondary line-clamp-3 mb-4 flex-grow">{event.description}</p>
        
        <div className="space-y-2 mt-auto mb-6">
          <div className="flex items-start gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {formatDate(event.startDate)} {event.endDate && event.endDate !== event.startDate ? `- ${formatDate(event.endDate)}` : ''}
            </span>
          </div>
          {event.location && (
            <div className="flex items-start gap-2 text-sm text-text-secondary">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
        
        <Button variant={isPast ? 'secondary' : 'primary'} className="w-full" asChild={isPast}>
          {isPast ? (
            <Link href="/gallery">View Gallery</Link>
          ) : (
            <a href={event.registrationLink || '#'} target="_blank" rel="noopener noreferrer">
              Register Now
            </a>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
