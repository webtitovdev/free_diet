// Authenticated layout с session check
// T054: Dashboard layout для authenticated routes
// T036, T037: Интеграция BottomNavigation и TopHeader

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { AuthMethod } from "@/entities/user/model/types";
import { BottomNavigation } from "@/widgets/navigation/ui/BottomNavigation";
import { TopHeader } from "@/widgets/header/ui/TopHeader";
import { navigationItems } from "@/widgets/navigation/config/navigationItems";
import { Menu, Bell } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (session?.user) {
      const user = session.user as {
        id?: string;
        email?: string | null;
        emailVerified?: boolean;
        authMethod?: string;
      };

      // Проверяем, что все необходимые поля присутствуют
      if (user.id && user.email && user.authMethod) {
        setUser({
          id: user.id,
          email: user.email,
          emailVerified: !!user.emailVerified,
          authMethod: user.authMethod as AuthMethod,
        });
      }
    }
  }, [session, status, router, setUser]);

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  // Определение активного item на основе pathname
  const activeItemId = navigationItems.find((item) => pathname?.startsWith(item.href))?.id;

  // Определение title на основе pathname
  const getPageTitle = () => {
    if (!pathname) return "Free Diet";
    if (pathname.startsWith("/dashboard")) return "Дневник";
    if (pathname.startsWith("/photos/upload")) return "Добавить еду";
    if (pathname.startsWith("/progress")) return "Прогресс";
    if (pathname.startsWith("/profile")) return "Профиль";
    if (pathname.startsWith("/calendar")) return "Календарь";
    return "Free Diet";
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 mobile:pb-[72px]">
      {/* TopHeader с динамическим title */}
      <TopHeader
        title={getPageTitle()}
        leftAction={
          <button
            className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Открыть меню"
          >
            <Menu className="w-6 h-6" />
          </button>
        }
        rightAction={
          <button
            className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Уведомления"
          >
            <Bell className="w-6 h-6" />
          </button>
        }
        sticky
        showShadowOnScroll
      />

      {/* Main content */}
      <main className="flex-1 p-4 mobile:p-6">{children}</main>

      {/* BottomNavigation - фиксированная внизу */}
      <BottomNavigation
        items={navigationItems}
        activeItem={activeItemId}
        position="fixed"
        showLabels
      />
    </div>
  );
}
