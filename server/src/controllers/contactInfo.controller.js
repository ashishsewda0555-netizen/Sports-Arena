import ContactInfo from '../models/ContactInfo.js';
import ApiError from '../utils/ApiError.js';

/**
 * GET /api/v1/public/contact-info — Get the contact info document
 */
export async function getPublicContactInfo(_req, res, next) {
  try {
    const info = await ContactInfo.findOne().lean();
    if (!info) {
      throw ApiError.notFound('Contact info not configured');
    }

    res.json({ data: info });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/contact-info — Update the singleton contact info
 */
export async function updateContactInfo(req, res, next) {
  try {
    const info = await ContactInfo.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, runValidators: true, upsert: true }
    ).lean();

    res.json({ data: info });
  } catch (error) {
    next(error);
  }
}
