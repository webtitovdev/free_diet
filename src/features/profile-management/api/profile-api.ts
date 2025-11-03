// API методы для работы с профилем пользователя
// T104: Create profile API methods (get, update profile)
// Spec: §US4, contracts/profile.yaml

import axios from "axios";
import { ProfileInput, UserProfile } from "@/entities/profile/model/types";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Получить текущий профиль пользователя
 *
 * @returns UserProfile или throws error если профиль не создан (404)
 */
export async function getProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/profile");
  return response.data;
}

/**
 * Создать профиль пользователя
 *
 * @param data - Данные профиля (weight, age, gender, height, goal)
 * @returns Созданный профиль с рассчитанной targetCalories
 */
export async function createProfile(data: ProfileInput): Promise<UserProfile> {
  const response = await apiClient.post<UserProfile>("/profile", data);
  return response.data;
}

/**
 * Обновить профиль пользователя (частичное обновление)
 *
 * @param data - Частичные данные для обновления
 * @returns Обновленный профиль с пересчитанной targetCalories
 */
export async function updateProfile(data: Partial<ProfileInput>): Promise<UserProfile> {
  const response = await apiClient.patch<UserProfile>("/profile", data);
  return response.data;
}

/**
 * Удалить профиль пользователя
 *
 * Пользователь может продолжать использовать приложение без профиля,
 * но функционал отслеживания калорий будет недоступен
 */
export async function deleteProfile(): Promise<void> {
  await apiClient.delete("/profile");
}
