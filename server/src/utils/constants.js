/**
 * Application-wide constants and enum definitions.
 * All enum values match the MongoDB schema exactly.
 */

// ── Sport Categories ───────────────────────────────────────────────────────
export const SPORT_CATEGORIES = ['racquet', 'indoor-table', 'mind-sport', 'fitness'];

// ── CTA Types (per sport) ──────────────────────────────────────────────────
export const CTA_TYPES = ['coaching-enquiry', 'casual-play', 'fitness-enquiry'];

// ── Gallery Categories ─────────────────────────────────────────────────────
export const GALLERY_CATEGORIES = [
  'courts',
  'coaching',
  'tournaments',
  'facilities',
  'fitness-area',
  'happy-customers',
  'arena-infrastructure',
];

// ── Pricing Categories ─────────────────────────────────────────────────────
export const PRICING_CATEGORIES = ['coaching', 'casual-play', 'fitness-zone'];

// ── Billing Periods ────────────────────────────────────────────────────────
export const BILLING_PERIODS = ['per-session', 'monthly', 'quarterly', 'one-time'];

// ── FAQ Categories ─────────────────────────────────────────────────────────
export const FAQ_CATEGORIES = [
  'general',
  'coaching',
  'facilities',
  'pricing',
  'equipment',
  'events',
  'timings',
  'fitness-area',
  'visitors',
  'parents',
];

// ── Event Statuses ─────────────────────────────────────────────────────────
export const EVENT_STATUSES = ['upcoming', 'past'];

// ── Lead Statuses ──────────────────────────────────────────────────────────
export const LEAD_STATUSES = ['new', 'contacted', 'closed'];

// ── Lead Sources ───────────────────────────────────────────────────────────
export const LEAD_SOURCES = ['contact-form', 'popup'];

// ── User Roles ─────────────────────────────────────────────────────────────
export const USER_ROLES = ['admin', 'editor'];

// ── Announcement Types ─────────────────────────────────────────────────────
export const ANNOUNCEMENT_TYPES = ['info', 'warning'];

// ── Video Placements ───────────────────────────────────────────────────────
export const VIDEO_PLACEMENTS = ['homepage-arena-tour', 'gallery', 'general'];

// ── Batch Levels (Coach) ───────────────────────────────────────────────────
export const BATCH_LEVELS = [
  'junior',
  'senior',
  'beginner',
  'intermediate',
  'advanced',
  'tournament-prep',
];

// ── Days of Week ───────────────────────────────────────────────────────────
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// ── Sports Seed Data (the 7 fixed activities) ──────────────────────────────
export const SPORTS_SEED = [
  {
    name: 'Badminton',
    slug: 'badminton',
    category: 'racquet',
    shortDescription: 'Fast-paced racquet sport played on professional-grade courts.',
    ctaType: 'coaching-enquiry',
    iconKey: 'shuttlecock',
    displayOrder: 1,
  },
  {
    name: 'Table Tennis',
    slug: 'table-tennis',
    category: 'racquet',
    shortDescription: 'Indoor table sport for all skill levels with professional tables.',
    ctaType: 'coaching-enquiry',
    iconKey: 'paddle',
    displayOrder: 2,
  },
  {
    name: 'Snooker',
    slug: 'snooker',
    category: 'indoor-table',
    shortDescription: 'Premium snooker tables in a dedicated lounge environment.',
    ctaType: 'casual-play',
    iconKey: 'cue-ball',
    displayOrder: 3,
  },
  {
    name: 'Carrom',
    slug: 'carrom',
    category: 'indoor-table',
    shortDescription: 'Classic indoor board game with tournament-standard boards.',
    ctaType: 'casual-play',
    iconKey: 'carrom-board',
    displayOrder: 4,
  },
  {
    name: 'Chess',
    slug: 'chess',
    category: 'mind-sport',
    shortDescription: 'Strategic mind sport with coaching and casual play sessions.',
    ctaType: 'casual-play',
    iconKey: 'chess-knight',
    displayOrder: 5,
  },
  {
    name: 'Ludo',
    slug: 'ludo',
    category: 'mind-sport',
    shortDescription: 'Fun family-friendly board game available for casual sessions.',
    ctaType: 'casual-play',
    iconKey: 'dice',
    displayOrder: 6,
  },
  {
    name: 'Fitness & Strength Zone',
    slug: 'fitness-strength-zone',
    category: 'fitness',
    shortDescription: 'Fully equipped fitness area with modern gym equipment.',
    ctaType: 'fitness-enquiry',
    iconKey: 'dumbbell',
    displayOrder: 7,
  },
];
