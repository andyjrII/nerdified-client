/**
 * Custom Next.js image loader.
 * - Cloudinary URLs: return a Cloudinary URL with transformations so the browser
 *   loads directly from Cloudinary (avoids Next.js proxy and 500s on first load).
 * - Other URLs: use default Next.js image optimization (/_next/image?url=...).
 */
const CLOUDINARY_HOST = 'res.cloudinary.com';

function isCloudinaryUrl(src) {
  if (typeof src !== 'string') return false;
  try {
    const url = new URL(src, 'https://example.com');
    return url.hostname === CLOUDINARY_HOST;
  } catch {
    return false;
  }
}

/**
 * Inject Cloudinary transformation params into the path so we get a resized
 * image from Cloudinary without going through Next.js image API.
 * Format: .../upload/TRANSFORMATIONS/rest-of-path
 */
function cloudinaryUrlWithTransform(src, width, quality) {
  const q = quality != null ? Math.min(100, Math.max(1, Math.round(quality))) : 'auto';
  const transforms = `w_${width},h_${width},c_fill,q_${q}`;
  // Cloudinary URL: https://res.cloudinary.com/cloud/image/upload/v123/folder/file.jpg
  // We need: .../upload/w_48,h_48,c_fill,q_75/v123/folder/file.jpg
  const uploadIdx = src.indexOf('/upload/');
  if (uploadIdx === -1) return src;
  const afterUpload = src.slice(uploadIdx + 8); // after '/upload/'
  const base = src.slice(0, uploadIdx + 8);
  return `${base}${transforms}/${afterUpload}`;
}

/**
 * True if src is a local path (e.g. /images/logo.png) served from public/.
 */
function isLocalPath(src) {
  return typeof src === 'string' && src.startsWith('/') && !src.startsWith('//');
}

module.exports = function cloudinaryLoader({ src, width, quality }) {
  if (isCloudinaryUrl(src)) {
    return cloudinaryUrlWithTransform(src, width, quality);
  }
  // Local paths: serve directly from public/ so the image optimizer isn't used
  // (/_next/image with url=/images/... often 404s with custom loaders)
  if (isLocalPath(src)) {
    return src;
  }
  // Remote (non-Cloudinary) images: use Next.js image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
};
