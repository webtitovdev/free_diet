// Страница профиля пользователя
// T109: Create profile page in src/pages/profile-page/ProfilePage.tsx
// T056: Wrapped в Container компонент для desktop центрирования
// Spec: §US4

"use client";

import { ProfileForm } from "@/widgets/profile-form/ProfileForm";
import { Container } from "@/shared/ui/shadcn/Container";

export function ProfilePage() {
  return (
    <Container maxWidth="desktop" padding={6} centered>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Профиль и цели</h2>
        <p className="text-muted-foreground">
          Настройте ваш профиль, чтобы получить персонализированную рекомендацию по калорийности.
          Система автоматически рассчитает вашу дневную норму калорий по формуле Mifflin-St Jeor с
          учетом вашей цели.
        </p>
      </div>

      <ProfileForm />
    </Container>
  );
}
