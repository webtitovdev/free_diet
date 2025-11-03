// Zustand store для управления состоянием профиля пользователя
// T103: Create profile management feature store (profile data, update)
// Spec: §US4

import { create } from "zustand";
import { UserProfile, ProfileInput } from "@/entities/profile/model/types";

interface ProfileState {
  // Данные профиля
  profile: UserProfile | null;

  // Состояние загрузки
  isLoading: boolean;
  isUpdating: boolean;

  // Ошибки
  error: string | null;

  // Методы
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<ProfileInput>) => void;
  setLoading: (isLoading: boolean) => void;
  setUpdating: (isUpdating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const useProfileStore = create<ProfileState>((set) => ({
  ...initialState,

  setProfile: (profile) => {
    set({ profile, error: null });
  },

  updateProfile: (updates) => {
    set((state) => {
      if (!state.profile) {
        return state;
      }

      return {
        profile: {
          ...state.profile,
          ...updates,
        },
        error: null,
      };
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setUpdating: (isUpdating) => {
    set({ isUpdating });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
}));
