// Компонент отображения рассчитанной целевой калорийности
// T107: Create CalorieDisplay component showing calculated target
// Spec: §FR-017

"use client";

import { Card, CardContent } from "@/shared/ui/card/Card";
import { Flame } from "lucide-react";

interface CalorieDisplayProps {
  targetCalories: number | null;
  loading?: boolean;
}

export function CalorieDisplay({ targetCalories, loading = false }: CalorieDisplayProps) {
  if (!targetCalories && !loading) {
    return null;
  }

  return (
    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Flame className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Рекомендуемая дневная калорийность</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {targetCalories || 0}
              </span>
              <span className="text-lg text-muted-foreground">ккал</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Рассчитано по формуле Mifflin-St Jeor с учетом вашей цели
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
