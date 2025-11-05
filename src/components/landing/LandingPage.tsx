"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Camera, Edit, Calendar, User, CheckCircle, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";
import { Card, CardContent } from "@/shared/ui/card/Card";

/**
 * Landing Page - главная страница приложения
 *
 * Современный дизайн с градиентами, анимациями и визуальными эффектами
 */
export function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const features = [
    {
      icon: <Camera className="h-12 w-12" />,
      title: "Анализ по Фото",
      description:
        "Загрузите фото вашего блюда, и система автоматически определит продукты, вес и калорийность",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: <Edit className="h-12 w-12" />,
      title: "Редактирование Порций",
      description:
        "Уточните вес продуктов, добавьте недостающие - система пересчитает калории в реальном времени",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      icon: <User className="h-12 w-12" />,
      title: "Персональные Цели",
      description:
        "Укажите параметры (вес, рост, возраст, пол) и цель - получите рекомендуемую калорийность",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      icon: <Calendar className="h-12 w-12" />,
      title: "Календарь Прогресса",
      description:
        "Отслеживайте прогресс в календаре - зеленые дни показывают достижение целевой калорийности",
      gradient: "from-orange-500 to-red-400",
    },
  ];

  const stats = [
    { icon: <Zap className="h-8 w-8" />, value: "10K+", label: "Активных пользователей" },
    { icon: <TrendingUp className="h-8 w-8" />, value: "95%", label: "Точность распознавания" },
    { icon: <Sparkles className="h-8 w-8" />, value: "1M+", label: "Проанализированных фото" },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section - Современный с градиентом */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-purple-900 dark:via-indigo-900 dark:to-slate-900" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 py-20 px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8 animate-slideUp">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white text-sm font-medium glass">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Calorie Tracking</span>
            </div>

            {/* Main Heading с градиентом */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Трекер Калорий{" "}
              <span className="relative inline-block">
                <span className="relative z-10">по Фото</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-300 blur-xl opacity-50 animate-pulse" />
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Отслеживайте калории легко - просто сфотографируйте вашу еду
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              {!session ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => router.push("/register")}
                    className="relative group overflow-hidden bg-white text-purple-700 hover:text-purple-900 h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Начать бесплатно
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-300 opacity-0 group-hover:opacity-20 transition-opacity" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/login")}
                    className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-md h-14 px-10 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Войти
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={() => router.push("/photos/upload")}
                  className="relative group overflow-hidden bg-white text-purple-700 hover:text-purple-900 h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Перейти к загрузке фото
                  </span>
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <div className="p-3 bg-white/10 rounded-lg">{stat.icon}</div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-purple-100">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Карточки с градиентами */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16 animate-slideUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Возможности приложения
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Все инструменты для эффективного отслеживания калорий в одном месте
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-white dark:bg-slate-800">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="space-y-4">
                    {/* Icon с градиентом */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                      {feature.icon}
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>

                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-slate-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Технологии и забота о пользователях
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Финальный призыв к действию */}
      {!session && (
        <div className="relative overflow-hidden py-20 px-6">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-900 dark:via-pink-900 dark:to-red-900" />

          {/* Decorative blur */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-slideUp">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Готовы начать?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые уже отслеживают свои калории с
              помощью нашего приложения
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="relative group overflow-hidden bg-white text-purple-700 hover:text-purple-900 h-14 px-12 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Создать аккаунт бесплатно
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-300 opacity-0 group-hover:opacity-20 transition-opacity" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
