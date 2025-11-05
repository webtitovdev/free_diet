// Login page - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { GoogleOAuthButton } from "@/features/auth/ui/GoogleOAuthButton";
import { Divider } from "@/shared/ui/shadcn/Divider";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Вход в аккаунт
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Добро пожаловать! Войдите, чтобы продолжить
        </p>
      </div>

      <LoginForm />

      <Divider>или</Divider>

      <GoogleOAuthButton />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
