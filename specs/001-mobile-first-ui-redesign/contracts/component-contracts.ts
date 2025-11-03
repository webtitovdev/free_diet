/**
 * Component Contracts - TypeScript Interface Definitions
 *
 * Этот файл определяет "контракты" для UI компонентов - интерфейсы props,
 * events и типы данных. Все компоненты ДОЛЖНЫ следовать этим контрактам.
 *
 * Feature: 001-mobile-first-ui-redesign
 * Date: 2025-11-04
 */

import { ReactNode, CSSProperties } from "react";

// ============================================================================
// Design Tokens Contracts
// ============================================================================

export type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
export type ColorVariant = "brand" | "success" | "error" | "warning" | "info";
export type TextColor = "primary" | "secondary" | "disabled" | "inverse";
export type BorderRadiusSize = "none" | "sm" | "default" | "md" | "lg" | "xl" | "full";
export type ShadowSize = "none" | "sm" | "default" | "md" | "lg" | "xl";
export type Breakpoint = "mobile" | "tablet" | "desktop";

// ============================================================================
// Layout Components
// ============================================================================

export interface CardProps {
  /** Вариант отображения карточки */
  variant?: "default" | "outlined" | "elevated";

  /** Внутренний отступ (ссылка на SpacingTokens) */
  padding?: SpacingValue;

  /** Скругление углов */
  borderRadius?: BorderRadiusSize;

  /** Тень */
  shadow?: ShadowSize;

  /** Дочерние элементы */
  children: ReactNode;

  /** CSS класс для кастомизации */
  className?: string;

  /** Inline стили (использовать с осторожностью) */
  style?: CSSProperties;

  /** Обработчик клика на карточку */
  onClick?: () => void;

  /** Делает карточку интерактивной (hover эффекты) */
  interactive?: boolean;
}

export interface ContainerProps {
  /** Максимальная ширина контейнера */
  maxWidth?: "mobile" | "tablet" | "desktop" | "full";

  /** Внутренний отступ */
  padding?: SpacingValue;

  /** Центрировать контент */
  centered?: boolean;

  /** Дочерние элементы */
  children: ReactNode;

  /** CSS класс */
  className?: string;
}

export interface GridProps {
  /** Количество колонок */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };

  /** Промежуток между элементами */
  gap?: SpacingValue;

  /** Дочерние элементы */
  children: ReactNode;

  /** CSS класс */
  className?: string;
}

// ============================================================================
// Navigation Components
// ============================================================================

export interface NavigationItem {
  /** Уникальный идентификатор */
  id: string;

  /** Отображаемый текст */
  label: string;

  /** Иконка (React компонент) */
  icon: ReactNode;

  /** URL для навигации */
  href: string;

  /** Badge с числом (для уведомлений) */
  badge?: number;

  /** Disabled состояние */
  disabled?: boolean;

  /** ARIA label для accessibility */
  ariaLabel?: string;
}

export interface BottomNavigationProps {
  /** Массив навигационных элементов (3-5 items) */
  items: NavigationItem[];

  /** ID активного элемента */
  activeItem: string;

  /** Обработчик клика на item */
  onItemClick: (itemId: string) => void;

  /** Позиционирование */
  position?: "fixed" | "sticky" | "static";

  /** CSS класс */
  className?: string;

  /** Показывать labels под иконками */
  showLabels?: boolean;
}

export interface TopHeaderProps {
  /** Заголовок страницы */
  title: string;

  /** Левое действие (кнопка назад, меню) */
  leftAction?: ReactNode;

  /** Правое действие (поиск, настройки) */
  rightAction?: ReactNode;

  /** Sticky позиционирование при скролле */
  sticky?: boolean;

  /** Показывать тень при скролле */
  showShadowOnScroll?: boolean;

  /** CSS класс */
  className?: string;
}

// ============================================================================
// Form Components
// ============================================================================

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  /** Вариант отображения кнопки */
  variant?: ButtonVariant;

  /** Размер кнопки */
  size?: ButtonSize;

  /** Disabled состояние */
  disabled?: boolean;

  /** Loading состояние (показывает спиннер) */
  loading?: boolean;

  /** Полная ширина */
  fullWidth?: boolean;

  /** Дочерние элементы (текст, иконки) */
  children: ReactNode;

  /** Обработчик клика */
  onClick?: () => void;

  /** HTML type атрибут */
  type?: "button" | "submit" | "reset";

  /** ARIA label */
  ariaLabel?: string;

  /** Минимальный размер touch target (из Breakpoint config) */
  minTouchTarget?: 44 | 40 | 32;

  /** CSS класс */
  className?: string;

  /** Иконка слева */
  iconLeft?: ReactNode;

  /** Иконка справа */
  iconRight?: ReactNode;
}

