'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { fetchApi } from '@/lib/apiClient';
import { Card } from '@/components/ui/Card';
import { Inbox, CalendarDays, ImageIcon, Users, IndianRupee, HelpCircle, Bell } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would create an endpoint /api/v1/admin/dashboard/stats
    // For now, we will mock or fetch individual counts if the aggregate endpoint doesn't exist.
    // Let's assume the Express backend has it, or we fetch them concurrently.
    const fetchStats = async () => {
      try {
        // Fallback parallel requests if a unified stats endpoint isn't available:
        const [coaches, events, leads, faqs, pricing] = await Promise.all([
          fetchApi('/public/coaches').catch(() => []),
          fetchApi('/public/events?status=upcoming').catch(() => []),
          fetchApi('/admin/leads').catch(() => []), // Needs auth
          fetchApi('/public/faqs').catch(() => []),
          fetchApi('/public/pricing').catch(() => [])
        ]);

        setStats({
          newLeads: leads?.filter(l => l.status === 'new').length || 0,
          upcomingEvents: events?.length || 0,
          totalCoaches: coaches?.length || 0,
          totalFaqs: faqs?.length || 0,
          totalPricingPlans: pricing?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, href, colorClass }) => (
    <Link href={href} className="block group">
      <div className={`bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow h-full ${colorClass}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
            {loading ? (
              <div className="h-8 w-16 bg-surface-alt animate-pulse rounded" />
            ) : (
              <h3 className="text-3xl font-heading font-bold text-primary group-hover:text-secondary transition-colors">
                {value}
              </h3>
            )}
          </div>
          <div className="p-3 bg-bg rounded-full border border-border">
            <Icon className="w-6 h-6 text-text-secondary group-hover:text-secondary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <AdminPageHeader 
        title="Dashboard Overview" 
        description="Welcome back. Here is what's happening at Sports Arena today."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="New Leads (7 Days)" 
          value={stats?.newLeads ?? '-'} 
          icon={Inbox} 
          href="/admin/leads"
          colorClass="border-l-4 border-l-secondary"
        />
        <StatCard 
          title="Upcoming Events" 
          value={stats?.upcomingEvents ?? '-'} 
          icon={CalendarDays} 
          href="/admin/events"
          colorClass="border-l-4 border-l-accent"
        />
        <StatCard 
          title="Active Coaches" 
          value={stats?.totalCoaches ?? '-'} 
          icon={Users} 
          href="/admin/coaches"
          colorClass="border-l-4 border-l-primary"
        />
        <StatCard 
          title="Pricing Plans" 
          value={stats?.totalPricingPlans ?? '-'} 
          icon={IndianRupee} 
          href="/admin/pricing"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-bold text-primary mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-warning" />
            Active Announcements
          </h3>
          <p className="text-text-secondary text-sm">
            Check the <Link href="/admin/announcements" className="text-secondary hover:underline">Announcements module</Link> to manage alerts displayed on the public website.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-bold text-primary mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/gallery" className="text-sm text-secondary hover:underline flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Manage Gallery
            </Link>
            <Link href="/admin/faqs" className="text-sm text-secondary hover:underline flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Update FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
