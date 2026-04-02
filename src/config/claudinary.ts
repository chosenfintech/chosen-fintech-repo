// src/config/claudinary.ts
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import logger from '../utils/logger';
import { ENV } from './env';
import { CustomError } from '@/middlewares/error-handler';
import { isValidBase64Image } from '../utils/validate-base64-image';
import {
  ICloudinaryUploadService,
  IUploadedFile,
  ICloudinaryConfig,
  ICloudinaryUploadOptions,
  ICloudinaryUploadResult,
  ICloudinaryDeletionResponse,
} from '../types/cloudinary.types';

const MAX_UPLOAD_RETRIES = 3;
const RETRY_DELAY_MS = 300;

const defaultCloudinaryConfig: ICloudinaryConfig = {
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
};

// Validate and configure cloudinary once
const validateAndConfigureCloudinary = (config: ICloudinaryConfig): void => {
  const requiredFields: (keyof ICloudinaryConfig)[] = [
    'cloud_name',
    'api_key',
    'api_secret',
  ];

  const missingFields = requiredFields.filter((field) => !config[field]);

  if (missingFields.length > 0) {
    throw new CustomError(
      400,
      `Missing required Cloudinary configuration: ${missingFields.join(', ')}`,
    );
  }

  cloudinary.config(config);
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - The Cloudinary URL
 * @param includeExtension - Whether to include the file extension in the public ID
 * @returns The extracted public ID
 */
export const extractPublicIdFromUrl = (
  url: string,
  includeExtension: boolean = false,
): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');

    // Find the delivery type index (upload or authenticated)
    const deliveryIndex = parts.findIndex(
      (part) => part === 'upload' || part === 'authenticated',
    );

    if (deliveryIndex === -1) {
      throw new Error(
        'Invalid Cloudinary URL: missing upload/authenticated segment',
      );
    }

    let startIndex = deliveryIndex + 1;

    // Skip version number if present (e.g., v1234567890)
    if (parts[startIndex] && /^v\d+$/.test(parts[startIndex]!)) {
      startIndex++;
    }

    // Get public ID parts
    const publicIdParts = parts.slice(startIndex);

    if (publicIdParts.length === 0) {
      throw new Error('Could not extract public_id from URL');
    }

    if (!includeExtension) {
      const lastPart = publicIdParts[publicIdParts.length - 1];
      if (lastPart) {
        publicIdParts[publicIdParts.length - 1] = lastPart.split('.')[0]!;
      }
    }

    return publicIdParts.join('/');
  } catch (error) {
    logger.error(error, `Failed to extract public ID from URL: ${url}`);
    throw error;
  }
};

const isRetryableError = (error: UploadApiErrorResponse | Error): boolean => {
  const msg = error.message || '';
  const httpCode =
    'http_code' in error && typeof error.http_code === 'number'
      ? error.http_code
      : null;

  return (
    httpCode === 429 ||
    (httpCode !== null && httpCode >= 500) ||
    msg.includes('timeout') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('ECONNRESET')
  );
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadToCloudinary = async (
  file: IUploadedFile | string,
  options: Partial<ICloudinaryUploadOptions> = {},
): Promise<ICloudinaryUploadResult> => {
  // Validate input
  if (typeof file === 'string') {
    if (!isValidBase64Image(file)) {
      throw new CustomError(400, 'Invalid Base64 image format');
    }
  } else if (!file?.buffer) {
    throw new CustomError(400, 'Invalid file: missing buffer');
  }

  const uploadOptions: ICloudinaryUploadOptions = {
    resource_type: 'auto',
    ...options,
  };

  let lastError: Error | UploadApiErrorResponse | null = null;

  for (let attempt = 1; attempt <= MAX_UPLOAD_RETRIES; attempt++) {
    try {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        if (typeof file === 'string') {
          // Base64 upload
          cloudinary.uploader.upload(
            file,
            uploadOptions,
            (error, uploadResult) => {
              if (error || !uploadResult) {
                reject(error || new Error('Upload failed'));
              } else {
                resolve(uploadResult);
              }
            },
          );
        } else {
          // Buffer upload
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, uploadResult) => {
              if (error || !uploadResult) {
                reject(error || new Error('Upload failed'));
              } else {
                resolve(uploadResult);
              }
            },
          );
          uploadStream.end(file.buffer);
        }
      });

      logger.debug(`File uploaded successfully: ${result.public_id}`);

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        asset_id: result.asset_id,
        format: result.format,
        resource_type: result.resource_type,
      };
    } catch (error) {
      lastError = error as Error | UploadApiErrorResponse;
      const errorMessage = lastError.message || 'Unknown error';

      // Check if error is retryable
      if (!isRetryableError(lastError)) {
        logger.error(`Non-retryable upload error: ${errorMessage}`);
        throw new CustomError(400, `Upload failed: ${errorMessage}`);
      }

      // If this was the last attempt, throw
      if (attempt === MAX_UPLOAD_RETRIES) {
        logger.error(
          `Upload failed after ${MAX_UPLOAD_RETRIES} attempts: ${errorMessage}`,
        );
        throw new CustomError(
          502,
          `Failed to upload after ${MAX_UPLOAD_RETRIES} retries`,
        );
      }

      // Retry with delay
      logger.warn(
        `Upload attempt ${attempt} failed: ${errorMessage}. Retrying in ${RETRY_DELAY_MS}ms...`,
      );
      await delay(RETRY_DELAY_MS);
    }
  }

  // This should never be reached due to the throw in the loop, but TypeScript needs it
  throw new CustomError(500, 'Unexpected error during upload');
};