export interface InputProps {
  /** Тип input */
  type?: "text" | "email" | "password" | "number" | "tel" | "url";

  /** Label текст */
  label: string;

  /** Placeholder текст */
  placeholder?: string;

  /** Текст ошибки валидации */
  error?: string;

  /** Helper текст под input */
  helperText?: string;

  /** Disabled состояние */
  disabled?: boolean;

  /** Required поле */
  required?: boolean;

  /** Значение */
  value: string;

  /** Обработчик изменения */
  onChange: (value: string) => void;

  /** Обработчик blur (для валидации) */
  onBlur?: () => void;

  /** Обработчик focus */
  onFocus?: () => void;

  /** ID для aria-describedby (связь с error message) */
  ariaDescribedBy?: string;

  /** CSS класс */
  className?: string;

  /** Иконка внутри input */
  icon?: ReactNode;

  /** Позиция иконки */
  iconPosition?: "left" | "right";
}

export interface SelectProps<T = string> {
  /** Label текст */
  label: string;

  /** Placeholder */
  placeholder?: string;

  /** Опции для выбора */
  options: Array<{
    value: T;
    label: string;
    disabled?: boolean;
  }>;

  /** Выбранное значение */
  value: T | null;

  /** Обработчик изменения */
  onChange: (value: T) => void;

  /** Disabled состояние */
  disabled?: boolean;

  /** Required поле */
  required?: boolean;

  /** Текст ошибки */
  error?: string;

  /** CSS класс */
  className?: string;

  /** Разрешить поиск внутри select */
  searchable?: boolean;

  /** Multiple select */
  multiple?: boolean;
}

// ============================================================================
// Feedback Components
// ============================================================================

export interface ProgressCircleProps {
  /** Текущее значение (0-100) */
  value: number;

  /** Максимальное значение */
  max: number;

  /** Label текст */
  label: string;

  /** Размер круга */
  size?: "sm" | "md" | "lg" | "xl";

  /** Цвет прогресса */
  color?: ColorVariant;

  /** Показывать процент в центре */
  showPercentage?: boolean;

  /** Показывать значение вместо процента */
  showValue?: boolean;

  /** Толщина линии прогресса */
  strokeWidth?: number;

  /** CSS класс */
  className?: string;

  /** Анимировать при изменении значения */
  animated?: boolean;
}

export interface ToastProps {
  /** Тип уведомления */
  type: "success" | "error" | "warning" | "info";

  /** Сообщение */
  message: string;

  /** Описание (дополнительный текст) */
  description?: string;

  /** Длительность показа в мс (0 = бесконечно) */
  duration?: number;

  /** Действие (кнопка) */
  action?: {
    label: string;
    onClick: () => void;
  };

  /** Обработчик закрытия */
  onClose?: () => void;

  /** Позиция на экране */
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

  /** CSS класс */
  className?: string;
}

export interface SkeletonProps {
  /** Вариант отображения */
  variant?: "text" | "circular" | "rectangular";

  /** Ширина */
  width?: string | number;

  /** Высота */
  height?: string | number;

  /** Тип анимации */
  animation?: "pulse" | "wave" | "none";

  /** CSS класс */
  className?: string;

  /** Количество строк (для variant='text') */
  lines?: number;
}

export interface LoadingSpinnerProps {
  /** Размер */
  size?: "sm" | "md" | "lg";

  /** Цвет */
  color?: ColorVariant | "current";

  /** Текст рядом со спиннером */
  label?: string;

  /** CSS класс */
  className?: string;

  /** Центрировать на всю область */
  fullScreen?: boolean;
}

// ============================================================================
// Data Display Components
// ============================================================================

export interface MealCardProps {
  /** ID приема пищи */
  id: string;

  /** Название приема пищи */
  title: string;

  /** Фото еды */
  imageUrl?: string;

  /** Калории */
  calories: number;

  /** Макронутриенты */
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };

  /** Время приема пищи */
  timestamp: Date;

  /** Обработчик клика на карточку */
  onClick?: () => void;

  /** Обработчик редактирования */
  onEdit?: () => void;

  /** Обработчик удаления */
  onDelete?: () => void;

  /** CSS класс */
  className?: string;

  /** Вариант отображения */
  variant?: "compact" | "detailed";
}

export interface StatsCardProps {
  /** Заголовок */
  title: string;

  /** Значение */
  value: number | string;

  /** Единица измерения */
  unit?: string;

  /** Иконка */
  icon?: ReactNode;

  /** Цвет акцента */
  color?: ColorVariant;

  /** Тренд (изменение за период) */
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };

  /** CSS класс */
  className?: string;
}

