// Страница профиля пользователя
// T109: Create profile page in src/pages/profile-page/ProfilePage.tsx
// T056: Wrapped в Container компонент для desktop центрирования
// Spec: §US4

"use client";

import { Typography } from "antd";
import { ProfileForm } from "@/widgets/profile-form/ProfileForm";
import { Container } from "@/shared/ui/shadcn/Container";

const { Title, Paragraph } = Typography;

export function ProfilePage() {
  return (
    <Container maxWidth="desktop" padding={6} centered>
      <Title level={2}>Профиль и цели</Title>
      <Paragraph>
        Настройте ваш профиль, чтобы получить персонализированную рекомендацию по калорийности.
        Система автоматически рассчитает вашу дневную норму калорий по формуле Mifflin-St Jeor с
        учетом вашей цели.
      </Paragraph>

      <ProfileForm />
    </Container>
  );
}
