import PricingPlan from '../models/PricingPlan.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

/**
 * GET /api/v1/public/pricing — List active pricing plans
 */
export async function listPublicPricing(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    const plans = await PricingPlan.find(filter)
      .sort({ displayOrder: 1 })
      .populate('sportId', 'name slug')
      .lean();

    res.json({ data: plans });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/pricing — List all pricing plans
 */
export async function listAdminPricing(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const [plans, total] = await Promise.all([
      PricingPlan.find(filter)
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .populate('sportId', 'name slug')
        .lean(),
      PricingPlan.countDocuments(filter),
    ]);

    res.json(paginatedResponse(plans, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/pricing — Create a pricing plan
 */
export async function createPricing(req, res, next) {
  try {
    const plan = await PricingPlan.create(req.body);
    const populated = await PricingPlan.findById(plan._id)
      .populate('sportId', 'name slug')
      .lean();

    res.status(201).json({ data: populated });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/pricing/:id — Update a pricing plan
 */
export async function updatePricing(req, res, next) {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('sportId', 'name slug')
      .lean();

    if (!plan) {
      throw ApiError.notFound('Pricing plan not found');
    }

    res.json({ data: plan });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/pricing/:id — Delete a pricing plan
 */
export async function deletePricing(req, res, next) {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      throw ApiError.notFound('Pricing plan not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/pricing/reorder — Bulk update displayOrder
 */
export async function reorderPricing(req, res, next) {
  try {
    const { items } = req.body;

    const bulkOps = items.map(({ id, displayOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder } },
      },
    }));

    await PricingPlan.bulkWrite(bulkOps);
    res.json({ data: { message: 'Reorder successful' } });
  } catch (error) {
    next(error);
  }
}
