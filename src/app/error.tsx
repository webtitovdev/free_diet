"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";

/**
 * Error Boundary для глобальной обработки ошибок
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <Result
        status="error"
        title="Произошла ошибка"
        subTitle="К сожалению, что-то пошло не так. Попробуйте перезагрузить страницу."
        extra={[
          <Button type="primary" key="retry" onClick={reset}>
            Попробовать снова
          </Button>,
          <Button key="home" onClick={() => (window.location.href = "/")}>
            На главную
          </Button>,
        ]}
      />
    </div>
  );
}
