// RegisterForm component - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui
// Валидация пароля (FR-002b) preserved

"use client";

import React, { useState } from "react";
import { register } from "../api/auth-api";
import { useAuthStore } from "../model/auth-store";
import { Button } from "@/shared/ui/shadcn/Button";
import { Input } from "@/shared/ui/shadcn/Input";
import { PasswordInput } from "@/shared/ui/shadcn/PasswordInput";
import { Alert } from "@/shared/ui/shadcn/Alert";
import { User } from "lucide-react";

export function RegisterForm() {
  const { isLoading, setLoading, setError, error } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

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

  // Валидация пароля (FR-002b)
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Введите пароль");
      return false;
    }

    if (value.length < 8) {
      setPasswordError("Пароль должен содержать минимум 8 символов");
      return false;
    }

    if (!/\d/.test(value)) {
      setPasswordError("Пароль должен содержать хотя бы одну цифру");
      return false;
    }

    if (!/[a-zA-Z]/.test(value)) {
      setPasswordError("Пароль должен содержать хотя бы одну букву");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // Валидация подтверждения пароля
  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError("Подтвердите пароль");
      return false;
    }

    if (value !== password) {
      setConfirmPasswordError("Пароли не совпадают");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  // Обработчик submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация перед отправкой
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Регистрация через API
      const result = await register({
        email,
        password,
      });

      setSuccessMessage(result.message);

      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error?.response?.data?.error || "Произошла ошибка при регистрации";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <h1 className="text-center text-2xl font-semibold mb-6 text-text-primary dark:text-gray-100">
        Регистрация
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

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          showIcon
          closable
          onClose={() => setSuccessMessage(null)}
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
          onChange={(value) => {
            setPassword(value);
            // Перепроверить confirm password если он уже заполнен
            if (confirmPassword) {
              validateConfirmPassword(confirmPassword);
            }
          }}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          helperText="Минимум 8 символов, хотя бы одна цифра и одна буква"
          required
          autoComplete="new-password"
        />

        <PasswordInput
          label="Подтвердите пароль"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onBlur={() => validateConfirmPassword(confirmPassword)}
          error={confirmPasswordError}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
