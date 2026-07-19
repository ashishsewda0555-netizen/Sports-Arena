'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Image as ImageIcon, Users, IndianRupee, HelpCircle, CalendarDays, MessageSquareQuote, Bell, MapPin, Clock, Share2, Video, Inbox, UsersRound, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { fetchApi } from '@/lib/apiClient';
import { getCategoryColor } from '@/lib/adminTheme';

const NAV_SECTIONS = [
  {
    title: null, // No header for main section
    links: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'dashboard' },
    ],
  },
  {
    title: 'Content',
    links: [
      { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon, category: 'gallery' },
      { href: '/admin/coaches', label: 'Coaches', icon: Users, category: 'coaches' },
      { href: '/admin/pricing', label: 'Pricing', icon: IndianRupee, category: 'pricing' },
      { href: '/admin/events', label: 'Events', icon: CalendarDays, category: 'events' },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, category: 'testimonials' },
      { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle, category: 'faqs' },
    ],
  },
  {
    title: 'Communication',
    links: [
      { href: '/admin/leads', label: 'Leads Inbox', icon: Inbox, category: 'leads' },
      { href: '/admin/announcements', label: 'Announcements', icon: Bell, category: 'announcements' },
    ],
  },
  {
    title: 'Settings',
    links: [
      { href: '/admin/contact-info', label: 'Contact Info', icon: MapPin, category: 'contact-info' },
      { href: '/admin/operating-hours', label: 'Operating Hours', icon: Clock, category: 'operating-hours' },
      { href: '/admin/social-links', label: 'Social Links', icon: Share2, category: 'social-links' },
      { href: '/admin/users', label: 'User Management', icon: UsersRound, role: 'admin', category: 'users' },
    ],
  },
];

import { ToastProvider } from '@/components/ui/ToastProvider';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    fetchApi('/auth/me')
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login'); // Redirect to login if not authenticated
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm font-medium">Loading Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0">
              <Image src="/images/logo.jpg" alt="Bharti Sports Arena Logo" fill className="object-cover" sizes="32px" />
            </div>
            <span className="font-heading font-bold text-base text-text-primary">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setSidebarOpen(true)} className="text-text-primary p-2 rounded-lg hover:bg-surface-alt transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-overlay/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-5 flex items-center justify-between border-b border-border">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden relative shadow-sm shadow-primary/20 shrink-0">
                <Image src="/images/logo.jpg" alt="Bharti Sports Arena Logo" fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base text-text-primary leading-tight">Admin</span>
                <span className="text-[11px] text-text-disabled leading-tight">Sports Arena</span>
              </div>
            </div>
            <span className="font-heading font-bold text-lg text-text-primary md:hidden">Menu</span>
            <button className="md:hidden text-text-secondary p-1.5 hover:bg-surface-alt rounded-lg transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {NAV_SECTIONS.map((section, sectionIdx) => {
              const visibleLinks = section.links.filter(link => !link.role || link.role === user?.role);
              if (visibleLinks.length === 0) return null;
              return (
                <div key={section.title || 'main'} className={sectionIdx > 0 ? 'mt-5' : ''}>
                  {section.title && (
                    <div className="px-3 mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-text-disabled">
                        {section.title}
                      </span>
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {visibleLinks.map((link) => {
                      const isActive = pathname.startsWith(link.href);
                      const Icon = link.icon;
                      const catColor = getCategoryColor(link.category);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            isActive
                              ? 'font-semibold'
                              : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary font-medium'
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: catColor.bg, color: catColor.text }
                              : undefined
                          }
                        >
                          {/* Active indicator bar */}
                          {isActive && (
                            <span
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                              style={{ backgroundColor: catColor.accent }}
                            />
                          )}
                          <Icon
                            className={`w-[18px] h-[18px] transition-colors shrink-0 ${
                              isActive ? '' : 'text-text-disabled group-hover:text-text-secondary'
                            }`}
                            style={isActive ? { color: catColor.text } : undefined}
                          />
                          <span className="text-[13px] tracking-wide">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-border bg-surface-alt/30">
            <div className="flex items-center gap-3 p-2 mb-2 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-text-primary truncate block">{user?.name}</span>
                <span className="text-[11px] text-text-disabled uppercase tracking-wider font-medium">{user?.role}</span>
              </div>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-error bg-error/10 hover:bg-error/15 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-bg">
            <div className="max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
