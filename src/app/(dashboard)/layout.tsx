// Authenticated layout с session check
// T054: Dashboard layout для authenticated routes

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { AuthMethod } from "@/entities/user/model/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (session?.user) {
      const user = session.user as {
        id?: string;
        email?: string | null;
        emailVerified?: boolean;
        authMethod?: string;
      };

      // Проверяем, что все необходимые поля присутствуют
      if (user.id && user.email && user.authMethod) {
        setUser({
          id: user.id,
          email: user.email,
          emailVerified: !!user.emailVerified,
          authMethod: user.authMethod as AuthMethod,
        });
      }
    }
  }, [session, status, router, setUser]);

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <div style={{ padding: "24px" }}>{children}</div>;
}
