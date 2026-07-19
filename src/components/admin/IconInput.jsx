import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

/**
 * IconInput — Reusable icon-prefixed input for admin forms.
 *
 * Mirrors the login page's carefully fixed icon-input pattern using
 * explicit pixel constants to prevent icon/text overlap.
 *
 * NOTE: This component is for ADMIN forms only. The login page's
 * icon inputs are a separate, previously-fixed implementation that
 * must NOT be modified or replaced.
 *
 * Props:
 * @param {React.ComponentType} icon - Lucide icon component to show on the left
 * @param {string}  label     - Optional label text
 * @param {string}  name      - Form field name (used by react-hook-form register)
 * @param {Function} register - react-hook-form register function
 * @param {object}  error     - react-hook-form error object for this field
 * @param {string}  type      - Input type (default: "text")
 * @param {string}  className - Additional wrapper class names
 * @param {...any}  props     - Passed to the <input> element
 */

// Constants for icon alignment — kept explicit to avoid CSS conflicts
const ICON_LEFT = 16;
const ICON_SIZE = 20;
const INPUT_PADDING_LEFT = ICON_LEFT + ICON_SIZE + 12; // 48px

export function IconInput({ icon: Icon, label, name, register, error, type = 'text', className, ...props }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div
            className="absolute inset-y-0 flex items-center pointer-events-none"
            style={{ left: ICON_LEFT }}
          >
            <Icon
              className="text-text-disabled"
              style={{ width: ICON_SIZE, height: ICON_SIZE }}
            />
          </div>
        )}
        <input
          id={name}
          type={type}
          {...(register ? register(name) : {})}
          className={cn(
            'block w-full h-12 pr-4 rounded-xl border bg-bg text-text-primary text-sm',
            'focus:outline-none focus:ring-2 transition-all',
            error
              ? 'border-error focus:ring-error/20'
              : 'border-border hover:border-text-disabled focus:border-primary focus:ring-primary/20',
          )}
          style={{ paddingLeft: Icon ? INPUT_PADDING_LEFT : 16 }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
}
