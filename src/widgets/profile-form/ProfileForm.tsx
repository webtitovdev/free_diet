// Виджет формы профиля, объединяющий все поля
// T108: Create ProfileForm widget composing all profile fields
// Spec: §US4

"use client";

import { useEffect, useState, FormEvent } from "react";
import { Save } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card/Card";
import { toast } from "@/shared/hooks/use-toast";
import { ProfileFormFields } from "@/features/profile-management/ui/ProfileFormFields";
import { GoalSelector } from "@/features/profile-management/ui/GoalSelector";
import { CalorieDisplay } from "@/features/profile-management/ui/CalorieDisplay";
import { ProfileInput, UserProfile, GoalType, Gender } from "@/entities/profile/model/types";
import { PROFILE_VALIDATION_RULES } from "@/entities/profile/lib/validate-profile";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "@/features/profile-management/api/profile-api";
import { useProfileStore } from "@/features/profile-management/model/profile-store";

export function ProfileForm() {
  const { profile, isLoading, isUpdating, setProfile, setLoading, setUpdating, setError } =
    useProfileStore();

  // Локальное состояние формы
  const [formData, setFormData] = useState<ProfileInput>({
    weight: 0,
    height: 0,
    age: 0,
    gender: Gender.MALE,
    goal: GoalType.MAINTAIN,
  });

  // Ошибки валидации
  const [errors, setErrors] = useState<{
    weight?: string;
    height?: string;
    age?: string;
    gender?: string;
    goal?: string;
  }>({});

  // Загрузка профиля при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        setFormData({
          weight: data.weight,
          height: data.height,
          age: data.age,
          gender: data.gender,
          goal: data.goal,
        });
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        // 404 = профиль не создан, это нормально
        if (error?.response?.status !== 404) {
          console.error("Failed to load profile:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setProfile, setLoading]);

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Валидация веса
    if (!formData.weight) {
      newErrors.weight = "Введите ваш вес";
    } else if (
      formData.weight < PROFILE_VALIDATION_RULES.weight.min ||
      formData.weight > PROFILE_VALIDATION_RULES.weight.max
    ) {
      newErrors.weight = `Вес должен быть от ${PROFILE_VALIDATION_RULES.weight.min} до ${PROFILE_VALIDATION_RULES.weight.max} кг`;
    }

    // Валидация роста
    if (!formData.height) {
      newErrors.height = "Введите ваш рост";
    } else if (
      formData.height < PROFILE_VALIDATION_RULES.height.min ||
      formData.height > PROFILE_VALIDATION_RULES.height.max
    ) {
      newErrors.height = `Рост должен быть от ${PROFILE_VALIDATION_RULES.height.min} до ${PROFILE_VALIDATION_RULES.height.max} см`;
    }

    // Валидация возраста
    if (!formData.age) {
      newErrors.age = "Введите ваш возраст";
    } else if (
      formData.age < PROFILE_VALIDATION_RULES.age.min ||
      formData.age > PROFILE_VALIDATION_RULES.age.max
    ) {
      newErrors.age = `Возраст должен быть от ${PROFILE_VALIDATION_RULES.age.min} до ${PROFILE_VALIDATION_RULES.age.max} лет`;
    }

    // Валидация пола
    if (!formData.gender) {
      newErrors.gender = "Выберите ваш пол";
    }

    // Валидация цели
    if (!formData.goal) {
      newErrors.goal = "Выберите вашу цель";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      let updatedProfile: UserProfile;

      if (profile) {
        // Обновление существующего профиля
        updatedProfile = await updateProfile(formData);
        toast.success("Профиль успешно обновлен");
      } else {
        // Создание нового профиля
        updatedProfile = await createProfile(formData);
        toast.success("Профиль успешно создан");
      }

      setProfile(updatedProfile);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error?.response?.data?.error || "Ошибка при сохранении профиля";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{profile ? "Редактировать профиль" : "Создать профиль"}</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Отображение рассчитанной калорийности */}
        {profile && <CalorieDisplay targetCalories={profile.targetCalories} loading={isLoading} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Поля профиля */}
          <ProfileFormFields
            weight={formData.weight}
            height={formData.height}
            age={formData.age}
            gender={formData.gender}
            onWeightChange={(value) => setFormData({ ...formData, weight: value })}
            onHeightChange={(value) => setFormData({ ...formData, height: value })}
            onAgeChange={(value) => setFormData({ ...formData, age: value })}
            onGenderChange={(value) => setFormData({ ...formData, gender: value })}
            disabled={isUpdating}
            errors={errors}
          />

          {/* Выбор цели */}
          <GoalSelector
            value={formData.goal}
            onChange={(value) => setFormData({ ...formData, goal: value })}
            disabled={isUpdating}
            error={errors.goal}
          />

          {/* Кнопка сохранения */}
          <Button type="submit" disabled={isUpdating} className="w-full" size="lg">
            <Save className="mr-2 h-5 w-5" />
            {profile ? "Обновить профиль" : "Создать профиль"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
