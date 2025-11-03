// Виджет формы профиля, объединяющий все поля
// T108: Create ProfileForm widget composing all profile fields
// Spec: §US4

"use client";

import { useEffect } from "react";
import { Form, Button, Card, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { ProfileFormFields } from "@/features/profile-management/ui/ProfileFormFields";
import { GoalSelector } from "@/features/profile-management/ui/GoalSelector";
import { CalorieDisplay } from "@/features/profile-management/ui/CalorieDisplay";
import { ProfileInput, UserProfile } from "@/entities/profile/model/types";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "@/features/profile-management/api/profile-api";
import { useProfileStore } from "@/features/profile-management/model/profile-store";

export function ProfileForm() {
  const [form] = Form.useForm();
  const { profile, isLoading, isUpdating, setProfile, setLoading, setUpdating, setError } =
    useProfileStore();

  // Загрузка профиля при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        form.setFieldsValue(data);
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
  }, [form, setProfile, setLoading]);

  const onFinish = async (values: ProfileInput) => {
    try {
      setUpdating(true);
      setError(null);

      let updatedProfile: UserProfile;

      if (profile) {
        // Обновление существующего профиля
        updatedProfile = await updateProfile(values);
        message.success("Профиль успешно обновлен");
      } else {
        // Создание нового профиля
        updatedProfile = await createProfile(values);
        message.success("Профиль успешно создан");
      }

      setProfile(updatedProfile);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error?.response?.data?.error || "Ошибка при сохранении профиля";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card
      title={profile ? "Редактировать профиль" : "Создать профиль"}
      loading={isLoading}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      {/* Отображение рассчитанной калорийности */}
      {profile && <CalorieDisplay targetCalories={profile.targetCalories} loading={isLoading} />}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        disabled={isUpdating}
      >
        {/* Поля профиля */}
        <ProfileFormFields disabled={isUpdating} />

        {/* Выбор цели */}
        <GoalSelector disabled={isUpdating} />

        {/* Кнопка сохранения */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isUpdating}
            block
            size="large"
          >
            {profile ? "Обновить профиль" : "Создать профиль"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
