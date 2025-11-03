// Authenticated layout с session check
// T054: Dashboard layout для authenticated routes

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layout, Spin } from "antd";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { AuthMethod } from "@/entities/user/model/types";

const { Header, Content } = Layout;

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
        id: string;
        email: string;
        emailVerified: boolean;
        authMethod: string;
      };
      setUser({
        id: user.id,
        email: session.user.email!,
        emailVerified: !!user.emailVerified,
        authMethod: user.authMethod as AuthMethod,
      });
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#001529",
          color: "#fff",
        }}
      >
        <h1 style={{ color: "#fff", margin: 0 }}>Free Diet</h1>
      </Header>

      <Content style={{ padding: "24px" }}>{children}</Content>
    </Layout>
  );
}
