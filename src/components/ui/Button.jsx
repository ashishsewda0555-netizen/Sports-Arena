import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn exists or we will create it

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  asChild = false, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md active:shadow-none",
    secondary: "bg-transparent border-[1.5px] border-primary text-primary hover:bg-surface active:bg-surface-alt",
    accent: "bg-accent text-[#1A1F1B] hover:brightness-95 shadow-sm hover:shadow-md",
    ghost: "bg-transparent text-secondary hover:underline",
    icon: "bg-transparent text-primary hover:bg-surface rounded-full",
  };

  const sizes = {
    default: "h-12 px-6",
    sm: "h-9 px-4",
    lg: "h-14 px-8 text-lg",
    icon: "h-12 w-12",
  };

  const Component = asChild ? 'span' : 'button';

  return (
    <Component
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

Button.displayName = "Button";
