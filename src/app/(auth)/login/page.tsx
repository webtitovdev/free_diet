// Login page - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { GoogleOAuthButton } from "@/features/auth/ui/GoogleOAuthButton";
import { Divider } from "@/shared/ui/shadcn/Divider";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <LoginForm />

      <Divider>или</Divider>

      <GoogleOAuthButton />

      <div className="mt-4 text-center">
        <p className="text-text-secondary dark:text-gray-400">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="text-brand-DEFAULT hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-DEFAULT underline transition-colors"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
