'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Accordion({ items, className }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={cn(
            "overflow-hidden rounded-xl border transition-all duration-300",
            isOpen 
              ? "border-primary/30 bg-surface shadow-md" 
              : "border-border bg-surface hover:border-primary/20"
          )}>
            <button
              className="flex justify-between items-center w-full px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset transition-colors"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span className="font-heading font-semibold text-text-primary pr-4">{item.question || item.title}</span>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                isOpen 
                  ? 'bg-primary text-white rotate-180' 
                  : 'bg-surface-alt text-text-secondary'
              )}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-5 text-text-secondary text-body-sm leading-relaxed border-t border-border/50 pt-4">
                  {item.answer || item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
