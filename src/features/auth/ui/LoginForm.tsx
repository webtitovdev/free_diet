// LoginForm component - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui

"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../model/auth-store";
import { Button } from "@/shared/ui/shadcn/Button";
import { Input } from "@/shared/ui/shadcn/Input";
import { PasswordInput } from "@/shared/ui/shadcn/PasswordInput";
import { Alert } from "@/shared/ui/shadcn/Alert";
import { User } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { loading, setLoading, setError, error } = useAuthStore();

  // Form state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  // Валидация email
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Введите email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Неверный формат email");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Валидация пароля
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Введите пароль");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Обработчик submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация перед отправкой
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // NextAuth signIn с credentials provider
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Успешный логин - перенаправление на dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Произошла ошибка при входе. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <h1 className="text-center text-2xl font-semibold mb-6 text-text-primary dark:text-gray-100">
        Вход в систему
      </h1>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={setEmail}
          onBlur={() => validateEmail(email)}
          error={emailError}
          required
          autoComplete="email"
          icon={<User className="w-4 h-4" />}
          iconPosition="left"
        />

        <PasswordInput
          label="Пароль"
          placeholder="Пароль"
          value={password}
          onChange={setPassword}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Войти
        </Button>
      </form>
    </div>
  );
}
