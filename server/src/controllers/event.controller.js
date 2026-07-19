import Event from '../models/Event.js';
import GalleryImage from '../models/GalleryImage.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';
import { uploadImage } from '../utils/cloudinary.js';

/**
 * GET /api/v1/public/events — List active events with status filter
 *
 * Supports:
 *   ?status=upcoming  — List events where eventDate >= today (ascending)
 *   ?status=past      — List events where eventDate < today (descending)
 *   ?page=&limit=     — Pagination
 *
 * Events with status "upcoming" whose eventDate has passed are automatically
 * treated as "past" in the query (computed status).
 */
export async function listPublicEvents(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isActive: true };
    const now = new Date();

    if (req.query.status === 'upcoming') {
      // Upcoming: events in the future (by eventDate or status override)
      filter.$or = [
        { status: 'upcoming', eventDate: { $gte: now } },
      ];
    } else if (req.query.status === 'past') {
      // Past: explicitly marked past OR upcoming events whose date has passed
      filter.$or = [
        { status: 'past' },
        { eventDate: { $lt: now } },
      ];
    }

    // Upcoming: eventDate ascending; Past: eventDate descending
    const sortOrder =
      req.query.status === 'past'
        ? { eventDate: -1 }
        : { eventDate: 1 };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .populate('coverImageId', 'imageUrl thumbnailUrl altText')
        .populate('relatedSportIds', 'name slug')
        .lean(),
      Event.countDocuments(filter),
    ]);

    res.json(paginatedResponse(events, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/public/events/:id — Get event detail with related gallery images
 */
export async function getPublicEvent(req, res, next) {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate('coverImageId', 'imageUrl thumbnailUrl altText')
      .populate('relatedSportIds', 'name slug')
      .lean();

    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    // Get related gallery images for past event photo galleries
    const galleryImages = await GalleryImage.find({
      relatedEventId: event._id,
      isActive: true,
    })
      .sort({ displayOrder: 1 })
      .lean();

    res.json({ data: { ...event, galleryImages } });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/events — List all events (paginated)
 */
export async function listAdminEvents(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('coverImageId', 'imageUrl thumbnailUrl altText')
        .populate('relatedSportIds', 'name slug')
        .lean(),
      Event.countDocuments(filter),
    ]);

    res.json(paginatedResponse(events, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/events — Create an event
 */
export async function createEvent(req, res, next) {
  try {
    if (req.file) {
      const { imageUrl } = await uploadImage(req.file.buffer);
      req.body.imageUrl = imageUrl;
    }
    
    const event = await Event.create(req.body);
    const populated = await Event.findById(event._id)
      .populate('coverImageId', 'imageUrl thumbnailUrl altText')
      .populate('relatedSportIds', 'name slug')
      .lean();

    res.status(201).json({ data: populated });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/events/:id — Update an event
 */
export async function updateEvent(req, res, next) {
  try {
    if (req.file) {
      const { imageUrl } = await uploadImage(req.file.buffer);
      req.body.imageUrl = imageUrl;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('coverImageId', 'imageUrl thumbnailUrl altText')
      .populate('relatedSportIds', 'name slug')
      .lean();

    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    res.json({ data: event });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/events/:id — Delete an event
 */
export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/events/:id/archive — Set status to "past"
 */
export async function archiveEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'past' } },
      { new: true, runValidators: true }
    ).lean();

    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    res.json({ data: event });
  } catch (error) {
    next(error);
  }
}
