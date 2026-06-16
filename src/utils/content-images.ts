// src/utils/content-images.ts
//
// Helpers for handling inline base64 images embedded in post HTML content.
// Instead of persisting heavy base64 strings in the database (which bloats
// rows and slows down queries), each base64 <img> is uploaded to Cloudinary
// and its src is rewritten to the hosted secure URL before the content is
// saved.
import { cloudinaryService } from '@/config/claudinary';
import logger from './logger';

const BASE64_IMAGE_REGEX = /data:image\/[a-z]+;base64,/i;
const IMG_SRC_REGEX =
  /<img[^>]*\ssrc=["'](data:image\/([a-z]+);base64,[^"']+)["'][^>]*>/gi;
const IMG_SRC_URL_REGEX = /<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;

/** Default folder for post content images. */
const CONTENT_IMAGES_FOLDER = 'chosen-fintech/posts-images/content';

const isCloudinaryUrl = (url: string): boolean => url.includes('cloudinary.com');

const base64ToBuffer = (base64String: string): Buffer => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
};

/**
 * Uploads all base64 images found in HTML content to Cloudinary.
 * Replaces each base64 src with the uploaded Cloudinary URL.
 * Throws on any single upload failure — no partial results.
 */
export const uploadBase64ContentImages = async (
  html: string,
  folder: string = CONTENT_IMAGES_FOLDER,
): Promise<{ html: string; uploadedPublicIds: string[] }> => {
  if (!BASE64_IMAGE_REGEX.test(html)) {
    return { html, uploadedPublicIds: [] };
  }

  // Reset lastIndex after the test() call above
  IMG_SRC_REGEX.lastIndex = 0;
  const matches = [...html.matchAll(IMG_SRC_REGEX)];

  if (matches.length === 0) {
    return { html, uploadedPublicIds: [] };
  }

  const uploadedPublicIds: string[] = [];

  // Upload all images — fail fast on any single error
  const replacements = await Promise.all(
    matches.map(async (match) => {
      const fullImgTag = match[0]!;
      const base64Src = match[1]!;

      const result = await cloudinaryService.uploadImage(
        { buffer: base64ToBuffer(base64Src), mimetype: `image/${match[2]}` },
        { folder },
      );

      uploadedPublicIds.push(result.public_id);

      return {
        original: fullImgTag,
        replacement: fullImgTag.replace(base64Src, result.secure_url),
      };
    }),
  );

  let modifiedHtml = html;
  for (const { original, replacement } of replacements) {
    modifiedHtml = modifiedHtml.replace(original, replacement);
  }
  return { html: modifiedHtml, uploadedPublicIds };
};

/**
 * Extracts all Cloudinary URLs from <img src="..."> tags in the HTML content.
 */
export const extractCloudinaryUrlsFromContent = (html: string): string[] => {
  IMG_SRC_URL_REGEX.lastIndex = 0;
  const matches = [...html.matchAll(IMG_SRC_URL_REGEX)];
  return matches.map((match) => match[1]!).filter((src) => isCloudinaryUrl(src));
};

/**
 * Compares old and new content HTML, deletes any Cloudinary image
 * that was present in the old content but is absent in the new content.
 */
export const deleteOrphanedContentImages = async (
  oldHtml: string,
  newHtml: string,
): Promise<void> => {
  const oldUrls = extractCloudinaryUrlsFromContent(oldHtml);

  if (oldUrls.length === 0) return;

  const newUrls = new Set(extractCloudinaryUrlsFromContent(newHtml));
  const orphaned = oldUrls.filter((url) => !newUrls.has(url));

  if (orphaned.length === 0) return;

  await Promise.all(
    orphaned.map(async (url) => {
      try {
        await cloudinaryService.deleteImage(url);
        logger.info(`Deleted orphaned content image: ${url}`);
      } catch (error) {
        // Orphan cleanup is best-effort — log and continue
        logger.warn(error, `Failed to delete orphaned content image: ${url}`);
      }
    }),
  );
};

/**
 * Deletes a list of Cloudinary images by public ID.
 * Used for rollback when a post save fails after content images were uploaded.
 */
export const deleteUploadedContentImages = async (
  publicIds: string[],
): Promise<void> => {
  if (publicIds.length === 0) return;

  await Promise.all(
    publicIds.map(async (publicId) => {
      try {
        await cloudinaryService.deleteImage(publicId);
        logger.info(`Rolled back content image: ${publicId}`);
      } catch (error) {
        logger.warn(error, `Failed to roll back content image: ${publicId}`);
      }
    }),
  );
};
