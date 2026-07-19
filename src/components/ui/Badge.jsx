import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', dot = false, children, ...props }) {
  const variants = {
    default: 'bg-surface-alt text-text-secondary border-border',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    accent: 'bg-gradient-to-r from-accent to-[#FF8F00] text-[#1A1F1B] border-transparent font-bold',
    // Admin-specific variants
    error: 'bg-error/10 text-error border-error/20',
    info: 'bg-[rgba(59,130,246,0.10)] text-[#3B82F6] border-[rgba(59,130,246,0.20)]',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  };

  // Dot colors per variant (used when dot prop is true)
  const dotColors = {
    default: 'bg-text-secondary',
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    accent: 'bg-accent',
    error: 'bg-error',
    info: 'bg-[#3B82F6]',
    secondary: 'bg-secondary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
