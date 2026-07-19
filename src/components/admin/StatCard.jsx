import Link from 'next/link';
import { getCategoryColor } from '@/lib/adminTheme';

/**
 * StatCard — Admin dashboard stat card with category accent styling.
 *
 * Features:
 * - Top accent border matching category color
 * - Icon in a colored badge circle
 * - Clear numeric hierarchy: label above, large bold number, optional context below
 * - Clickable link to the relevant admin section
 * - Loading skeleton state
 *
 * Props:
 * @param {string}  title       - Label text (e.g. "New Leads (7 Days)")
 * @param {string|number} value - The stat number to display
 * @param {React.ComponentType} icon - Lucide icon component
 * @param {string}  href        - Link destination (e.g. "/admin/leads")
 * @param {string}  category    - Category key from ADMIN_CATEGORY_COLORS (e.g. "leads")
 * @param {boolean} loading     - Show skeleton placeholder
 * @param {string}  [contextLine] - Optional small supporting text below the number
 */
export function StatCard({ title, value, icon: Icon, href, category, loading = false, contextLine }) {
  const colors = getCategoryColor(category);

  const content = (
    <div
      className="relative bg-surface border border-border rounded-2xl p-6 transition-all duration-300 h-full group overflow-hidden"
      style={{ borderTopWidth: '3px', borderTopColor: colors.accent }}
    >
      {/* Subtle gradient accent glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-16 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${colors.bg} 0%, transparent 100%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            {title}
          </p>

          {loading ? (
            <div className="h-10 w-20 bg-surface-alt animate-pulse rounded-lg" />
          ) : (
            <h3
              className="text-3xl font-heading font-bold transition-colors duration-200"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {value ?? '—'}
            </h3>
          )}

          {contextLine && !loading && (
            <p className="text-text-secondary text-xs mt-1.5 truncate">
              {contextLine}
            </p>
          )}
        </div>

        {/* Icon badge */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: colors.bg }}
        >
          <Icon className="w-6 h-6" style={{ color: colors.text }} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
