'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, PhoneCall, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Sports', href: '/sports' },
  { name: 'Coaching', href: '/coaching' },
  { name: 'Facilities', href: '/facilities' },
  { name: 'Events', href: '/events' },
  { name: 'Pricing', href: '/pricing' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[200] transition-all duration-300 bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(10,12,20,0.95)] backdrop-blur-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] border-b border-black/5 dark:border-white/[0.08]"
      >
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0">
              <Image src="/images/logo.jpg" alt="Bharti Sports Arena Logo" fill className="object-cover" sizes="40px" />
            </div>
            <span className="font-heading font-bold text-xl transition-colors text-text-primary">
              Bharti Sports Arena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 xl:gap-10">
            <ul className="flex items-center gap-5 lg:gap-9">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'relative text-sm font-semibold py-2 transition-all duration-300 tracking-wide whitespace-nowrap group',
                        isActive 
                          ? 'text-primary' 
                          : 'text-text-secondary hover:text-primary'
                      )}
                    >
                      {link.name}
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-0.5 bg-current rounded-full transition-all duration-300",
                        isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"
                      )} />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3 border-l border-border/50 pl-5 ml-1">
              <ThemeToggle />
              <a
                href="tel:+919352812625"
                className="hidden xl:flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                Call Now
              </a>
              <a
                href="https://wa.me/919352812625"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-2 h-9 px-4 rounded-lg bg-accent text-gray-900 text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg transition-colors text-text-primary hover:bg-surface-alt"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-surface z-[401] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col border-l border-border',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden relative shrink-0">
              <Image src="/images/logo.jpg" alt="Bharti Sports Arena Logo" fill className="object-cover" sizes="36px" />
            </div>
            <span className="font-heading font-bold text-lg text-text-primary">
              Bharti Sports Arena
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-text-secondary p-2 hover:bg-surface-alt rounded-full transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-5 flex-grow overflow-y-auto bg-white dark:bg-surface">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200',
                      isActive 
                        ? 'text-primary bg-primary/10 border border-primary/20' 
                        : 'text-text-primary hover:bg-surface-alt hover:text-primary'
                    )}
                  >
                    {isActive && <span className="w-1.5 h-5 bg-primary rounded-full shrink-0" />}
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-5 border-t border-border flex flex-col gap-3 bg-surface-alt/50">
          <a
            href="tel:+919352812625"
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            <PhoneCall className="w-5 h-5" />
            Call Now
          </a>
          <a
            href="https://wa.me/919352812625"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-accent text-gray-900 font-bold hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
