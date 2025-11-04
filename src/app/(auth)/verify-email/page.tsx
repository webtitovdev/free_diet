// Verify Email page - shadcn/ui migration
// T064: Migrated from Ant Design to shadcn/ui

import { Suspense } from "react";
import { EmailVerification } from "@/widgets/auth-page/EmailVerification";
import { LoadingSpinner } from "@/shared/ui/shadcn/LoadingSpinner";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center mt-24">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <EmailVerification />
    </Suspense>
  );
}
