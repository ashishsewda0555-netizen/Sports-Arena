'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, Users, IndianRupee, HelpCircle, CalendarDays, MessageSquareQuote, Bell, MapPin, Clock, Share2, Video, Inbox, UsersRound, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { fetchApi } from '@/lib/apiClient';

const ADMIN_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/coaches', label: 'Coaches', icon: Users },
  { href: '/admin/pricing', label: 'Pricing', icon: IndianRupee },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/contact-info', label: 'Contact Info', icon: MapPin },
  { href: '/admin/operating-hours', label: 'Operating Hours', icon: Clock },
  { href: '/admin/social-links', label: 'Social Links', icon: Share2 },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/leads', label: 'Leads Inbox', icon: Inbox },
  { href: '/admin/users', label: 'User Management', icon: UsersRound, role: 'admin' },
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
    return <div className="min-h-screen flex items-center justify-center bg-bg text-text-primary">Loading Admin...</div>;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border">
          <span className="font-heading font-bold text-lg text-primary">Sports Arena Admin</span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setSidebarOpen(true)} className="text-text-primary">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-overlay z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-border">
              <span className="font-heading font-bold text-xl text-primary hidden md:block">Sports Arena</span>
              <span className="font-heading font-bold text-xl text-primary md:hidden">Menu</span>
              <button className="md:hidden text-text-secondary" onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {ADMIN_LINKS.filter(link => !link.role || link.role === user?.role).map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary truncate">{user?.name}</span>
                  <span className="text-xs text-text-secondary uppercase">{user?.role}</span>
                </div>
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-error bg-error/10 hover:bg-error/20 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Desktop Top Bar (Optional, if we want extra actions) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
