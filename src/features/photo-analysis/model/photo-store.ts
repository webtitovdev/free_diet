// Zustand store для управления состоянием анализа фотографий
// T067: Photo analysis feature store

import { create } from "zustand";
import { PhotoStatus } from "@/entities/photo/model/types";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";

interface PhotoAnalysisState {
  // Состояние загрузки
  isUploading: boolean;
  uploadProgress: number;

  // Информация о фотографии
  photoId: string | null;
  photoUrl: string | null;
  processingStatus: PhotoStatus | null;

  // Результаты анализа
  recognizedItems: RecognizedFoodItem[];

  // Ошибки
  error: string | null;

  // Методы
  setUploading: (isUploading: boolean, progress?: number) => void;
  setPhoto: (photoId: string, photoUrl: string, status: PhotoStatus) => void;
  setProcessingStatus: (status: PhotoStatus) => void;
  setRecognizedItems: (items: RecognizedFoodItem[]) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  isUploading: false,
  uploadProgress: 0,
  photoId: null,
  photoUrl: null,
  processingStatus: null,
  recognizedItems: [],
  error: null,
};

export const usePhotoAnalysisStore = create<PhotoAnalysisState>((set) => ({
  ...initialState,

  setUploading: (isUploading, progress = 0) => {
    set({ isUploading, uploadProgress: progress, error: null });
  },

  setPhoto: (photoId, photoUrl, status) => {
    set({
      photoId,
      photoUrl,
      processingStatus: status,
      isUploading: false,
      uploadProgress: 100,
      error: null,
    });
  },

  setProcessingStatus: (status) => {
    set({ processingStatus: status });
  },

  setRecognizedItems: (items) => {
    set({ recognizedItems: items });
  },

  setError: (error) => {
    set({ error, isUploading: false });
  },

  reset: () => {
    set(initialState);
  },
}));
