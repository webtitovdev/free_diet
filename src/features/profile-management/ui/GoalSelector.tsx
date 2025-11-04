// Компонент выбора цели пользователя
// T106: Create GoalSelector component (BULK/MAINTAIN/CUT/SUGAR_CONTROL)
// Spec: §FR-016

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select/Select";
import { Label } from "@/shared/ui/label/Label";
import { GoalType, GOAL_METADATA } from "@/entities/profile/model/types";
import { HelpCircle } from "lucide-react";

interface GoalSelectorProps {
  value?: GoalType;
  onChange?: (value: GoalType) => void;
  disabled?: boolean;
  error?: string;
}

export function GoalSelector({ value, onChange, disabled = false, error }: GoalSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="goal">Цель</Label>
        <div className="group relative">
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          <div className="absolute left-0 top-6 hidden group-hover:block z-10 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-md border shadow-md">
            Цель влияет на расчет рекомендуемой калорийности
          </div>
        </div>
      </div>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id="goal"
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        >
          <SelectValue placeholder="Выберите цель" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(GoalType).map((goalType) => {
            const metadata = GOAL_METADATA[goalType];
            return (
              <SelectItem key={goalType} value={goalType}>
                <div className="flex flex-col">
                  <span className="font-medium">{metadata.label}</span>
                  <span className="text-xs text-muted-foreground">{metadata.description}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
