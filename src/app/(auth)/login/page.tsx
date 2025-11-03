// Login page
// T050: Login page composing LoginForm and GoogleOAuthButton

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { GoogleOAuthButton } from "@/features/auth/ui/GoogleOAuthButton";
import { Divider } from "antd";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <LoginForm />

      <Divider>или</Divider>

      <GoogleOAuthButton />

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <p>
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
