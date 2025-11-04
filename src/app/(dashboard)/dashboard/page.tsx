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
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Приветствие */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Добро пожаловать, {userEmail}!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Выберите действие для работы с приложением
        </p>
      </div>

      {/* Карточки действий */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Карточка: Загрузить фото еды */}
        <Link href="/photos/upload" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Загрузить фото еды
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Сфотографируйте вашу еду для анализа калорий
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Карточка: Календарь прогресса */}
        <Link href="/calendar" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Календарь прогресса
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Просматривайте историю питания и отслеживайте прогресс
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Карточка: Профиль */}
        <Link href="/profile" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Профиль</h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Настройте свои цели и параметры
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Быстрая статистика */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрая статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Загруженных фото"
              value={0}
              icon={<ImageIcon className="h-5 w-5" />}
              color="brand"
            />
            <StatsCard
              title="Дней отслеживания"
              value={0}
              icon={<Clock className="h-5 w-5" />}
              color="success"
            />
            <StatsCard
              title="Ккал сегодня"
              value={0}
              icon={<Flame className="h-5 w-5" />}
              color="info"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
