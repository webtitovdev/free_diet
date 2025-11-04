// EmailVerification page component - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/features/auth/api/auth-api";
import { Alert } from "@/shared/ui/shadcn/Alert";
import { LoadingSpinner } from "@/shared/ui/shadcn/LoadingSpinner";
import { Button } from "@/shared/ui/shadcn/Button";

export function EmailVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams?.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Токен верификации отсутствует");
      return;
    }

    // Верифицировать email
    verifyEmail(token)
      .then((result) => {
        setStatus("success");
        setMessage(result.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error?.response?.data?.error || "Ошибка при верификации email");
      });
  }, [searchParams]);

  return (
    <div className="max-w-[500px] mx-auto mt-24 text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary dark:text-gray-400">Верификация email...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col gap-4">
          <Alert message={message} type="success" showIcon />
          <Button variant="primary" size="lg" onClick={() => router.push("/login")}>
            Перейти к входу
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col gap-4">
          <Alert message={message} type="error" showIcon />
          <Button variant="secondary" onClick={() => router.push("/register")}>
            Вернуться к регистрации
          </Button>
        </div>
      )}
    </div>
  );
}
