import Video from '../models/Video.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

/**
 * GET /api/v1/public/videos — List active videos with placement filter
 */
export async function listPublicVideos(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.placement) filter.placement = req.query.placement;

    const videos = await Video.find(filter)
      .sort({ displayOrder: 1 })
      .lean();

    res.json({ data: videos });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/videos — List all videos
 */
export async function listAdminVideos(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [videos, total] = await Promise.all([
      Video.find()
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Video.countDocuments(),
    ]);

    res.json(paginatedResponse(videos, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/videos — Create a video entry
 */
export async function createVideo(req, res, next) {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ data: video.toObject() });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/videos/:id — Update a video entry
 */
export async function updateVideo(req, res, next) {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!video) {
      throw ApiError.notFound('Video not found');
    }

    res.json({ data: video });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/videos/:id — Delete a video entry
 */
export async function deleteVideo(req, res, next) {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      throw ApiError.notFound('Video not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
