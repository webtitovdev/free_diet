// Register page - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui

import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { GoogleOAuthButton } from "@/features/auth/ui/GoogleOAuthButton";
import { Divider } from "@/shared/ui/shadcn/Divider";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
      <RegisterForm />

      <Divider>или</Divider>

      <GoogleOAuthButton />

      <div className="mt-4 text-center">
        <p className="text-text-secondary dark:text-gray-400">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-brand-DEFAULT hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-DEFAULT underline transition-colors"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
