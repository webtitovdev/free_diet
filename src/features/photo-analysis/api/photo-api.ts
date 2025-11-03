// API методы для работы с анализом фотографий
// T068: Photo API methods

import axios from "axios";
import { PhotoStatus } from "@/entities/photo/model/types";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface UploadPhotoResponse {
  photoId: string;
  storageUrl: string;
  processingStatus: PhotoStatus;
}

export interface AnalyzePhotoResponse {
  photoId: string;
  processingStatus: PhotoStatus;
  recognizedItems?: RecognizedFoodItem[];
  error?: string;
}

export interface PhotoStatusResponse {
  photoId: string;
  processingStatus: PhotoStatus;
}

export interface PhotoResultsResponse {
  photoId: string;
  processingStatus: PhotoStatus;
  storageUrl?: string;
  message?: string;
  error?: string;
}

/**
 * Загрузка фотографии на сервер
 */
export async function uploadPhoto(file: File): Promise<UploadPhotoResponse> {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await apiClient.post<UploadPhotoResponse>("/photos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/**
 * Запуск анализа фотографии
 */
export async function analyzePhoto(photoId: string): Promise<AnalyzePhotoResponse> {
  const response = await apiClient.post<AnalyzePhotoResponse>("/photos/analyze", {
    photoId,
  });

  return response.data;
}

/**
 * Проверка статуса обработки фотографии
 */
export async function getPhotoStatus(photoId: string): Promise<PhotoStatusResponse> {
  const response = await apiClient.get<PhotoStatusResponse>(`/photos/${photoId}/status`);

  return response.data;
}

/**
 * Получение результатов анализа фотографии
 */
export async function getPhotoResults(photoId: string): Promise<PhotoResultsResponse> {
  const response = await apiClient.get<PhotoResultsResponse>(`/photos/${photoId}/results`);

  return response.data;
}
