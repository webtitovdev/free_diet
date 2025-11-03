// Register page
// T051: Register page composing RegisterForm

import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { GoogleOAuthButton } from "@/features/auth/ui/GoogleOAuthButton";
import { Divider } from "antd";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
      <RegisterForm />

      <Divider>или</Divider>

      <GoogleOAuthButton />

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <p>
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
