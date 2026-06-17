'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PhoneCall, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-header transition-all duration-300',
          isScrolled || isMobileMenuOpen
            ? 'bg-bg border-b border-border shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Simple Text Logo for now */}
            <span className="font-heading font-bold text-2xl text-primary">
              SportsArena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-base font-medium transition-colors hover:text-primary',
                        isActive ? 'text-primary' : 'text-text-primary'
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <ThemeToggle />
              <Button size="sm" className="hidden xl:flex">
                <PhoneCall className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button size="sm" variant="accent" className="hidden xl:flex">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-text-primary p-1"
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
          className="fixed inset-0 bg-overlay z-mobile-nav lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-bg z-[401] shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 flex justify-between items-center border-b border-border">
          <span className="font-heading font-bold text-xl text-primary">
            Menu
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-text-primary p-2 hover:bg-surface rounded-full"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-6 flex-grow overflow-y-auto">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-lg font-medium transition-colors block',
                      isActive ? 'text-primary' : 'text-text-primary'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-border flex flex-col gap-4">
          <Button className="w-full justify-center">
            <PhoneCall className="w-5 h-5 mr-2" />
            Call Now
          </Button>
          <Button variant="accent" className="w-full justify-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    </>
  );
}
