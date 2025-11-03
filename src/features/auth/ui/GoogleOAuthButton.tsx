// GoogleOAuthButton component для Google OAuth
// T047: Google OAuth button

"use client";

import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";

export function GoogleOAuthButton() {
  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <Button
      size="large"
      block
      icon={<GoogleOutlined />}
      onClick={handleGoogleSignIn}
      style={{ marginTop: 16 }}
    >
      Войти через Google
    </Button>
  );
}
