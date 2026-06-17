/**
 * Utility functions used across the application.
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a phone number for display (Indian format).
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Generate a WhatsApp link with pre-filled text.
 */
export function getWhatsAppLink(number, message = '') {
  const cleaned = number?.replace(/\D/g, '') || '';
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}${message ? `?text=${encoded}` : ''}`;
}

/**
 * Generate a tel: link.
 */
export function getTelLink(phone) {
  if (!phone) return '#';
  const cleaned = phone.replace(/\D/g, '');
  return `tel:+${cleaned}`;
}

/**
 * Generate Google Maps directions URL from coordinates.
 */
export function getDirectionsLink(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Determine if a facility is currently open based on operating hours.
 * Runs client-side using the visitor's local time converted to facility timezone.
 */
export function isOpenNow(schedule, timezone = 'Asia/Kolkata') {
  if (!schedule || !Array.isArray(schedule)) return null;

  const now = new Date();
  const options = { timeZone: timezone, weekday: 'long' };
  const dayName = new Intl.DateTimeFormat('en-US', options)
    .format(now)
    .toLowerCase();

  const today = schedule.find((d) => d.day === dayName);
  if (!today || !today.isOpen) return false;

  const timeOptions = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const currentTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
  // currentTime is like "06:30"

  return currentTime >= today.openTime && currentTime < today.closeTime;
}

/**
 * Format date for display.
 */
export function formatDate(dateStr, options = {}) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

/**
 * Format time (24h "HH:mm") to 12h display.
 */
export function formatTime(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Slugify a string for URLs.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse page/limit from URL search params with defaults.
 */
export function parsePagination(searchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '20', 10))
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Build a paginated response object.
 */
export function paginatedResponse(data, total, page, limit) {
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Standardized error response helper.
 */
export function errorResponse(code, message, status = 400, details = []) {
  return Response.json(
    { error: { code, message, details } },
    { status }
  );
}

/**
 * Success response helper.
 */
export function successResponse(data, status = 200) {
  return Response.json({ data }, { status });
}

/**
 * Strip HTML tags from a string (for excerpt generation).
 */
export function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '') || '';
}
