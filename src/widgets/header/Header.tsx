"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Camera, User, LogOut, Calendar, UserPlus } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";
import { Avatar, AvatarFallback } from "@/shared/ui/shadcn/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/DropdownMenu";

/**
 * Виджет Header с навигацией и меню пользователя
 *
 * Функции:
 * - Навигация между основными страницами (Фото, Календарь, Профиль)
 * - Меню пользователя с выходом
 * - Адаптивный дизайн
 */
export function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  // Получаем инициалы пользователя
  const getUserInitials = () => {
    const email = session?.user?.email || "";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900 px-6 py-3 shadow-sm border-b border-gray-200 dark:border-gray-800">
      {/* Лого и название */}
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push("/")}
      >
        <Camera className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Трекер Калорий</h1>
      </div>

      {/* Навигация и меню пользователя */}
      <div className="flex items-center gap-6">
        {session && (
          <>
            {/* Основные пункты навигации */}
            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/photos/upload")}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Загрузить фото
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/calendar")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Календарь
              </Button>
            </nav>

            {/* Меню пользователя */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {!session && (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
              Войти
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/register")}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Регистрация
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
