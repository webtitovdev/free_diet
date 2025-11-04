import Link from "next/link";
import { ErrorState } from "@/shared/ui/shadcn/ErrorState";
import { Button } from "@/shared/ui/shadcn/Button";

/**
 * Страница 404 - не найдено - shadcn/ui migration
 * T064: Migrated from Ant Design to shadcn/ui
 *
 * Показывается автоматически когда пользователь переходит
 * на несуществующий роут
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-DEFAULT dark:text-brand-light mb-4">404</h1>
        <ErrorState
          type="not-found"
          title="Страница не найдена"
          description="К сожалению, запрашиваемая страница не существует."
        />
      </div>
      <Link href="/">
        <Button variant="primary" size="lg">
          На главную
        </Button>
      </Link>
    </div>
  );
}
