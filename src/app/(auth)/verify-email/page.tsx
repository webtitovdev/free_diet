// Verify Email page
// T052: Verify-email page

import { Suspense } from "react";
import { EmailVerification } from "@/widgets/auth-page/EmailVerification";
import { Spin } from "antd";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" />
        </div>
      }
    >
      <EmailVerification />
    </Suspense>
  );
}
