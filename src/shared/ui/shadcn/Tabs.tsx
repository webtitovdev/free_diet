/**
 * Tabs Component
 *
 * Компонент вкладок для организации контента.
 * Компонент на основе shadcn/ui паттернов.
 */

"use client";

import React, { useState, createContext, useContext } from "react";
import { cn } from "@/shared/lib/utils";

interface TabsContextValue {
  activeKey: string;
  onChange: (key: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  /** Активная вкладка */
  activeKey?: string;

  /** Callback при изменении активной вкладки */
  onChange?: (key: string) => void;

  /** Дочерние элементы (TabPane) */
  children: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Начальное значение активной вкладки (для uncontrolled режима) */
  defaultActiveKey?: string;
}

interface TabPaneProps {
  /** Уникальный ключ вкладки */
  tab: string;

  /** Ключ вкладки */
  key: string;

  /** Контент вкладки */
  children: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Отключена ли вкладка */
  disabled?: boolean;
}

/**
 * Tabs - Компонент вкладок
 *
 * Features:
 * - Управляемый и неуправляемый режимы
 * - Адаптивный дизайн
 * - Поддержка disabled вкладок
 * - Плавная анимация переключения
 *
 * @example
 * ```tsx
 * <Tabs activeKey={activeTab} onChange={setActiveTab}>
 *   <Tabs.TabPane tab="Вкладка 1" key="1">
 *     <p>Контент первой вкладки</p>
 *   </Tabs.TabPane>
 *   <Tabs.TabPane tab="Вкладка 2" key="2">
 *     <p>Контент второй вкладки</p>
 *   </Tabs.TabPane>
 * </Tabs>
 * ```
 */
export function Tabs({
  activeKey: controlledActiveKey,
  onChange,
  children,
  className,
  defaultActiveKey,
}: TabsProps) {
  // Получаем ключи вкладок из children
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabPaneProps> =>
      React.isValidElement(child) &&
      (child.type as React.ComponentType<TabPaneProps> & { displayName?: string }).displayName ===
        "TabPane"
  );

  // Определяем начальную активную вкладку
  const firstTabKey = tabs[0]?.key?.toString() || "";
  const initialKey = defaultActiveKey || controlledActiveKey || firstTabKey;

  // Локальное состояние для uncontrolled режима
  const [internalActiveKey, setInternalActiveKey] = useState(initialKey);

  // Используем либо controlledActiveKey, либо внутреннее состояние
  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;

  const handleChange = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  return (
    <TabsContext.Provider value={{ activeKey, onChange: handleChange }}>
      <div className={cn("w-full", className)}>
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const isActive = tab.key === activeKey;
            const isDisabled = tab.props.disabled;

            return (
              <button
                key={tab.key}
                onClick={() => !isDisabled && handleChange(tab.key as string)}
                disabled={isDisabled}
                className={cn(
                  // Базовые стили
                  "px-4 py-2 text-sm font-medium",
                  "border-b-2 transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-DEFAULT",
                  "whitespace-nowrap",

                  // Активная вкладка
                  isActive
                    ? "border-primary-DEFAULT text-primary-DEFAULT"
                    : "border-transparent text-gray-600 dark:text-gray-400",

                  // Hover
                  !isActive &&
                    !isDisabled &&
                    "hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600",

                  // Disabled
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {tab.props.tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          {tabs.map((tab) => {
            const isActive = tab.key === activeKey;
            return (
              <div
                key={tab.key}
                className={cn(
                  "transition-opacity duration-200",
                  isActive ? "block opacity-100" : "hidden opacity-0",
                  tab.props.className
                )}
                role="tabpanel"
                aria-hidden={!isActive}
              >
                {tab.props.children}
              </div>
            );
          })}
        </div>
      </div>
    </TabsContext.Provider>
  );
}

/**
 * TabPane - Отдельная вкладка
 */
function TabPane({ children }: TabPaneProps) {
  return <>{children}</>;
}

// Присваиваем displayName для правильного распознавания в Tabs
TabPane.displayName = "TabPane";

// Добавляем TabPane как свойство Tabs для удобного использования
Tabs.TabPane = TabPane;

/**
 * Hook для доступа к контексту Tabs
 */
export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within Tabs");
  }
  return context;
}
