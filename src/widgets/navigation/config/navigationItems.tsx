/**
 * Navigation Items Configuration
 *
 * Конфигурация основных разделов навигации приложения.
 * 4 основных раздела согласно research.md section 5.1.
 *
 * @see specs/001-mobile-first-ui-redesign/research.md
 */

import React from "react";
import { Home, PlusCircle, TrendingUp, User } from "lucide-react";
import type { NavigationItem } from "@/specs/001-mobile-first-ui-redesign/contracts/component-contracts";

/**
 * Основные навигационные элементы
 *
 * Разделы:
 * 1. Дневник (Diary) - главный экран с приемами пищи
 * 2. Добавить (Add Meal) - центральная CTA кнопка
 * 3. Прогресс (Progress) - графики и статистика
 * 4. Профиль (Profile) - настройки пользователя
 */
export const navigationItems: NavigationItem[] = [
  {
    id: "diary",
    label: "Дневник",
    icon: <Home className="w-full h-full" />,
    href: "/dashboard",
    ariaLabel: "Перейти в дневник питания",
  },
  {
    id: "add-meal",
    label: "Добавить",
    icon: <PlusCircle className="w-full h-full" />,
    href: "/photos/upload",
    ariaLabel: "Добавить новый прием пищи",
  },
  {
    id: "progress",
    label: "Прогресс",
    icon: <TrendingUp className="w-full h-full" />,
    href: "/progress",
    ariaLabel: "Посмотреть прогресс и статистику",
  },
  {
    id: "profile",
    label: "Профиль",
    icon: <User className="w-full h-full" />,
    href: "/profile",
    ariaLabel: "Открыть профиль пользователя",
  },
];
