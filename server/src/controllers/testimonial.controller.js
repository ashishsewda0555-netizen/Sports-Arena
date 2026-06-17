import Testimonial from '../models/Testimonial.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

/**
 * GET /api/v1/public/testimonials — List active testimonials
 */
export async function listPublicTestimonials(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.featured === 'true') filter.isFeatured = true;
    if (req.query.sportId) filter.relatedSportId = req.query.sportId;

    const testimonials = await Testimonial.find(filter)
      .sort({ displayOrder: 1 })
      .populate('photoId', 'imageUrl thumbnailUrl altText')
      .populate('relatedSportId', 'name slug')
      .lean();

    res.json({ data: testimonials });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/testimonials — List all testimonials
 */
export async function listAdminTestimonials(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [testimonials, total] = await Promise.all([
      Testimonial.find()
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .populate('photoId', 'imageUrl thumbnailUrl altText')
        .populate('relatedSportId', 'name slug')
        .lean(),
      Testimonial.countDocuments(),
    ]);

    res.json(paginatedResponse(testimonials, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/testimonials — Create a testimonial
 */
export async function createTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ data: testimonial.toObject() });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/testimonials/:id — Update a testimonial
 */
export async function updateTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    res.json({ data: testimonial });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/testimonials/:id — Delete a testimonial
 */
export async function deleteTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/testimonials/reorder — Bulk update displayOrder
 */
export async function reorderTestimonials(req, res, next) {
  try {
    const { items } = req.body;

    const bulkOps = items.map(({ id, displayOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder } },
      },
    }));

    await Testimonial.bulkWrite(bulkOps);
    res.json({ data: { message: 'Reorder successful' } });
  } catch (error) {
    next(error);
  }
}
