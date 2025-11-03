// FoodPhoto entity types
// T055: Create FoodPhoto entity model types in src/entities/photo/model/types.ts (PhotoStatus enum)
// Spec: §US2, data-model.md

/**
 * Photo processing status enum
 * Tracks the lifecycle of uploaded food photos
 */
export enum PhotoStatus {
  UPLOADING = "UPLOADING", // Upload in progress
  PROCESSING = "PROCESSING", // OpenRouter API analyzing
  COMPLETED = "COMPLETED", // Analysis complete, results available
  FAILED = "FAILED", // Processing failed (low quality, no food detected, API error)
}

/**
 * FoodPhoto entity interface
 * Represents an uploaded food photo with auto-deletion lifecycle
 */
export interface FoodPhoto {
  id: string;
  userId: string;
  storageUrl: string; // URL in Vercel Blob storage
  uploadedAt: Date;
  autoDeleteAt: Date; // uploadedAt + 30 days (FR-005a)
  processingStatus: PhotoStatus;
}

/**
 * DTO for creating a new food photo
 */
export interface CreateFoodPhotoDto {
  userId: string;
  storageUrl: string;
  processingStatus?: PhotoStatus; // defaults to PROCESSING
}

/**
 * DTO for updating photo processing status
 */
export interface UpdatePhotoStatusDto {
  processingStatus: PhotoStatus;
}