const deleteFromCloudinary = async (
  identifier: string,
): Promise<ICloudinaryDeletionResponse> => {
  if (!identifier) {
    throw new CustomError(400, 'No identifier provided for deletion');
  }

  const publicId = identifier.includes('http')
    ? extractPublicIdFromUrl(identifier)
    : identifier;

  logger.debug(`Attempting to delete: ${publicId}`);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_UPLOAD_RETRIES; attempt++) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        type: 'upload',
      });

      if (result?.result === 'ok') {
        logger.info(`Successfully deleted: ${publicId}`);
        return result as ICloudinaryDeletionResponse;
      }

      throw new Error(`Deletion failed: ${JSON.stringify(result)}`);
    } catch (error) {
      lastError = error as Error;
      const errorMessage = lastError.message || 'Unknown error';

      if (attempt === MAX_UPLOAD_RETRIES) {
        logger.error(
          `Deletion failed after ${MAX_UPLOAD_RETRIES} attempts: ${errorMessage}`,
        );
        throw new CustomError(
          502,
          `Failed to delete after ${MAX_UPLOAD_RETRIES} retries`,
        );
      }

      logger.warn(
        `Deletion attempt ${attempt} failed: ${errorMessage}. Retrying...`,
      );
      await delay(RETRY_DELAY_MS);
    }
  }

  throw new CustomError(500, 'Unexpected error during deletion');
};

const uploadMultipleToCloudinary = async (
  files: (IUploadedFile | string)[],
  options: Partial<ICloudinaryUploadOptions> = {},
): Promise<ICloudinaryUploadResult[]> => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new CustomError(400, 'No valid files provided for upload');
  }

  try {
    return await Promise.all(
      files.map((file) => uploadToCloudinary(file, options)),
    );
  } catch (error) {
    logger.error(error, 'Error uploading multiple files');
    throw new CustomError(
      502,
      `Failed to upload multiple files: ${(error as Error).message}`,
    );
  }
};

class CloudinaryUploadService implements ICloudinaryUploadService {
  async uploadImage(
    image: string | IUploadedFile,
    options: Partial<ICloudinaryUploadOptions> = {},
  ): Promise<ICloudinaryUploadResult> {
    return uploadToCloudinary(image, options);
  }

  async deleteImage(publicId: string): Promise<ICloudinaryDeletionResponse> {
    return deleteFromCloudinary(publicId);
  }

  async uploadMultiple(
    images: (string | IUploadedFile)[],
    options: Partial<ICloudinaryUploadOptions> = {},
  ): Promise<ICloudinaryUploadResult[]> {
    return uploadMultipleToCloudinary(images, options);
  }
}

// Initialize cloudinary with config
validateAndConfigureCloudinary(defaultCloudinaryConfig);

// Export singleton instance
export const cloudinaryService = new CloudinaryUploadService();
