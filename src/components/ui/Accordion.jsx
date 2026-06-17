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
    <div className={cn('w-full divide-y divide-border border border-border rounded-md bg-surface', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="overflow-hidden">
            <button
              className="flex justify-between items-center w-full p-4 text-left focus-visible:outline-none focus-visible:bg-surface-alt hover:bg-surface-alt transition-colors"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span className="font-heading font-semibold text-text-primary pr-4">{item.question || item.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-text-secondary transition-transform duration-200 shrink-0',
                  isOpen && 'transform rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-0 text-text-secondary text-body-sm leading-relaxed">
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
