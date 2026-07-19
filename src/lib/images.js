/**
 * Central image constants for Bharti Sports Arena
 * All Unsplash images are free for commercial use (Unsplash License).
 * Every URL has been verified to resolve (as of July 2026).
 * To swap any image, update its URL here — all pages update automatically.
 */

const UNS = 'https://images.unsplash.com/photo';

export const IMAGES = {
  // ── Hero & Arena ──────────────────────────────────────────────────────────
  hero: `${UNS}-1574629810360-7efbbe195018?w=1600&q=85&auto=format&fit=crop`,
  // Indoor sports arena / badminton wide shot
  arenaInterior: `${UNS}-1540747913346-19e32dc3e97e?w=1200&q=80&auto=format&fit=crop`,
  // Sports hall / gym arena
  arenaWide: `${UNS}-1517466787929-bc90951d0974?w=1200&q=80&auto=format&fit=crop`,

  // ── Sports ────────────────────────────────────────────────────────────────
  badminton: `${UNS}-1626224583764-f87db24ac4ea?w=800&q=80&auto=format&fit=crop`,
  // Badminton shuttlecock / action shot
  badmintonAction: `${UNS}-1521537634581-0dced2fee2ef?w=800&q=80&auto=format&fit=crop`,

  tableTennis: `${UNS}-1534158914592-062992fbe900?w=800&q=80&auto=format&fit=crop`,
  // Ping pong paddle close-up (verified working)
  tableTennisAction: `${UNS}-1599474924187-334a4ae5bd3c?w=800&q=80&auto=format&fit=crop`,

  snooker: '/images/sports/snooker.jpg',
  // Real snooker image (local asset)

  fitness: `${UNS}-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop`,
  // Modern gym with equipment (verified working)
  fitnessAction: `${UNS}-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop`,
  fitnessWeights: `${UNS}-1583454110551-21f2fa2afe61?w=800&q=80&auto=format&fit=crop`,

  chess: `${UNS}-1528819622765-d6bcf132f793?w=800&q=80&auto=format&fit=crop`,
  // Chess board with pieces (verified working)

  carrom: '/images/sports/carrom.jpg',
  // Real carrom board image (local asset)

  // ── Coaching ──────────────────────────────────────────────────────────────
  coaching: `${UNS}-1526232761682-d26e03ac148e?w=800&q=80&auto=format&fit=crop`,
  // Sports coaching / training session
  coachingKids: `${UNS}-1596464716127-f2a82984de30?w=800&q=80&auto=format&fit=crop`,
  coachingAdult: `${UNS}-1571008887538-b36bb32f4571?w=800&q=80&auto=format&fit=crop`,

  // ── Facilities ────────────────────────────────────────────────────────────
  facilityCourts: `${UNS}-1574629810360-7efbbe195018?w=1000&q=80&auto=format&fit=crop`,
  facilityAmenities: `${UNS}-1497366811353-6870744d04b2?w=1000&q=80&auto=format&fit=crop`,
  facilitySafety: `${UNS}-1557597774-9d273605dfa9?w=1000&q=80&auto=format&fit=crop`,

  // ── Events ────────────────────────────────────────────────────────────────
  tournament: `${UNS}-1526232761682-d26e03ac148e?w=800&q=80&auto=format&fit=crop`,
  event: `${UNS}-1580910365203-91ea9115a319?w=800&q=80&auto=format&fit=crop`,

  // ── Gallery Placeholders ──────────────────────────────────────────────────
  gallery1: `${UNS}-1626224583764-f87db24ac4ea?w=600&q=80&auto=format&fit=crop`,
  // Badminton
  gallery2: `${UNS}-1534158914592-062992fbe900?w=600&q=80&auto=format&fit=crop`,
  // Table Tennis
  gallery3: `${UNS}-1534438327276-14e5300c3a48?w=600&q=80&auto=format&fit=crop`,
  // Fitness
  gallery4: `${UNS}-1615213612138-4d1195b1c0e1?w=800&q=80&auto=format&fit=crop`,
  // Snooker
  gallery5: `${UNS}-1517466787929-bc90951d0974?w=600&q=80&auto=format&fit=crop`,
  // Arena overview
  gallery6: `${UNS}-1521537634581-0dced2fee2ef?w=600&q=80&auto=format&fit=crop`,
  // Badminton action

  // ── About / Story ─────────────────────────────────────────────────────────
  story: `${UNS}-1626224583764-f87db24ac4ea?w=900&q=80&auto=format&fit=crop`,
  // Indoor sports arena
  team: `${UNS}-1526232761682-d26e03ac148e?w=900&q=80&auto=format&fit=crop`,

  // ── Contact / Pricing Background ─────────────────────────────────────────
  contactBg: `${UNS}-1517466787929-bc90951d0974?w=1400&q=75&auto=format&fit=crop`,
};

/**
 * Maps sport slugs to their best representative Unsplash image.
 * Used as fallback when admin hasn't uploaded an image for a sport.
 */
export const SPORT_IMAGES = {
  badminton: IMAGES.badminton,
  'table-tennis': IMAGES.tableTennis,
  'table tennis': IMAGES.tableTennis,
  fitness: IMAGES.fitness,
  'fitness-zone': IMAGES.fitness,
  'fitness-strength-zone': IMAGES.fitness,
  'fitness & strength zone': IMAGES.fitness,
  snooker: IMAGES.snooker,
  chess: IMAGES.chess,
  'chess-strategy': IMAGES.chess,
  carrom: IMAGES.carrom,
  ludo: IMAGES.chess, // fallback — closest indoor game image
  'table-soccer': '/images/sports/table-soccer.jpg',
  default: IMAGES.arenaInterior,
};

/**
 * Returns the best image for a sport, preferring admin-uploaded images.
 */
export function getSportImage(sport) {
  if (sport?.featuredImageId?.url) return sport.featuredImageId.url;
  if (sport?.imageUrl) return sport.imageUrl;
  
  const slug = (sport?.slug || sport?.name || '').toLowerCase().replace(/\s+/g, '-');
  if (SPORT_IMAGES[slug] !== undefined) {
    return SPORT_IMAGES[slug];
  }
  if (SPORT_IMAGES[sport?.name?.toLowerCase()] !== undefined) {
    return SPORT_IMAGES[sport?.name?.toLowerCase()];
  }
  
  return SPORT_IMAGES.default;
}
