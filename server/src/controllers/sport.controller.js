import Sport from '../models/Sport.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

/**
 * GET /api/v1/public/sports — List all active sports
 */
export async function listPublicSports(_req, res, next) {
  try {
    const sports = await Sport.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .populate('featuredImageId')
      .lean();

    res.json({ data: sports });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/public/sports/:slug — Get sport by slug
 */
export async function getPublicSportBySlug(req, res, next) {
  try {
    const sport = await Sport.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate('featuredImageId')
      .populate('galleryImageIds')
      .lean();

    if (!sport) {
      throw ApiError.notFound('Sport not found');
    }

    res.json({ data: sport });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/sports — List all sports (active + inactive)
 */
export async function listAdminSports(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [sports, total] = await Promise.all([
      Sport.find()
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .populate('featuredImageId')
        .lean(),
      Sport.countDocuments(),
    ]);

    res.json(paginatedResponse(sports, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/sports/:id — Update a sport
 */
export async function updateSport(req, res, next) {
  try {
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('featuredImageId')
      .lean();

    if (!sport) {
      throw ApiError.notFound('Sport not found');
    }

    res.json({ data: sport });
  } catch (error) {
    next(error);
  }
}
