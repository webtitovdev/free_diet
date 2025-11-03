"use client";

import { App } from "antd";
import { createContext, useContext } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { NotificationInstance } from "antd/es/notification/interface";

/**
 * Контекст для глобальных toast notifications
 *
 * Предоставляет доступ к Ant Design message, notification и modal
 * во всех компонентах приложения
 */
type ToastContextType = {
  message: MessageInstance;
  notification: NotificationInstance;
  modal: Omit<ModalStaticFunctions, "warn">;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { message, notification, modal } = App.useApp();

  return (
    <ToastContext.Provider value={{ message, notification, modal }}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook для использования toast notifications
 *
 * Примеры использования:
 * ```tsx
 * const toast = useToast()
 * toast.message.success('Успешно сохранено')
 * toast.message.error('Ошибка при сохранении')
 * toast.notification.info({ message: 'Информация', description: 'Детали' })
 * ```
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
