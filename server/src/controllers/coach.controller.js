import Coach from '../models/Coach.js';
import Sport from '../models/Sport.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';
import { uploadImage } from '../utils/cloudinary.js';

/**
 * GET /api/v1/public/coaches — List active coaches
 */
export async function listPublicCoaches(_req, res, next) {
  try {
    const coaches = await Coach.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .populate('specializations', 'name slug')
      .populate('photoId', 'imageUrl thumbnailUrl altText')
      .lean();

    res.json({ data: coaches });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/public/coaches/:id — Get full coach profile
 */
export async function getPublicCoach(req, res, next) {
  try {
    const coach = await Coach.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate('specializations', 'name slug')
      .populate('photoId', 'imageUrl thumbnailUrl altText')
      .lean();

    if (!coach) {
      throw ApiError.notFound('Coach not found');
    }

    res.json({ data: coach });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/coaches — List all coaches (paginated)
 */
export async function listAdminCoaches(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [coaches, total] = await Promise.all([
      Coach.find()
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .populate('specializations', 'name slug')
        .populate('photoId', 'imageUrl thumbnailUrl altText')
        .lean(),
      Coach.countDocuments(),
    ]);

    res.json(paginatedResponse(coaches, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * Resolve specialization values: accept either ObjectIds or sport names.
 * Returns an array of ObjectIds.
 */
async function resolveSpecializations(specializations) {
  if (!specializations || specializations.length === 0) return [];

  const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

  // If they already look like ObjectIds, return as-is
  if (specializations.every(isObjectId)) return specializations;

  const sports = await Sport.find({
    $or: specializations.map((n) => ({ name: new RegExp(`^${n}$`, 'i') }))
  }).lean();

  if (sports.length !== specializations.length) {
    const foundNames = sports.map((s) => s.name.toLowerCase());
    const notFound = specializations.filter((s) => !foundNames.includes(s.toLowerCase()));

    throw ApiError.badRequest(
      'No matching sports found for specializations. Please check sport names.',
      notFound.map((s) => ({ field: 'specializations', message: `Sport "${s}" not found` }))
    );
  }

  return sports.map((s) => s._id);
}

/**
 * POST /api/v1/admin/coaches — Create a new coach
 */
export async function createCoach(req, res, next) {
  try {
    if (req.file) {
      const { imageUrl } = await uploadImage(req.file.buffer);
      req.body.imageUrl = imageUrl;
    }

    const { specializations, ...rest } = req.body;
    const body = { 
      ...rest, 
      specializations: await resolveSpecializations(specializations) 
    };

    const coach = await Coach.create(body);
    const populated = await Coach.findById(coach._id)
      .populate('specializations', 'name slug')
      .populate('photoId', 'imageUrl thumbnailUrl altText')
      .lean();

    res.status(201).json({ data: populated });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/coaches/:id — Update a coach
 */
export async function updateCoach(req, res, next) {
  try {
    if (req.file) {
      const { imageUrl } = await uploadImage(req.file.buffer);
      req.body.imageUrl = imageUrl;
    }

    const { specializations, ...rest } = req.body;
    const body = { ...rest };
    if (specializations) {
      body.specializations = await resolveSpecializations(specializations);
    }

    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate('specializations', 'name slug')
      .populate('photoId', 'imageUrl thumbnailUrl altText')
      .lean();

    if (!coach) {
      throw ApiError.notFound('Coach not found');
    }

    res.json({ data: coach });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/coaches/:id — Delete a coach
 */
export async function deleteCoach(req, res, next) {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);
    if (!coach) {
      throw ApiError.notFound('Coach not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/coaches/reorder — Bulk update displayOrder
 */
export async function reorderCoaches(req, res, next) {
  try {
    const { items } = req.body;

    const bulkOps = items.map(({ id, displayOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder } },
      },
    }));

    await Coach.bulkWrite(bulkOps);

    res.json({ data: { message: 'Reorder successful' } });
  } catch (error) {
    next(error);
  }
}
