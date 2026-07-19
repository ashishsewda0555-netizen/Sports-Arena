import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import sportRoutes from './sport.routes.js';
import coachRoutes from './coach.routes.js';
import galleryRoutes from './gallery.routes.js';
import pricingRoutes from './pricing.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import faqRoutes from './faq.routes.js';
import eventRoutes from './event.routes.js';
import leadRoutes from './lead.routes.js';
import announcementRoutes from './announcement.routes.js';
import contactInfoRoutes from './contactInfo.routes.js';
import operatingHoursRoutes from './operatingHours.routes.js';
import socialLinksRoutes from './socialLinks.routes.js';


const router = Router();

// ── Auth ───────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── Resource routes (each file registers both /public/* and /admin/* paths) ─
router.use(userRoutes);
router.use(sportRoutes);
router.use(coachRoutes);
router.use(galleryRoutes);
router.use(pricingRoutes);
router.use(testimonialRoutes);
router.use(faqRoutes);
router.use(eventRoutes);
router.use(leadRoutes);
router.use(announcementRoutes);
router.use(contactInfoRoutes);
router.use(operatingHoursRoutes);
router.use(socialLinksRoutes);


export default router;
