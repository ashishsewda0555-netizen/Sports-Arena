import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary.
 * Returns { imageUrl, thumbnailUrl, width, height } for storing in the DB.
 */
export async function uploadImage(buffer, options = {}) {
  const {
    folder = 'sports-arena/gallery',
    transformation = [],
  } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto:good',
        transformation: [
          { width: 1920, crop: 'limit' }, // Max width 1920px
          ...transformation,
        ],
      },
      (error, result) => {
        if (error) return reject(error);

        // Generate thumbnail URL using Cloudinary URL transformations
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
