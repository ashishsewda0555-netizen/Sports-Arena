import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * Upload an image buffer to Cloudinary.
 * Returns { imageUrl, thumbnailUrl, width, height, publicId }.
 */
export async function uploadImage(buffer, options = {}) {
  // Guard: ensure Cloudinary is configured before attempting upload
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    throw new Error(
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env'
    );
  }

  const { folder = 'sports-arena/gallery', transformation = [] } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto:good',
        transformation: [{ width: 1920, crop: 'limit' }, ...transformation],
      },
      (error, result) => {
        if (error) return reject(error);

        const thumbnailUrl = cloudinary.url(result.public_id, {
          width: 400,
          height: 300,
          crop: 'fill',
          quality: 'auto:low',
          format: 'webp',
        });

        resolve({
          imageUrl: result.secure_url,
          thumbnailUrl,
          width: result.width,
          height: result.height,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public ID.
 */
export async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
}

export default cloudinary;
