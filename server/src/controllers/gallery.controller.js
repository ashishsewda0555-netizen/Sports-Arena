import GalleryImage from '../models/GalleryImage.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

/**
 * GET /api/v1/public/gallery — List active images with optional category filter
 */
export async function listPublicGallery(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    const [images, total] = await Promise.all([
      GalleryImage.find(filter)
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      GalleryImage.countDocuments(filter),
    ]);

    res.json(paginatedResponse(images, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/public/gallery/featured — List featured images
 */
export async function listFeaturedGallery(_req, res, next) {
  try {
    const images = await GalleryImage.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ displayOrder: 1 })
      .lean();

    res.json({ data: images });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/gallery — List all images (paginated, with filters)
 */
export async function listAdminGallery(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const [images, total] = await Promise.all([
      GalleryImage.find(filter)
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limit)
        .populate('uploadedBy', 'name email')
        .lean(),
      GalleryImage.countDocuments(filter),
    ]);

    res.json(paginatedResponse(images, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/gallery — Upload a new image (multipart/form-data)
 */
export async function createGalleryImage(req, res, next) {
  try {
    if (!req.file) {
      throw ApiError.badRequest('Image file is required');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw ApiError.badRequest(
        'Invalid file type. Allowed: JPEG, PNG, WebP'
      );
    }

    // Upload to Cloudinary
    const { imageUrl, thumbnailUrl, width, height, publicId } =
      await uploadImage(req.file.buffer);

    // Parse metadata from form fields
    const metadata = {
      title: req.body.title || '',
      altText: req.body.altText,
      category: req.body.category,
      imageUrl,
      thumbnailUrl,
      width,
      height,
      publicId,
      relatedEventId: req.body.relatedEventId || null,
      displayOrder: parseInt(req.body.displayOrder || '0', 10),
      isFeatured: req.body.isFeatured === 'true',
      isActive: req.body.isActive !== 'false',
      uploadedBy: req.user._id,
    };

    const image = await GalleryImage.create(metadata);
    res.status(201).json({ data: image.toObject() });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/gallery/:id — Update image metadata
 */
export async function updateGalleryImage(req, res, next) {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!image) {
      throw ApiError.notFound('Image not found');
    }

    res.json({ data: image });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/gallery/:id — Delete image (Cloudinary + DB)
 */
export async function deleteGalleryImage(req, res, next) {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      throw ApiError.notFound('Image not found');
    }

    // Delete from Cloudinary
    if (image.publicId) {
      await deleteImage(image.publicId);
    }

    await GalleryImage.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/gallery/reorder — Bulk update displayOrder
 */
export async function reorderGallery(req, res, next) {
  try {
    const { items } = req.body;

    const bulkOps = items.map(({ id, displayOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder } },
      },
    }));

    await GalleryImage.bulkWrite(bulkOps);
    res.json({ data: { message: 'Reorder successful' } });
  } catch (error) {
    next(error);
  }
}
