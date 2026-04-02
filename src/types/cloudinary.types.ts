// src/types/cloudinary.types.ts
import { TransformationOptions } from 'cloudinary';

export interface IUploadedFile {
  buffer: Buffer;
  mimetype?: string;
  originalname?: string;
  size?: number;
}

export interface ICloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export interface ICloudinaryUploadOptions {
  resource_type?: 'image' | 'auto' | 'video' | 'raw';
  folder?: string;
  public_id?: string;
  transformation?: TransformationOptions;
  tags?: string[];
  [key: string]: unknown;
}

export interface ICloudinaryDeletionResponse {
  result: string;
  [key: string]: unknown;
}

export interface ICloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  asset_id?: string;
  format?: string;
  resource_type?: string;
}

export interface ICloudinaryUploadService {
  uploadImage(
    image: string | IUploadedFile,
    options?: Partial<ICloudinaryUploadOptions>,
  ): Promise<ICloudinaryUploadResult>;
  deleteImage(publicId: string): Promise<ICloudinaryDeletionResponse>;
  uploadMultiple(
    images: (string | IUploadedFile)[],
    options?: Partial<ICloudinaryUploadOptions>,
  ): Promise<ICloudinaryUploadResult[]>;
}
