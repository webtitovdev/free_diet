// Страница профиля пользователя
// T109: Create profile page in src/pages/profile-page/ProfilePage.tsx
// Spec: §US4

"use client";

import { Typography } from "antd";
import { ProfileForm } from "@/widgets/profile-form/ProfileForm";

const { Title, Paragraph } = Typography;

export function ProfilePage() {
  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2}>Профиль и цели</Title>
      <Paragraph>
        Настройте ваш профиль, чтобы получить персонализированную рекомендацию по калорийности.
        Система автоматически рассчитает вашу дневную норму калорий по формуле Mifflin-St Jeor с
        учетом вашей цели.
      </Paragraph>

      <ProfileForm />
    </div>
  );
}
