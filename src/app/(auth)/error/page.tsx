// Страница ошибки OAuth аутентификации
// Обрабатывает ошибки от NextAuth при Google OAuth

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Определяем сообщение об ошибке на основе типа ошибки
  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case "OAuthCallback":
        return "Произошла ошибка при авторизации через Google. Возможно, истекло время ожидания или возникла проблема с сетью.";
      case "OAuthAccountNotLinked":
        return "Этот email уже используется с другим методом входа. Пожалуйста, войдите через тот же метод, который использовали при регистрации.";
      case "OAuthSignin":
        return "Ошибка при инициализации OAuth авторизации.";
      case "OAuthCreateAccount":
        return "Ошибка при создании аккаунта через Google.";
      case "EmailCreateAccount":
        return "Ошибка при создании аккаунта через email.";
      case "Callback":
        return "Ошибка при обработке callback от провайдера авторизации.";
      case "Default":
      default:
        return "Произошла ошибка при авторизации. Пожалуйста, попробуйте снова.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Ошибка авторизации
          </h2>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{getErrorMessage(error)}</p>
            {error && <p className="mt-2 text-xs text-red-600">Код ошибки: {error}</p>}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Попробовать снова
          </Link>

          <p className="text-center text-sm text-gray-600">
            Если проблема повторяется, попробуйте:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Проверить подключение к интернету</li>
            <li>Очистить кеш браузера</li>
            <li>Использовать другой браузер</li>
            <li>Войти через email и пароль</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-sm text-indigo-600 hover:text-indigo-500">
            Создать новый аккаунт
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Загрузка...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
