/**
 * Optimizes a Cloudinary URL by inserting transformation parameters.
 * @param {string} url - The original Cloudinary URL
 * @param {Object} options - Optimization options
 * @param {number} [options.width] - Desired width
 * @param {number} [options.height] - Desired height
 * @param {string} [options.crop] - Crop mode (default: 'fill')
 * @param {string} [options.quality] - Quality setting (default: 'auto')
 * @returns {string} - The optimized URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== "string") return url;

  // Only transform Cloudinary URLs
  if (!url.includes("cloudinary.com")) return url;

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  // Find the /upload/ part of the URL
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + 8);
  const suffix = url.substring(uploadIndex + 8);

  // Build transformation string
  let transformation = `f_${format},q_${quality}`;
  
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  if (width || height) transformation += `,c_${crop}`;

  return `${prefix}${transformation}/${suffix}`;
};

/**
 * Gets the correct image URL, handling local assets and Cloudinary URLs.
 * @param {string} img - Image path or URL
 * @returns {string} - Resolved image URL
 */
export const getImageUrl = (img) => {
  if (!img) return "https://via.placeholder.com/300";
  if (img.startsWith("http")) return img;
  
  const apiUrl = import.meta.env.VITE_API_URL || "";
  return `${apiUrl}${img}`;
};
