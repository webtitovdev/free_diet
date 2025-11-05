// Register page - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui

import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { GoogleOAuthButton } from "@/features/auth/ui/GoogleOAuthButton";
import { Divider } from "@/shared/ui/shadcn/Divider";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Создать аккаунт
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Начните отслеживать калории прямо сейчас
        </p>
      </div>

      <RegisterForm />

      <Divider>или</Divider>

      <GoogleOAuthButton />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
