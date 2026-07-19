/**
 * Database Seed Script
 *
 * Seeds the database with initial data:
 *  - Admin user
 *  - 7 sports
 *  - Default singleton documents (contactInfo, operatingHours, socialLinks, siteStatistics, aboutContent, facilitiesContent)
 *  - Sample data (coaches, testimonials, FAQs, pricing plans, events)
 *
 * Run: node --experimental-modules src/lib/db/seed.js
 * Or via: npm run seed (after adding the script to package.json)
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from project root
dotenv.config({ path: resolve(__dirname, '../../../.env.local') });

// Import all models
import User from '../models/User.js';
import Sport from '../models/Sport.js';
import Coach from '../models/Coach.js';
import PricingPlan from '../models/PricingPlan.js';
import Testimonial from '../models/Testimonial.js';
import Faq from '../models/Faq.js';
import Event from '../models/Event.js';
import ContactInfo from '../models/ContactInfo.js';
import OperatingHours from '../models/OperatingHours.js';
import SocialLinks from '../models/SocialLinks.js';
import SiteStatistics from '../models/SiteStatistics.js';
import AboutContent from '../models/AboutContent.js';
import FacilitiesContent from '../models/FacilitiesContent.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  console.log('🌱 Starting database seed...\n');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  // ── 1. Admin User ─────────────────────────────────────────────────────
  const existingAdmin = await User.findOne({ email: 'admin@academy.com' });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@academy.com',
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Admin user created (admin@academy.com / Admin@123)');
  } else {
    console.log('⏩ Admin user already exists');
  }

  // ── 2. Sports (7 fixed activities) ────────────────────────────────────
  const sportsData = [
    {
      name: 'Badminton',
      slug: 'badminton',
      category: 'racquet',
      ctaType: 'coaching-enquiry',
      iconKey: 'shuttlecock',
      displayOrder: 1,
      shortDescription: 'A fast-paced racquet sport suitable for all ages, from beginners to competitive players.',
      longDescription: '<p>Experience the thrill of badminton at our state-of-the-art facility featuring international-standard courts with wooden flooring and professional lighting. Whether you\'re a beginner looking to learn the basics or a competitive player preparing for tournaments, our structured coaching programs cater to every skill level.</p><p>Our national-level coaches provide personalized training, focusing on technique, footwork, strategy, and match play. Join our junior or senior batches and take your game to the next level.</p>',
      keyFeatures: ['4 wooden-flooring courts with international-standard lighting', 'Professional badminton nets and equipment', 'Air-conditioned playing area', 'Separate practice zones'],
      benefits: ['Improves cardiovascular fitness and agility', 'Develops hand-eye coordination', 'Structured skill progression from beginner to advanced', 'Tournament preparation with national-level coaches'],
    },
    {
      name: 'Table Tennis',
      slug: 'table-tennis',
      category: 'racquet',
      ctaType: 'coaching-enquiry',
      iconKey: 'paddle',
      displayOrder: 2,
      shortDescription: 'Sharpen your reflexes and enjoy fast-paced rallies on professional-grade tables.',
      longDescription: '<p>Our table tennis facility features tournament-grade tables in a well-lit, spacious environment. Perfect for both casual players looking for a fun workout and serious athletes training for competitions.</p>',
      keyFeatures: ['Professional tournament-grade tables', 'Dedicated practice area', 'Quality paddles and balls provided', 'Well-lit playing environment'],
      benefits: ['Enhances reflexes and mental alertness', 'Low-impact full-body workout', 'Social and competitive play options', 'Suitable for all age groups'],
    },
    {
      name: 'Snooker',
      slug: 'snooker',
      category: 'indoor-table',
      ctaType: 'casual-play',
      iconKey: 'cue-ball',
      displayOrder: 3,
      shortDescription: 'Enjoy a relaxed game of snooker on our premium full-size tables.',
      longDescription: '<p>Unwind with a game of snooker on our meticulously maintained full-size tables. Our snooker lounge offers a comfortable, professional atmosphere for players of all levels. Walk-in play is always welcome — no booking required.</p>',
      keyFeatures: ['Full-size professional snooker tables', 'Quality cues and accessories', 'Comfortable seating area', 'Relaxed lounge atmosphere'],
      benefits: ['Improves focus and strategic thinking', 'Great social activity for friends and colleagues', 'Relaxing stress-relief activity', 'No prior experience needed'],
    },
    {
      name: 'Carrom',
      slug: 'carrom',
      category: 'indoor-table',
      ctaType: 'casual-play',
      iconKey: 'carrom-board',
      displayOrder: 4,
      shortDescription: 'A classic indoor game perfect for families and friends — casual play welcome anytime.',
      longDescription: '<p>Relive the joy of this beloved indoor game on our quality carrom boards. Whether you\'re introducing your kids to the game or enjoying a competitive session with friends, our carrom area is always welcoming. Drop in anytime during operating hours.</p>',
      keyFeatures: ['Quality tournament-grade carrom boards', 'Comfortable seating arrangements', 'Family-friendly environment', 'No booking required'],
      benefits: ['Develops precision and fine motor skills', 'Perfect family bonding activity', 'Low-cost entertainment', 'Suitable for all ages'],
    },
    {
      name: 'Chess',
      slug: 'chess',
      category: 'mind-sport',
      ctaType: 'casual-play',
      iconKey: 'chess-knight',
      displayOrder: 5,
      shortDescription: 'Challenge your mind with chess — play casually or join our coaching sessions.',
      longDescription: '<p>Sharpen your strategic thinking at our dedicated chess zone. We provide quality chess sets and a quiet, focused environment for both casual games and competitive preparation. Coaching available for aspiring young players.</p>',
      keyFeatures: ['Quality chess sets and timer clocks', 'Quiet, focused playing environment', 'Coaching available for juniors', 'Regular friendly tournaments'],
      benefits: ['Enhances critical thinking and problem-solving', 'Builds patience and concentration', 'Competitive pathway for young players', 'Social and intellectual stimulation'],
    },
    {
      name: 'Ludo',
      slug: 'ludo',
      category: 'mind-sport',
      ctaType: 'casual-play',
      iconKey: 'dice',
      displayOrder: 6,
      shortDescription: 'A fun family favorite — perfect for a relaxed game session with friends and family.',
      longDescription: '<p>Bring back the fun of classic board gaming! Our Ludo zone is the perfect place for families and friends to enjoy a casual game together. A great way to unwind and bond over a beloved classic.</p>',
      keyFeatures: ['Quality Ludo boards and dice', 'Comfortable group seating', 'Family-friendly atmosphere', 'No booking required'],
      benefits: ['Fun for the whole family', 'Great icebreaker activity for groups', 'Relaxing and entertaining', 'Perfect for all ages'],
    },
    {
      name: 'Fitness & Strength Zone',
      slug: 'fitness-strength-zone',
      category: 'fitness',
      ctaType: 'fitness-enquiry',
      iconKey: 'dumbbell',
      displayOrder: 7,
      shortDescription: 'A fully equipped gym and strength training facility with expert trainers.',
      longDescription: '<p>Our Fitness & Strength Zone features a comprehensive range of modern equipment for cardio, strength training, and functional fitness. Expert trainers are available to guide your workout and help you achieve your fitness goals. Flexible memberships for working professionals.</p>',
      keyFeatures: ['Modern cardio and strength equipment', 'Certified personal trainers', 'Spacious and well-ventilated area', 'Flexible membership plans'],
      benefits: ['Complete fitness solution under one roof', 'Personalized training guidance', 'Convenient for working professionals', 'Combine sports and fitness in one visit'],
    },
  ];

  for (const sportData of sportsData) {
    await Sport.findOneAndUpdate(
      { slug: sportData.slug },
      sportData,
      { upsert: true, new: true }
    );
  }
  console.log('✅ 7 sports seeded\n');

  // Get sport IDs for references
  const sports = await Sport.find().lean();
  const sportMap = {};
  sports.forEach(s => { sportMap[s.slug] = s._id; });

  // ── 3. Singleton Documents ────────────────────────────────────────────
  await ContactInfo.findOneAndUpdate(
    {},
    {
      facilityName: process.env.NEXT_PUBLIC_BRAND_NAME || 'Sports Arena',
      addressLine1: '123 Sports Complex Road',
      addressLine2: 'Near City Stadium',
      city: process.env.NEXT_PUBLIC_BRAND_CITY || 'Sikar',
      state: 'Rajasthan',
      postalCode: '302001',
      country: 'India',
      latitude: 26.9124,
      longitude: 75.7873,
      phonePrimary: '+919876543210',
      whatsappNumber: '919876543210',
      email: 'info@sportsarena.com',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
      notificationEmail: 'admin@sportsarena.com',
    },
    { upsert: true }
  );
  console.log('✅ ContactInfo seeded');

  await OperatingHours.findOneAndUpdate(
    {},
    {
      schedule: [
        { day: 'monday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'thursday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'friday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'saturday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
        { day: 'sunday', isOpen: true, openTime: '07:00', closeTime: '21:00' },
      ],
      specialNotes: 'Fitness Zone closes 30 minutes earlier on Sundays.',
      timezone: 'Asia/Kolkata',
    },
    { upsert: true }
  );
  console.log('✅ OperatingHours seeded');

  await SocialLinks.findOneAndUpdate(
    {},
    {
      instagramUrl: 'https://instagram.com/sportsarena',
      facebookUrl: 'https://facebook.com/sportsarena',
      youtubeUrl: 'https://youtube.com/@sportsarena',
      googleBusinessProfileUrl: 'https://g.page/sportsarena',
    },
    { upsert: true }
  );
  console.log('✅ SocialLinks seeded');

  await SiteStatistics.findOneAndUpdate(
    {},
    {
      yearsOfExperience: 8,
      studentsTrained: 500,
      tournamentsHosted: 25,
      coachesOnStaff: 6,
      courtsAndTables: 12,
    },
    { upsert: true }
  );
  console.log('✅ SiteStatistics seeded');

  await AboutContent.findOneAndUpdate(
    {},
    {
      storyContent: '<p>Founded with a passion for sports and community wellness, Sports Arena has grown from a single badminton court to a premier multi-sport facility serving thousands of athletes and families. Our journey began with a simple mission: to make professional-quality sports training accessible to everyone in our city.</p><p>Over the years, we\'ve expanded to include seven diverse activities under one roof, assembled a team of national-level coaches, and hosted numerous tournaments that have put our academy on the map.</p>',
      missionContent: 'To provide world-class sports facilities and professional coaching that empowers individuals of all ages to discover, develop, and excel in their chosen sport.',
      visionContent: 'To be the most trusted and preferred multi-sport academy in the region, nurturing champions and promoting an active, healthy lifestyle for our community.',
      infrastructureItems: [
        { icon: 'maximize', title: 'Total Area', value: '15,000+ sq ft', description: 'Spacious facility with dedicated zones for each sport' },
        { icon: 'layout', title: 'Courts & Tables', value: '12+', description: 'Professional-grade courts, tables, and equipment' },
        { icon: 'shield', title: 'Safety First', value: '100%', description: 'Clean, well-maintained, and professionally supervised' },
      ],
    },
    { upsert: true }
  );
  console.log('✅ AboutContent seeded');

  await FacilitiesContent.findOneAndUpdate(
    {},
    {
      introContent: '<p>Our state-of-the-art facility is designed to provide the best sporting experience for athletes at every level. From professional-grade courts to modern fitness equipment, every detail has been carefully planned to support your sporting journey.</p>',
      sections: [
        {
          heading: 'Courts & Equipment',
          content: '<p>Our facility features professional-standard courts and equipment across all seven sports. Every court is designed with proper flooring, lighting, and ventilation to ensure optimal playing conditions.</p>',
          features: [
            '4 badminton courts with wooden flooring and international-standard lighting',
            'Tournament-grade table tennis tables',
            'Full-size snooker tables with quality accessories',
            'Quality carrom boards and chess sets',
            'Modern fitness equipment (cardio and strength)',
          ],
          displayOrder: 1,
        },
        {
          heading: 'Amenities',
          content: '<p>We\'ve thought of everything to make your visit comfortable and convenient.</p>',
          features: [
            'Ample parking space',
            'Comfortable seating and waiting areas for families',
            'Clean restrooms with changing facilities',
            'Drinking water stations throughout the facility',
            'Secure lockers for personal belongings',
          ],
          displayOrder: 2,
        },
      ],
      safetyContent: '<p>Your safety and wellbeing are our top priority. Our facility follows strict maintenance and hygiene protocols to ensure a clean, safe environment for all visitors.</p>',
      safetyFeatures: [
        'Regular professional cleaning and sanitization',
        'Well-maintained equipment inspected weekly',
        'First-aid facilities on-site',
        'CCTV surveillance in common areas',
        'Trained staff on duty at all times',
      ],
    },
    { upsert: true }
  );
  console.log('✅ FacilitiesContent seeded');

  // ── 4. Sample Coaches ─────────────────────────────────────────────────
  const existingCoaches = await Coach.countDocuments();
  if (existingCoaches === 0) {
    await Coach.create([
      {
        name: 'Rajesh Kumar',
        specializations: [sportMap['badminton']],
        title: 'National-Level Coach, Badminton',
        yearsOfExperience: 12,
        bioShort: 'Former national champion with 12 years of coaching experience specializing in competitive badminton training.',
        bioFull: '<p>Rajesh Kumar represented India at multiple national-level tournaments and has transitioned his competitive experience into coaching excellence. He specializes in developing young talent from beginner to tournament-ready levels.</p>',
        achievements: ['National Championship Winner 2014', 'Coached 5 state-level players', 'BWF Level 2 Certified'],
        certifications: ['BWF Level 2 Certified Coach', 'Sports Science Diploma'],
        batchLevels: ['junior', 'senior', 'advanced', 'tournament-prep'],
        displayOrder: 1,
        isActive: true,
      },
      {
        name: 'Priya Sharma',
        specializations: [sportMap['badminton'], sportMap['table-tennis']],
        title: 'Senior Coach, Racquet Sports',
        yearsOfExperience: 8,
        bioShort: 'Certified coach with expertise in both badminton and table tennis, focusing on junior development.',
        bioFull: '<p>Priya brings a unique dual-sport expertise to our academy, coaching both badminton and table tennis. Her patient and encouraging approach makes her especially popular with junior players.</p>',
        achievements: ['State-level Table Tennis Champion 2018', 'Trained 50+ junior players'],
        certifications: ['ITTF Coaching Certificate', 'Youth Sports Development Certification'],
        batchLevels: ['junior', 'beginner', 'intermediate'],
        displayOrder: 2,
        isActive: true,
      },
      {
        name: 'Vikram Singh',
        specializations: [sportMap['fitness-strength-zone']],
        title: 'Head Fitness Trainer',
        yearsOfExperience: 10,
        bioShort: 'Certified personal trainer specializing in strength training, functional fitness, and sports conditioning.',
        bioFull: '<p>Vikram is a certified fitness professional with a decade of experience in personal training and sports conditioning. He designs customized programs for athletes and fitness enthusiasts alike.</p>',
        achievements: ['Trained 200+ clients', 'Sports Conditioning Specialist'],
        certifications: ['ACE Certified Personal Trainer', 'Sports Nutrition Certification'],
        batchLevels: ['beginner', 'intermediate', 'advanced'],
        displayOrder: 3,
        isActive: true,
      },
    ]);
    console.log('✅ Sample coaches seeded');
  }

  // ── 5. Sample Testimonials ────────────────────────────────────────────
  const existingTestimonials = await Testimonial.countDocuments();
  if (existingTestimonials === 0) {
    await Testimonial.create([
      {
        customerName: 'Anita Gupta',
        role: 'Parent of Junior Badminton Student',
        rating: 5,
        quote: 'My daughter has been training here for 2 years and the improvement in her game has been phenomenal. The coaches are incredibly patient and professional. I feel completely comfortable leaving her here for training sessions.',
        relatedSportId: sportMap['badminton'],
        displayOrder: 1,
        isFeatured: true,
        isActive: true,
      },
      {
        customerName: 'Rahul Mehra',
        role: 'Working Professional',
        rating: 5,
        quote: 'The fitness zone is exactly what I needed — modern equipment, knowledgeable trainers, and convenient evening hours that fit my work schedule. The multi-sport facility is a bonus for weekends with family.',
        relatedSportId: sportMap['fitness-strength-zone'],
        displayOrder: 2,
        isFeatured: true,
        isActive: true,
      },
      {
        customerName: 'Sneha Patel',
        role: 'Competitive Table Tennis Player',
        rating: 5,
        quote: 'The coaching here is top-notch. I\'ve improved my national ranking significantly since joining. The tournament preparation program really sets this academy apart from others in the city.',
        relatedSportId: sportMap['table-tennis'],
        displayOrder: 3,
        isFeatured: true,
        isActive: true,
      },
      {
        customerName: 'The Sharma Family',
        role: 'Weekend Regulars',
        rating: 4,
        quote: 'We love coming here on weekends — dad plays snooker, the kids play badminton, and mom enjoys carrom. It\'s the only place in the city where the whole family can play different sports under one roof.',
        displayOrder: 4,
        isFeatured: true,
        isActive: true,
      },
    ]);
    console.log('✅ Sample testimonials seeded');
  }

  // ── 6. Sample Pricing Plans ───────────────────────────────────────────
  const existingPricing = await PricingPlan.countDocuments();
  if (existingPricing === 0) {
    await PricingPlan.create([
      {
        category: 'coaching',
        sportId: sportMap['badminton'],
        planName: 'Junior Badminton Coaching — Monthly',
        priceLabel: '₹2,500',
        priceNumeric: 2500,
        billingPeriod: 'monthly',
        inclusions: ['5 sessions per week', 'National-level coach', 'Equipment provided', 'Progress tracking'],
        isPopular: true,
        displayOrder: 1,
        isActive: true,
      },
      {
        category: 'coaching',
        sportId: sportMap['badminton'],
        planName: 'Senior Badminton Coaching — Monthly',
        priceLabel: '₹3,500',
        priceNumeric: 3500,
        billingPeriod: 'monthly',
        inclusions: ['5 sessions per week', 'Advanced training', 'Tournament preparation', 'Video analysis'],
        displayOrder: 2,
        isActive: true,
      },
      {
        category: 'coaching',
        sportId: sportMap['table-tennis'],
        planName: 'Table Tennis Coaching — Monthly',
        priceLabel: '₹2,000',
        priceNumeric: 2000,
        billingPeriod: 'monthly',
        inclusions: ['4 sessions per week', 'Certified coach', 'Equipment provided', 'Skill assessments'],
        displayOrder: 3,
        isActive: true,
      },
      {
        category: 'casual-play',
        planName: 'Badminton Court — Per Session',
        priceLabel: '₹200',
        priceNumeric: 200,
        billingPeriod: 'per-session',
        inclusions: ['1-hour court access', 'Racquets available on request', 'No booking required'],
        isPopular: true,
        displayOrder: 1,
        isActive: true,
      },
      {
        category: 'casual-play',
        planName: 'Snooker — Per Hour',
        priceLabel: '₹150',
        priceNumeric: 150,
        billingPeriod: 'per-session',
        inclusions: ['1-hour table access', 'Cues and accessories provided', 'Walk-in welcome'],
        displayOrder: 2,
        isActive: true,
      },
      {
        category: 'casual-play',
        planName: 'Indoor Games (Carrom/Chess/Ludo)',
        priceLabel: '₹50',
        priceNumeric: 50,
        billingPeriod: 'per-session',
        inclusions: ['Unlimited time per session', 'All equipment provided', 'Family-friendly'],
        displayOrder: 3,
        isActive: true,
      },
      {
        category: 'fitness-zone',
        planName: 'Fitness Zone — Monthly',
        priceLabel: '₹1,500',
        priceNumeric: 1500,
        billingPeriod: 'monthly',
        inclusions: ['Unlimited gym access', 'Trainer guidance', 'Cardio and strength equipment', 'Locker facility'],
        isPopular: true,
        displayOrder: 1,
        isActive: true,
      },
      {
        category: 'fitness-zone',
        planName: 'Fitness Zone — Quarterly',
        priceLabel: '₹3,800',
        priceNumeric: 3800,
        billingPeriod: 'quarterly',
        inclusions: ['Unlimited gym access', 'Personal training sessions', 'Nutrition guidance', 'Save 15% vs monthly'],
        displayOrder: 2,
        isActive: true,
      },
    ]);
    console.log('✅ Sample pricing plans seeded');
  }

  // ── 7. Sample FAQs ───────────────────────────────────────────────────
  const existingFaqs = await Faq.countDocuments();
  if (existingFaqs === 0) {
    const faqsData = [
      { category: 'general', question: 'What activities are available at Sports Arena?', answer: '<p>We offer seven activities: Badminton, Table Tennis, Snooker, Carrom, Chess, Ludo, and our Fitness & Strength Zone. Each activity has dedicated space and professional-grade equipment.</p>', displayOrder: 1, isFeatured: true },
      { category: 'general', question: 'Do I need to book in advance to play?', answer: '<p>No advance booking is required for most activities. Simply walk in during our operating hours. For coaching sessions, we recommend contacting us to confirm batch timings and availability.</p>', displayOrder: 2, isFeatured: true },
      { category: 'general', question: 'What are your operating hours?', answer: '<p>We are open from 6:00 AM to 10:00 PM, Monday to Saturday. Sunday hours are 7:00 AM to 9:00 PM. Check our Contact page for the most up-to-date schedule.</p>', displayOrder: 3 },
      { category: 'coaching', question: 'What qualifications do your coaches have?', answer: '<p>Our coaches are national-level players and certified professionals with extensive experience. Each coach profile on our Coaching page lists their certifications, achievements, and years of experience.</p>', displayOrder: 1, isFeatured: true },
      { category: 'coaching', question: 'Can I take a free trial session before enrolling?', answer: '<p>Yes! We offer a complimentary trial session so you can experience our coaching quality firsthand. Contact us via WhatsApp or phone to schedule your free trial.</p>', displayOrder: 2 },
      { category: 'coaching', question: 'What age groups do you offer coaching for?', answer: '<p>We have batches for juniors (6-15 years) and seniors (16+), with levels ranging from beginner to advanced and tournament preparation. Our coaches work with players of all ages.</p>', displayOrder: 3 },
      { category: 'pricing', question: 'Are the prices shown on the website final?', answer: '<p>Prices displayed are indicative starting rates. Actual pricing may vary based on the plan, duration, and any ongoing offers. Please contact us for the most current pricing and package deals.</p>', displayOrder: 1, isFeatured: true },
      { category: 'pricing', question: 'What payment methods do you accept?', answer: '<p>We accept cash, UPI, and bank transfers. All payments are handled at our facility — there are no online payment options at this time.</p>', displayOrder: 2 },
      { category: 'facilities', question: 'Is parking available?', answer: '<p>Yes, we have ample free parking space for both two-wheelers and cars right at our facility.</p>', displayOrder: 1 },
      { category: 'facilities', question: 'Do you provide sports equipment?', answer: '<p>Yes, we provide quality equipment for all activities including racquets, paddles, cues, and chess sets. However, serious players are welcome to bring their own equipment.</p>', displayOrder: 2 },
      { category: 'parents', question: 'Is the facility safe for children?', answer: '<p>Absolutely. Our facility has CCTV surveillance, trained staff on duty at all times, and first-aid facilities. Our coaches are experienced in working with children and ensure proper supervision during all sessions.</p>', displayOrder: 1, isFeatured: true },
      { category: 'parents', question: 'Is there a waiting area for parents?', answer: '<p>Yes, we have comfortable seating areas where parents can wait and watch their children during coaching sessions. Drinking water is available throughout the facility.</p>', displayOrder: 2 },
    ];

    await Faq.create(faqsData.map(f => ({ ...f, isActive: true })));
    console.log('✅ Sample FAQs seeded');
  }

  // ── 8. Sample Events ──────────────────────────────────────────────────
  const existingEvents = await Event.countDocuments();
  if (existingEvents === 0) {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);

    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 2);

    await Event.create([
      {
        title: 'Summer Badminton Championship 2026',
        description: '<p>Join us for our annual summer badminton championship! Categories include Under-14, Under-17, and Open. Cash prizes and trophies for winners. Registration open via phone or WhatsApp.</p>',
        eventDate: futureDate,
        status: 'upcoming',
        relatedSportIds: [sportMap['badminton']],
        isActive: true,
      },
      {
        title: 'Annual Table Tennis Tournament 2026',
        description: '<p>Compete in our table tennis tournament with singles and doubles categories. Open to players of all skill levels. Refreshments provided for all participants.</p>',
        eventDate: pastDate,
        status: 'past',
        relatedSportIds: [sportMap['table-tennis']],
        isActive: true,
      },
    ]);
    console.log('✅ Sample events seeded');
  }

  console.log('\n🎉 Database seeding complete!\n');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
