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
    <header className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900" />

      {/* Glass effect bar */}
      <div className="relative z-10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Лого и название */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/")}
          >
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Трекер Калорий
            </h1>
          </div>

          {/* Навигация и меню пользователя */}
          <div className="flex items-center gap-6">
            {session && (
              <>
                {/* Основные пункты навигации */}
                <nav className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/photos/upload")}
                    className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    Загрузить фото
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/calendar")}
                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Календарь
                  </Button>
                </nav>

                {/* Меню пользователя */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group">
                      <Avatar className="ring-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
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
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  Войти
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/register")}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Регистрация
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
