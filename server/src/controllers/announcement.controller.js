import Announcement from '../models/Announcement.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

/**
 * GET /api/v1/public/announcements/active — Currently active announcements
 */
export async function listActiveAnnouncements(_req, res, next) {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ startDate: -1 })
      .lean();

    res.json({ data: announcements });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/announcements — List all announcements
 */
export async function listAdminAnnouncements(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [announcements, total] = await Promise.all([
      Announcement.find()
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Announcement.countDocuments(),
    ]);

    res.json(paginatedResponse(announcements, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/announcements — Create an announcement
 */
export async function createAnnouncement(req, res, next) {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ data: announcement.toObject() });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/announcements/:id — Update an announcement
 */
export async function updateAnnouncement(req, res, next) {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }

    res.json({ data: announcement });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/announcements/:id — Delete an announcement
 */
export async function deleteAnnouncement(req, res, next) {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      throw ApiError.notFound('Announcement not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
