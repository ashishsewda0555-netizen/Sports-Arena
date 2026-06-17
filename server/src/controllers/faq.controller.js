import Faq from '../models/Faq.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

/**
 * GET /api/v1/public/faqs — List active FAQs
 *
 * Supports:
 *   ?category=<category>  — filter by category
 *   ?featured=true        — only featured FAQs (for Homepage preview)
 *
 * When NO category filter is given, returns FAQs grouped by category:
 *   { data: { general: [...], coaching: [...], ... } }
 *
 * When a category IS given, returns a flat array:
 *   { data: [...] }
 */
export async function listPublicFaqs(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;

    const faqs = await Faq.find(filter)
      .sort({ category: 1, displayOrder: 1 })
      .lean();

    // If no category filter, group by category for structured rendering
    if (!req.query.category) {
      const grouped = {};
      for (const faq of faqs) {
        if (!grouped[faq.category]) {
          grouped[faq.category] = [];
        }
        grouped[faq.category].push(faq);
      }
      return res.json({ data: grouped });
    }

    res.json({ data: faqs });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/faqs — List all FAQs (paginated)
 */
export async function listAdminFaqs(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const [faqs, total] = await Promise.all([
      Faq.find(filter)
        .sort({ category: 1, displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Faq.countDocuments(filter),
    ]);

    res.json(paginatedResponse(faqs, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/faqs — Create an FAQ
 */
export async function createFaq(req, res, next) {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ data: faq.toObject() });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/faqs/:id — Update an FAQ
 */
export async function updateFaq(req, res, next) {
  try {
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }

    res.json({ data: faq });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/faqs/:id — Delete an FAQ
 */
export async function deleteFaq(req, res, next) {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      throw ApiError.notFound('FAQ not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/faqs/reorder — Bulk update displayOrder
 */
export async function reorderFaqs(req, res, next) {
  try {
    const { items } = req.body;

    const bulkOps = items.map(({ id, displayOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder } },
      },
    }));

    await Faq.bulkWrite(bulkOps);
    res.json({ data: { message: 'Reorder successful' } });
  } catch (error) {
    next(error);
  }
}
