"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/ui/shadcn/ErrorState";

/**
 * Error Boundary для глобальной обработки ошибок - shadcn/ui migration
 * T064: Migrated from Ant Design to shadcn/ui
 *
 * Автоматически перехватывает ошибки на уровне приложения
 * и показывает пользователю понятное сообщение
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логирование ошибки в консоль для отладки
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <ErrorState
        type="generic"
        title="Произошла ошибка"
        description="К сожалению, что-то пошло не так. Попробуйте перезагрузить страницу."
        onRetry={reset}
        retryLabel="Попробовать снова"
      />
    </div>
  );
}
