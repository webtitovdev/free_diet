// EmailVerification page component
// T048: Email verification page

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, Spin, Button } from "antd";
import { verifyEmail } from "@/features/auth/api/auth-api";

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
    <div style={{ maxWidth: 500, margin: "100px auto", textAlign: "center" }}>
      {status === "loading" && (
        <>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Верификация email...</p>
        </>
      )}

      {status === "success" && (
        <>
          <Alert message={message} type="success" showIcon style={{ marginBottom: 16 }} />
          <Button type="primary" size="large" onClick={() => router.push("/auth/login")}>
            Перейти к входу
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <Alert message={message} type="error" showIcon style={{ marginBottom: 16 }} />
          <Button onClick={() => router.push("/auth/register")}>Вернуться к регистрации</Button>
        </>
      )}
    </div>
  );
}
