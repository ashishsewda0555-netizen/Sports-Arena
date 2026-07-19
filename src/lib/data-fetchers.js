import connectDB from './db/connect';
import Sport from './models/Sport';
import Coach from './models/Coach';
import PricingPlan from './models/PricingPlan';
import Testimonial from './models/Testimonial';
import Event from './models/Event';
import Faq from './models/Faq';
import GalleryImage from './models/GalleryImage';
import SiteStatistics from './models/SiteStatistics';
import FacilitiesContent from './models/FacilitiesContent';
import AboutContent from './models/AboutContent';
import Video from './models/Video';

// Helper to serialize Mongoose documents for Next.js Server Components
const serializeDoc = (doc) => JSON.parse(JSON.stringify(doc));

// Helper to safely execute database queries and catch connection errors
// This is critical for preventing Next.js static prerendering from crashing
// if the MongoDB connection is temporarily unavailable during the build process.
async function safeFetch(operation, fallbackValue, timeoutMs = 8000) {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Database query timed out after ${timeoutMs}ms`)), timeoutMs)
    );

    const execPromise = (async () => {
      await connectDB();
      const result = await operation();
      return serializeDoc(result);
    })();

    return await Promise.race([execPromise, timeoutPromise]);
  } catch (error) {
    console.warn(`[SafeFetch Warning]: Database query failed. Returning fallback value. Reason: ${error.message}`);
    return fallbackValue;
  }
}

export async function getSports() {
  return safeFetch(async () => {
    return await Sport.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
  }, []);
}

export async function getSportBySlug(slug) {
  return safeFetch(async () => {
    return await Sport.findOne({ slug, isActive: true }).populate('featuredImageId').populate('galleryImageIds').lean();
  }, null);
}

export async function getCoaches() {
  return safeFetch(async () => {
    return await Coach.find({ isActive: true }).sort({ displayOrder: 1 }).populate('specializations', 'name').lean();
  }, []);
}

export async function getPricingPlans() {
  return safeFetch(async () => {
    return await PricingPlan.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
  }, []);
}

export async function getTestimonials() {
  return safeFetch(async () => {
    return await Testimonial.find({ isActive: true }).sort({ displayOrder: 1 }).populate('photoId').lean();
  }, []);
}

export async function getEvents() {
  return safeFetch(async () => {
    return await Event.find({ status: { $in: ['upcoming', 'ongoing'] } }).sort({ startDate: 1 }).lean();
  }, []);
}

export async function getPastEvents() {
  return safeFetch(async () => {
    return await Event.find({ status: 'completed' }).sort({ endDate: -1 }).lean();
  }, []);
}

export async function getFaqs() {
  return safeFetch(async () => {
    return await Faq.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
  }, []);
}

export async function getGalleryImages(category = null) {
  return safeFetch(async () => {
    const query = { isActive: true };
    if (category) {
      query.category = category;
    }
    return await GalleryImage.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
  }, []);
}

export async function getSiteStatistics() {
  return safeFetch(async () => {
    return await SiteStatistics.findOne().lean();
  }, null);
}

export async function getFacilitiesContent() {
  return safeFetch(async () => {
    return await FacilitiesContent.findOne().lean();
  }, null);
}

export async function getAboutContent() {
  return safeFetch(async () => {
    return await AboutContent.findOne().populate('storyImageId').lean();
  }, null);
}

export async function getVideos(placement = null) {
  return safeFetch(async () => {
    const query = { isActive: true };
    if (placement) {
      query.placement = placement;
    }
    return await Video.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
  }, []);
}
