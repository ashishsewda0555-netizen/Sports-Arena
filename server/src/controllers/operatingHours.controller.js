import OperatingHours from '../models/OperatingHours.js';
import ApiError from '../utils/ApiError.js';

/**
 * GET /api/v1/public/operating-hours — Get the operating hours document
 */
export async function getPublicOperatingHours(_req, res, next) {
  try {
    const hours = await OperatingHours.findOne().lean();
    if (!hours) {
      throw ApiError.notFound('Operating hours not configured');
    }

    res.json({ data: hours });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/operating-hours — Update the singleton operating hours
 */
export async function updateOperatingHours(req, res, next) {
  try {
    const hours = await OperatingHours.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, runValidators: true, upsert: true }
    ).lean();

    res.json({ data: hours });
  } catch (error) {
    next(error);
  }
}
