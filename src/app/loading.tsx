import { LoadingSpinner } from "@/shared/ui/shadcn/LoadingSpinner";

/**
 * Глобальный компонент загрузки - shadcn/ui migration
 * T064: Migrated from Ant Design to shadcn/ui
 *
 * Показывается автоматически при переходах между роутами
 * или при Suspense boundaries
 */
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-secondary dark:bg-gray-900 gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-text-secondary dark:text-gray-400">Загрузка...</p>
    </div>
  );
}
