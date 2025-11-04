"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Camera, Edit, Calendar, User, CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";
import { Card, CardContent } from "@/shared/ui/card/Card";

/**
 * Landing Page - главная страница приложения
 *
 * Функции:
 * - Обзор основных возможностей приложения
 * - Призыв к действию (регистрация/вход)
 * - Навигация к основным функциям для аутентифицированных пользователей
 */
export function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const features = [
    {
      icon: <Camera className="h-12 w-12 text-blue-600" />,
      title: "Анализ по Фото",
      description:
        "Загрузите фото вашего блюда, и система автоматически определит продукты, вес и калорийность",
    },
    {
      icon: <Edit className="h-12 w-12 text-green-600" />,
      title: "Редактирование Порций",
      description:
        "Уточните вес продуктов, добавьте недостающие - система пересчитает калории в реальном времени",
    },
    {
      icon: <User className="h-12 w-12 text-purple-600" />,
      title: "Персональные Цели",
      description:
        "Укажите параметры (вес, рост, возраст, пол) и цель - получите рекомендуемую калорийность",
    },
    {
      icon: <Calendar className="h-12 w-12 text-orange-600" />,
      title: "Календарь Прогресса",
      description:
        "Отслеживайте прогресс в календаре - зеленые дни показывают достижение целевой калорийности",
    },
  ];

  const benefits = [
    "Автоматическое распознавание продуктов на фотографии",
    "Точный расчет калорий и БЖУ (белки, жиры, углеводы)",
    "Персонализированные рекомендации по калорийности",
    "Визуализация прогресса в календаре",
    "Поддержка Google OAuth и email регистрации",
    "Безопасное хранение данных",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-900 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Camera className="h-18 w-18 mx-auto" />
          <h1 className="text-5xl font-bold">Трекер Калорий по Фотографии</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Отслеживайте калории легко - просто сфотографируйте вашу еду
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            {!session ? (
              <>
                <Button
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 text-base"
                >
                  Начать бесплатно
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/login")}
                  className="bg-white/10 border-white text-white hover:bg-white/20 h-12 px-8 text-base"
                >
                  Войти
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={() => router.push("/photos/upload")}
                className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 text-base"
              >
                Перейти к загрузке фото
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Возможности приложения
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-gray-800 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-base text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!session && (
        <div className="bg-gray-50 dark:bg-gray-900 py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Готовы начать?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Присоединяйтесь к тысячам пользователей, которые уже отслеживают свои калории с
              помощью нашего приложения
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="h-12 px-12 text-base"
            >
              Создать аккаунт бесплатно
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
