// Next.js App Router page для профиля
// T110: Create profile route in src/app/(dashboard)/profile/page.tsx
// Spec: §US4

import { ProfilePage } from "@/widgets/profile-page/ProfilePage";

// Отключаем статическую генерацию для страницы с аутентификацией
export const dynamic = "force-dynamic";

export default function Profile() {
  return <ProfilePage />;
}