// ============================================================================
// Modal Components
// ============================================================================

export interface ModalProps {
  /** Открыто ли модальное окно */
  open: boolean;

  /** Обработчик закрытия */
  onClose: () => void;

  /** Заголовок */
  title?: string;

  /** Дочерние элементы (контент) */
  children: ReactNode;

  /** Footer (кнопки действий) */
  footer?: ReactNode;

  /** Размер модального окна */
  size?: "sm" | "md" | "lg" | "full";

  /** Закрывать при клике на overlay */
  closeOnOverlayClick?: boolean;

  /** Показывать кнопку закрытия */
  showCloseButton?: boolean;

  /** CSS класс */
  className?: string;

  /** Анимация появления */
  animation?: "fade" | "slide-up" | "slide-down" | "zoom";
}

// ============================================================================
// Empty State Component
// ============================================================================

export interface EmptyStateProps {
  /** Заголовок */
  title: string;

  /** Описание */
  description?: string;

  /** Иллюстрация или иконка */
  illustration?: ReactNode;

  /** Действие (кнопка) */
  action?: {
    label: string;
    onClick: () => void;
  };

  /** CSS класс */
  className?: string;
}

// ============================================================================
// Error State Component (FR-020, FR-021: offline error)
// ============================================================================

export interface ErrorStateProps {
  /** Заголовок ошибки */
  title: string;

  /** Описание ошибки */
  description?: string;

  /** Иллюстрация */
  illustration?: ReactNode;

  /** Действие повтора */
  onRetry?: () => void;

  /** Текст кнопки повтора */
  retryLabel?: string;

  /** CSS класс */
  className?: string;

  /** Тип ошибки */
  type?: "network" | "server" | "not-found" | "generic";
}

// ============================================================================
// Utility Types
// ============================================================================

/** Общий тип для всех компонентов с children */
export interface WithChildren {
  children: ReactNode;
}

/** Общий тип для компонентов с className */
export interface WithClassName {
  className?: string;
}

/** Общий тип для disabled состояния */
export interface WithDisabled {
  disabled?: boolean;
}

/** Общий тип для loading состояния */
export interface WithLoading {
  loading?: boolean;
}

/** Responsive значения (mobile/tablet/desktop) */
export type ResponsiveValue<T> =
  | T
  | {
      mobile?: T;
      tablet?: T;
      desktop?: T;
    };

// ============================================================================
// Event Types
// ============================================================================

export type ClickHandler = () => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type FocusHandler = () => void;
export type BlurHandler = () => void;
export type SubmitHandler = (event: React.FormEvent) => void;

// ============================================================================
// Component State
// ============================================================================

export type ComponentState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error";

// ============================================================================
// Accessibility Attributes
// ============================================================================

export interface AccessibilityProps {
  /** ARIA label */
  ariaLabel?: string;

  /** ARIA describedby (для связи с описаниями, ошибками) */
  ariaDescribedBy?: string;

  /** ARIA labelledby */
  ariaLabelledBy?: string;

  /** ARIA role */
  role?: string;

  /** Tab index */
  tabIndex?: number;

  /** ARIA expanded (для раскрывающихся элементов) */
  ariaExpanded?: boolean;

  /** ARIA selected */
  ariaSelected?: boolean;

  /** ARIA disabled */
  ariaDisabled?: boolean;
}

// ============================================================================
// Animation Props
// ============================================================================

export interface AnimationProps {
  /** Анимировать появление */
  animateIn?: boolean;

  /** Длительность анимации */
  animationDuration?: number;

  /** Тип анимации */
  animationType?: "fade" | "slide" | "scale" | "none";

  /** Задержка перед анимацией */
  animationDelay?: number;
}

// ============================================================================
// Component Props Validation Rules
// ============================================================================

/**
 * Validation rules для компонентов:
 *
 * 1. Button:
 *    - minTouchTarget >= 44px на мобильном (FR-002)
 *    - onClick ДОЛЖЕН отреагировать в течение 100ms (FR-007)
 *
 * 2. Input:
 *    - label ОБЯЗАТЕЛЕН для accessibility
 *    - error и helperText используют aria-describedby
 *
 * 3. BottomNavigation:
 *    - items.length ДОЛЖНА быть 3-5 (согласно research)
 *    - position='fixed' рекомендуется для постоянной видимости
 *
 * 4. ProgressCircle:
 *    - value ДОЛЖНО быть 0-100 если showPercentage=true
 *
 * 5. Toast:
 *    - duration по умолчанию 3000ms (3 секунды)
 *    - position по умолчанию 'top-right'
 *
 * 6. Modal:
 *    - animation='slide-up' рекомендуется (согласно Animation Specs)
 *    - duration=300ms (FR-006)
 */
