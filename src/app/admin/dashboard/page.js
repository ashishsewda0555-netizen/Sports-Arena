'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { fetchApi } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Inbox, CalendarDays, Users, IndianRupee,
  ImageIcon, HelpCircle, Bell, MessageSquareQuote,
  ArrowUpRight, Clock, User, Activity
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
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

        // Store the 5 most recent leads for the activity feed (real data already fetched)
        const sortedLeads = (Array.isArray(leads) ? leads : [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentLeads(sortedLeads);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <AdminPageHeader 
        title="Dashboard Overview" 
        description="Welcome back. Here is what's happening at Sports Arena today."
      />

      {/* ── Stat Cards ── */}
      <div className="-mx-1 px-1 pt-1 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <StatCard 
          title="New Leads" 
          value={stats?.newLeads ?? '-'} 
          icon={Inbox} 
          href="/admin/leads"
          category="leads"
          loading={loading}
          contextLine="Last 7 days"
        />
        <StatCard 
          title="Upcoming Events" 
          value={stats?.upcomingEvents ?? '-'} 
          icon={CalendarDays} 
          href="/admin/events"
          category="events"
          loading={loading}
          contextLine="Active & scheduled"
        />
        <StatCard 
          title="Active Coaches" 
          value={stats?.totalCoaches ?? '-'} 
          icon={Users} 
          href="/admin/coaches"
          category="coaches"
          loading={loading}
          contextLine="On the roster"
        />
        <StatCard 
          title="Pricing Plans" 
          value={stats?.totalPricingPlans ?? '-'} 
          icon={IndianRupee} 
          href="/admin/pricing"
          category="pricing"
          loading={loading}
          contextLine="Published plans"
        />
      </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Recent Activity (2/3 width) ── */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.10)' }}>
                <Activity className="w-5 h-5" style={{ color: '#3B82F6' }} />
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-text-primary">Recent Leads</h3>
                <p className="text-xs text-text-secondary">Latest contact form submissions</p>
              </div>
            </div>
            <Link href="/admin/leads">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-border">
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-5 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-surface-alt shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-alt rounded w-1/3" />
                    <div className="h-3 bg-surface-alt rounded w-1/2" />
                  </div>
                  <div className="h-5 w-16 bg-surface-alt rounded-full" />
                </div>
              ))
            ) : recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead._id} className="flex items-center gap-4 p-5 hover:bg-surface-alt/50 transition-colors">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{lead.name}</p>
                    <p className="text-xs text-text-secondary truncate">
                      {lead.sportOfInterest || 'General Inquiry'} · {lead.phone || lead.email || ''}
                    </p>
                  </div>

                  {/* Status + Time */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge 
                      variant={lead.status === 'new' ? 'error' : lead.status === 'contacted' ? 'warning' : 'default'} 
                      dot
                    >
                      {lead.status}
                    </Badge>
                    <span className="text-[11px] text-text-disabled flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-alt flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6 text-text-disabled" />
                </div>
                <p className="text-text-secondary text-sm font-medium">No leads yet</p>
                <p className="text-text-disabled text-xs mt-1">Contact form submissions will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (1/3 width) ── */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-heading font-bold text-text-primary">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <Link href="/admin/gallery">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2.5 h-11 text-sm font-medium">
                  <ImageIcon className="w-4 h-4 text-text-secondary" /> Manage Gallery
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                </Button>
              </Link>
              <Link href="/admin/faqs">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2.5 h-11 text-sm font-medium">
                  <HelpCircle className="w-4 h-4 text-text-secondary" /> Update FAQs
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                </Button>
              </Link>
              <Link href="/admin/testimonials">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2.5 h-11 text-sm font-medium">
                  <MessageSquareQuote className="w-4 h-4 text-text-secondary" /> Testimonials
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                </Button>
              </Link>
              <Link href="/admin/coaches">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2.5 h-11 text-sm font-medium">
                  <Users className="w-4 h-4 text-text-secondary" /> Manage Coaches
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(249,115,22,0.10)' }}>
                <Bell className="w-5 h-5" style={{ color: '#F97316' }} />
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-text-primary">Announcements</h3>
                <p className="text-xs text-text-secondary">Public website alerts</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Manage the alert banners displayed on the public website for visitors.
            </p>
            <Link href="/admin/announcements">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Bell className="w-4 h-4" /> Manage Announcements
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
