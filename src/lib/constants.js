/**
 * Application-wide constants and enum definitions.
 * All enum values match the MongoDB schema exactly.
 */

// ── Sport Categories ───────────────────────────────────────────────────────
export const SPORT_CATEGORIES = {
  RACQUET: 'racquet',
  INDOOR_TABLE: 'indoor-table',
  MIND_SPORT: 'mind-sport',
  FITNESS: 'fitness',
};

// ── CTA Types (per sport) ──────────────────────────────────────────────────
export const CTA_TYPES = {
  COACHING_ENQUIRY: 'coaching-enquiry',
  CASUAL_PLAY: 'casual-play',
  FITNESS_ENQUIRY: 'fitness-enquiry',
};

// ── Gallery Categories ─────────────────────────────────────────────────────
export const GALLERY_CATEGORIES = [
  { value: 'courts', label: 'Courts' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'tournaments', label: 'Tournaments' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'fitness-area', label: 'Fitness Area' },
  { value: 'happy-customers', label: 'Happy Customers' },
  { value: 'arena-infrastructure', label: 'Arena Infrastructure' },
];

// ── Pricing Categories ─────────────────────────────────────────────────────
export const PRICING_CATEGORIES = [
  { value: 'coaching', label: 'Coaching Plans' },
  { value: 'casual-play', label: 'Casual Play' },
  { value: 'fitness-zone', label: 'Fitness Zone' },
];

// ── Billing Periods ────────────────────────────────────────────────────────
export const BILLING_PERIODS = [
  { value: 'per-session', label: 'Per Session' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'one-time', label: 'One Time' },
];

// ── FAQ Categories ─────────────────────────────────────────────────────────
export const FAQ_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'events', label: 'Events' },
  { value: 'timings', label: 'Timings' },
  { value: 'fitness-area', label: 'Fitness Area' },
  { value: 'visitors', label: 'Visitors' },
  { value: 'parents', label: 'Parents' },
];

// ── Event Statuses ─────────────────────────────────────────────────────────
export const EVENT_STATUSES = {
  UPCOMING: 'upcoming',
  PAST: 'past',
};

// ── Lead Statuses ──────────────────────────────────────────────────────────
export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

// ── User Roles ─────────────────────────────────────────────────────────────
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
};

// ── Announcement Types ─────────────────────────────────────────────────────
export const ANNOUNCEMENT_TYPES = [
  { value: 'info', label: 'Information' },
  { value: 'warning', label: 'Warning' },
];

// ── Batch Levels ───────────────────────────────────────────────────────────
export const BATCH_LEVELS = [
  { value: 'junior', label: 'Junior' },
  { value: 'senior', label: 'Senior' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'tournament-prep', label: 'Tournament Prep' },
];

// ── Days of Week ───────────────────────────────────────────────────────────
export const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

// ── Sport Seed Data (the 7 fixed activities) ───────────────────────────────
export const SPORTS_SEED = [
  {
    name: 'Badminton',
    slug: 'badminton',
    category: 'racquet',
    ctaType: 'coaching-enquiry',
    iconKey: 'shuttlecock',
    displayOrder: 1,
  },
  {
    name: 'Table Tennis',
    slug: 'table-tennis',
    category: 'racquet',
    ctaType: 'coaching-enquiry',
    iconKey: 'paddle',
    displayOrder: 2,
  },
  {
    name: 'Snooker',
    slug: 'snooker',
    category: 'indoor-table',
    ctaType: 'casual-play',
    iconKey: 'cue-ball',
    displayOrder: 3,
  },
  {
    name: 'Carrom',
    slug: 'carrom',
    category: 'indoor-table',
    ctaType: 'casual-play',
    iconKey: 'carrom-board',
    displayOrder: 4,
  },
  {
    name: 'Chess',
    slug: 'chess',
    category: 'mind-sport',
    ctaType: 'casual-play',
    iconKey: 'chess-knight',
    displayOrder: 5,
  },
  {
    name: 'Ludo',
    slug: 'ludo',
    category: 'mind-sport',
    ctaType: 'casual-play',
    iconKey: 'dice',
    displayOrder: 6,
  },
  {
    name: 'Fitness & Strength Zone',
    slug: 'fitness-strength-zone',
    category: 'fitness',
    ctaType: 'fitness-enquiry',
    iconKey: 'dumbbell',
    displayOrder: 7,
  },
];

// ── Navigation Links ───────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    href: '/sports',
    label: 'Sports',
    children: SPORTS_SEED.map(s => ({
      href: `/sports/${s.slug}`,
      label: s.name,
    })),
  },
  { href: '/coaching', label: 'Coaching' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/events', label: 'Events' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

// ── Admin Sidebar Links ────────────────────────────────────────────────────
export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/gallery', label: 'Gallery', icon: 'Image' },
  { href: '/admin/pricing', label: 'Pricing', icon: 'DollarSign' },
  { href: '/admin/coaches', label: 'Coaches', icon: 'Users' },
  { href: '/admin/sports', label: 'Sports', icon: 'Trophy' },
  { href: '/admin/faqs', label: 'FAQs', icon: 'HelpCircle' },
  { href: '/admin/events', label: 'Events', icon: 'Calendar' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'MessageSquare' },
  { href: '/admin/announcements', label: 'Announcements', icon: 'Megaphone' },
  { href: '/admin/contact-info', label: 'Contact Info', icon: 'Phone' },
  { href: '/admin/operating-hours', label: 'Operating Hours', icon: 'Clock' },
  { href: '/admin/social-media', label: 'Social Media', icon: 'Share2' },
  { href: '/admin/leads', label: 'Leads Inbox', icon: 'Inbox' },
  { href: '/admin/users', label: 'Users', icon: 'UserCog' },
];
