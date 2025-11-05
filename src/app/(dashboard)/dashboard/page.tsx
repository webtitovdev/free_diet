// Next.js App Router page для главной dashboard страницы
// После успешного логина пользователь попадает сюда

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Camera, Calendar, User, Image as ImageIcon, Flame, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card/Card";
import { StatsCard } from "@/shared/ui/shadcn/StatsCard";

// Отключаем статическую генерацию для страницы с аутентификацией
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Проверка аутентификации (дополнительная защита к middleware)
  if (!session?.user) {
    redirect("/login");
  }

  const userEmail = session.user?.email || "пользователь";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-slideUp">
      {/* Приветствие с градиентом */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-8">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 dark:from-purple-900 dark:via-indigo-900 dark:to-slate-900" />

        {/* Decorative blur */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Добро пожаловать, {userEmail}! 👋
          </h2>
          <p className="text-lg text-purple-100">
            Выберите действие для работы с приложением
          </p>
        </div>
      </div>

      {/* Карточки действий - с градиентами */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Карточка: Загрузить фото еды */}
        <Link href="/photos/upload" className="block group">
          <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer overflow-hidden bg-white dark:bg-slate-800">
            <CardContent className="pt-8 pb-6">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Загрузить фото еды
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Сфотографируйте вашу еду для анализа калорий
                  </p>
                </div>
              </div>
            </CardContent>
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity" />
          </Card>
        </Link>

        {/* Карточка: Календарь прогресса */}
        <Link href="/calendar" className="block group">
          <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer overflow-hidden bg-white dark:bg-slate-800">
            <CardContent className="pt-8 pb-6">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Календарь прогресса
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Просматривайте историю питания и отслеживайте прогресс
                  </p>
                </div>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-400 opacity-0 group-hover:opacity-5 transition-opacity" />
          </Card>
        </Link>

        {/* Карточка: Профиль */}
        <Link href="/profile" className="block group">
          <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer overflow-hidden bg-white dark:bg-slate-800">
            <CardContent className="pt-8 pb-6">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Профиль</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Настройте свои цели и параметры
                  </p>
                </div>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-400 opacity-0 group-hover:opacity-5 transition-opacity" />
          </Card>
        </Link>
      </div>

      {/* Быстрая статистика - с градиентами */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Быстрая статистика
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group overflow-hidden rounded-2xl">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Загруженных фото
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Дней отслеживания
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Ккал сегодня
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                    <Flame className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
