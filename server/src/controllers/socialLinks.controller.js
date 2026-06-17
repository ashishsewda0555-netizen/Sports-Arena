import SocialLinks from '../models/SocialLinks.js';
import ApiError from '../utils/ApiError.js';

/**
 * GET /api/v1/public/social-links — Get the social links document
 */
export async function getPublicSocialLinks(_req, res, next) {
  try {
    const links = await SocialLinks.findOne().lean();
    if (!links) {
      throw ApiError.notFound('Social links not configured');
    }

    res.json({ data: links });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/social-links — Update the singleton social links
 */
export async function updateSocialLinks(req, res, next) {
  try {
    const links = await SocialLinks.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, runValidators: true, upsert: true }
    ).lean();

    res.json({ data: links });
  } catch (error) {
    next(error);
  }
}
