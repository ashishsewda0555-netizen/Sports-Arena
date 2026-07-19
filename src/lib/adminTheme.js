/**
 * Admin Panel Design System — Category Accent Colors & Theme Constants
 * 
 * Centralized color mapping for admin content categories.
 * Used by StatCard, Badge, AdminPageHeader, and list pages
 * to ensure consistent accent colors per module.
 * 
 * NOTE: This is frontend-only — no backend logic here.
 */

export const ADMIN_CATEGORY_COLORS = {
  leads:       { accent: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  text: '#3B82F6', label: 'Leads' },
  events:      { accent: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  text: '#F59E0B', label: 'Events' },
  coaches:     { accent: '#4CAF50', bg: 'rgba(76,175,80,0.10)',   text: '#4CAF50', label: 'Coaches' },
  pricing:     { accent: '#F43F5E', bg: 'rgba(244,63,94,0.10)',   text: '#F43F5E', label: 'Pricing' },
  gallery:     { accent: '#8B5CF6', bg: 'rgba(139,92,246,0.10)',  text: '#8B5CF6', label: 'Gallery' },
  faqs:        { accent: '#06B6D4', bg: 'rgba(6,182,212,0.10)',   text: '#06B6D4', label: 'FAQs' },
  testimonials:{ accent: '#10B981', bg: 'rgba(16,185,129,0.10)',  text: '#10B981', label: 'Testimonials' },
  announcements:{ accent: '#F97316', bg: 'rgba(249,115,22,0.10)', text: '#F97316', label: 'Announcements' },
  'contact-info':{ accent: '#64748B', bg: 'rgba(100,116,139,0.10)', text: '#64748B', label: 'Contact Info' },
  'operating-hours':{ accent: '#14B8A6', bg: 'rgba(20,184,166,0.10)', text: '#14B8A6', label: 'Operating Hours' },
  'social-links':{ accent: '#6366F1', bg: 'rgba(99,102,241,0.10)', text: '#6366F1', label: 'Social Links' },
  users:       { accent: '#A855F7', bg: 'rgba(168,85,247,0.10)',  text: '#A855F7', label: 'Users' },
};

/**
 * Resolve a category key to its color set, with a safe fallback.
 * @param {string} category - One of the ADMIN_CATEGORY_COLORS keys
 * @returns {{ accent: string, bg: string, text: string, label: string }}
 */
export function getCategoryColor(category) {
  return ADMIN_CATEGORY_COLORS[category] || {
    accent: '#4CAF50',
    bg: 'rgba(76,175,80,0.10)',
    text: '#4CAF50',
    label: category || 'Unknown',
  };
}
