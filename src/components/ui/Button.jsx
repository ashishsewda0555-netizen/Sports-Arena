import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  asChild = false, 
  type = 'button',
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97] select-none";
  
  const variants = {
    // White text on green — always readable
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary-dark hover:shadow-[0_4px_20px_rgba(27,94,32,0.35)] shadow-sm",
    // Green border + green text on white — readable on light surfaces
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white shadow-sm",
    // Dark text on amber — highly readable (amber is a light color)
    accent: "bg-gradient-to-r from-accent to-[#E65C00] text-gray-900 font-bold hover:shadow-[0_4px_20px_rgba(242,169,0,0.40)] shadow-sm",
    // Green text on transparent — readable on light backgrounds
    ghost: "bg-transparent text-primary font-semibold hover:bg-primary/10 hover:text-primary-dark",
    icon: "bg-transparent text-text-primary hover:bg-surface-alt rounded-full",
    outline: "bg-transparent border-2 border-border text-text-primary hover:bg-surface-alt hover:border-primary",
  };

  const sizes = {
    default: "h-12 px-6 text-sm",
    sm: "h-9 px-4 text-sm",
    lg: "h-14 px-8 text-base",
    icon: "h-12 w-12",
  };

  const Component = asChild ? 'span' : 'button';

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

Button.displayName = "Button";
