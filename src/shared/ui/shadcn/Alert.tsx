/**
 * Alert Component - shadcn/ui
 *
 * Компонент для отображения уведомлений, предупреждений и ошибок
 */

import React from "react";
import { cn } from "@/shared/lib/utils";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export interface AlertProps {
  /** Тип alert */
  type?: "success" | "error" | "warning" | "info";

  /** Сообщение */
  message: string;

  /** Описание (дополнительный текст) */
  description?: string;

  /** Показывать иконку */
  showIcon?: boolean;

  /** Возможность закрыть */
  closable?: boolean;

  /** Обработчик закрытия */
  onClose?: () => void;

  /** CSS класс */
  className?: string;
}

/**
 * Иконки для типов alert
 */
const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * Цветовые схемы для типов
 */
const typeColors = {
  success:
    "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
  warning:
    "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
};

/**
 * Иконки цвета
 */
const iconColors = {
  success: "text-green-500 dark:text-green-400",
  error: "text-red-500 dark:text-red-400",
  warning: "text-amber-500 dark:text-amber-400",
  info: "text-blue-500 dark:text-blue-400",
};

/**
 * Alert компонент
 */
export const Alert: React.FC<AlertProps> = ({
  type = "info",
  message,
  description,
  showIcon = false,
  closable = false,
  onClose,
  className,
}) => {
  const [visible, setVisible] = React.useState(true);

  const Icon = typeIcons[type];

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      className={cn("flex gap-3 p-4 rounded-DEFAULT border-2", typeColors[type], className)}
      role="alert"
    >
      {/* Иконка */}
      {showIcon && <Icon className={cn("flex-shrink-0 w-5 h-5", iconColors[type])} />}

      {/* Контент */}
      <div className="flex-1">
        <div className="font-medium">{message}</div>
        {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
      </div>

      {/* Кнопка закрытия */}
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
