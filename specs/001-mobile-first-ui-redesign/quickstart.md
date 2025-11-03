# Quickstart Guide: Mobile-First UI Redesign

**Дата**: 2025-11-04
**Фича**: 001-mobile-first-ui-redesign

Это руководство поможет разработчикам быстро начать работу с новой дизайн-системой на основе shadcn/ui + Tailwind CSS.

---

## Содержание

1. [Подготовка окружения](#1-подготовка-окружения)
2. [Настройка shadcn/ui](#2-настройка-shadcnui)
3. [Создание Design Tokens](#3-создание-design-tokens)
4. [Создание первого компонента](#4-создание-первого-компонента)
5. [Миграция с Ant Design](#5-миграция-с-ant-design)
6. [Тестирование Accessibility](#6-тестирование-accessibility)
7. [Best Practices](#7-best-practices)

---

## 1. Подготовка Окружения

### 1.1 Необходимые инструменты

Убедитесь что установлены:

```bash
node --version  # v18+ required
npm --version   # v9+ required
```

### 1.2 Установка зависимостей

```bash
cd frontend

# Установить Tailwind CSS v4 (если еще не установлен)
npm install tailwindcss@next @tailwindcss/postcss@next

# Установить shadcn/ui CLI
npx shadcn@latest init
```

### 1.3 Настройка VS Code (рекомендуется)

Установите расширения:

- **Tailwind CSS IntelliSense** - автодополнение для Tailwind классов
- **ESLint** - линтинг
- **Prettier** - форматирование
- **Error Lens** - показ ошибок inline

---

## 2. Настройка shadcn/ui

### 2.1 Инициализация shadcn/ui

При первом запуске `npx shadcn@latest init` выберите:

```
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Would you like to use CSS variables for colors? › yes
```

Это создаст:

- `frontend/src/lib/utils.ts` - утилиты (cn helper)
- `frontend/src/styles/globals.css` - глобальные стили с CSS variables
- `components.json` - конфигурация shadcn/ui

### 2.2 Настройка компонентов

Установите базовые компоненты:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add toast
```

Компоненты будут установлены в `frontend/src/shared/ui/shadcn/`.

### 2.3 Обновление Tailwind Config

Обновите `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";
import { designTokens } from "./src/shared/config/tokens";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: designTokens.colors,
      spacing: designTokens.spacing,
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      lineHeight: designTokens.typography.lineHeight,
      borderRadius: designTokens.borderRadius,
      boxShadow: designTokens.shadows,
      screens: {
        mobile: { max: "767px" },
        tablet: { min: "768px", max: "1023px" },
        desktop: { min: "1024px" },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 3. Создание Design Tokens

### 3.1 Структура файлов

Создайте структуру в `frontend/src/shared/config/`:

```
config/
├── tokens.ts           # Main export
├── colors.ts           # Color tokens
├── spacing.ts          # Spacing tokens
├── typography.ts       # Typography tokens
├── animations.ts       # Animation specs
├── breakpoints.ts      # Breakpoint config
└── accessibility.ts    # Accessibility config
```

### 3.2 Создание Color Tokens

`frontend/src/shared/config/colors.ts`:

```typescript
export const colorTokens = {
  brand: {
    pastel: "#A8E6A3", // Pastel green для backgrounds
    light: "#C8F0C5", // Hover states
    DEFAULT: "#2D6A4F", // WCAG Green (4.5:1 на white)
    dark: "#1F4A37", // Hover на интерактивных элементах
  },

  semantic: {
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },

  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB", // Gray-50
    tertiary: "#F3F4F6", // Gray-100
  },

  text: {
    primary: "#1F2937", // Gray-800 (4.5:1+ на white)
    secondary: "#4B5563", // Gray-600
    disabled: "#9CA3AF", // Gray-400
    inverse: "#FFFFFF",
  },

  border: {
    default: "#E5E7EB", // Gray-200
    focus: "#2D6A4F", // brand.DEFAULT
    error: "#EF4444", // semantic.error
  },
};

// Dark theme colors
export const darkColorTokens = {
  // TODO: Implement dark theme colors
};
```

**ВАЖНО**: Перед финализацией проверьте все цвета на контрастность:

- Используйте https://webaim.org/resources/contrastchecker/
- Text colors ДОЛЖНЫ иметь минимум 4.5:1 на фоне
- UI components ДОЛЖНЫ иметь минимум 3:1

### 3.3 Создание Spacing Tokens

`frontend/src/shared/config/spacing.ts`:

```typescript
export const spacingTokens = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px", // Base padding
  5: "20px",
  6: "24px", // Max padding для мобильных карточек
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;
```

### 3.4 Main Export

`frontend/src/shared/config/tokens.ts`:

```typescript
import { colorTokens, darkColorTokens } from "./colors";
import { spacingTokens } from "./spacing";
// ... импорты других tokens

export const designTokens = {
  colors: colorTokens,
  darkColors: darkColorTokens,
  spacing: spacingTokens,
  // ...
};

export type DesignTokens = typeof designTokens;
```

---

## 4. Создание Первого Компонента

### 4.1 Пример: Button Component

`frontend/src/shared/ui/shadcn/Button.tsx`:

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/specs/001-mobile-first-ui-redesign/contracts/component-contracts';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      children,
      onClick,
      type = 'button',
      ariaLabel,
      className,
      iconLeft,
      iconRight,
      ...props
    },
    ref
  ) => {
    // Variant styles
    const variantStyles = {
      primary: 'bg-brand-DEFAULT text-white hover:bg-brand-dark',
      secondary: 'bg-background-tertiary text-text-primary hover:bg-gray-200',
      outline: 'border-2 border-brand-DEFAULT text-brand-DEFAULT hover:bg-brand-pastel',
      ghost: 'text-brand-DEFAULT hover:bg-brand-pastel',
      danger: 'bg-error text-white hover:bg-red-600',
    };

    // Size styles
    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-DEFAULT font-medium',
          'transition-all duration-200 ease-in-out', // FR-006
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-DEFAULT',
          // Disabled
          disabled && 'opacity-50 cursor-not-allowed',
          // Loading
          loading && 'cursor-wait',
          // Full width
          fullWidth && 'w-full',
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Touch target (FR-002: минимум 44px на мобильном)
          'mobile:min-h-[44px] mobile:min-w-[44px]',
          // Custom className
          className
        )}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" />}
        {iconLeft && !loading && iconLeft}
        {children}
        {iconRight && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

### 4.2 Public API Export

`frontend/src/shared/ui/index.ts`:

```typescript
// shadcn/ui components
export { Button } from "./shadcn/Button";
export { Card } from "./shadcn/Card";
export { Input } from "./shadcn/Input";

// Legacy Ant Design (временно, на период миграции)
export * as AntdLegacy from "./legacy-antd";
```

---

## 5. Миграция с Ant Design

### 5.1 Подход к миграции

Следуйте **gradual migration strategy** согласно FR-017:

**Порядок приоритетов:**

1. **US1** - Экраны фото-захвата и дневного журнала (мобильный опыт)
2. **US2** - Навигационные компоненты
3. **US4** - Визуальные компоненты (карточки, типографика)
4. **US3** - Десктопные адаптации

### 5.2 Mapping компонентов

| Ant Design   | shadcn/ui Equivalent                          | Notes                                         |
| ------------ | --------------------------------------------- | --------------------------------------------- |
| `Button`     | `Button`                                      | Прямая замена, проверить размеры touch target |
| `Card`       | `Card`                                        | Проверить border-radius (8-16px)              |
| `Input`      | `Input`                                       | Добавить validation в real-time               |
| `Modal`      | `Dialog`                                      | Использовать slide-up animation (300ms)       |
| `Table`      | Кастомный компонент + `@tanstack/react-table` | Добавить virtualization если нужно            |
| `Select`     | `Select`                                      | Добавить searchable опцию                     |
| `DatePicker` | `Calendar` + `Popover`                        | Композиция компонентов                        |

### 5.3 Пример миграции страницы

**До (Ant Design):**

```typescript
// pages/diary/ui/DiaryPage.tsx
import { Card, Button } from 'antd';

export function DiaryPage() {
  return (
    <div>
      <Card>
        <Button type="primary">Добавить еду</Button>
      </Card>
    </div>
  );
}
```

**После (shadcn/ui):**

```typescript
// pages/diary/ui/DiaryPage.tsx
import { Card, Button } from '@/shared/ui';

export function DiaryPage() {
  return (
    <div className="p-4 mobile:p-6">
      <Card padding={4} borderRadius="md">
        <Button variant="primary" size="lg">
          Добавить еду
        </Button>
      </Card>
    </div>
  );
}
```

### 5.4 Изоляция Ant Design (переходный период)

`frontend/src/shared/ui/legacy-antd/index.ts`:

```typescript
// Реэкспорт Ant Design компонентов с префиксом
export {
  Button as AntdButton,
  Card as AntdCard,
  Input as AntdInput,
} from 'antd';

// Wrapper для применения design tokens к Ant Design
import { ConfigProvider } from 'antd';
import { designTokens } from '@/shared/config/tokens';

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: designTokens.colors.brand.DEFAULT,
          borderRadius: 8,
          // ...другие tokens
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
```

---

## 6. Тестирование Accessibility

### 6.1 Автоматическое тестирование (опционально)

Хотя FR-022 требует только ручное QA, можно использовать автоматические инструменты:

```bash
# Установить axe DevTools
npm install -D @axe-core/react

# В dev mode
import React from 'react';
if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

### 6.2 Ручное тестирование

**Чек-лист для каждого мигрированного компонента:**

#### Color Contrast

- [ ] Проверить через https://webaim.org/resources/contrastchecker/
- [ ] Text colors >= 4.5:1 на фоне
- [ ] UI components >= 3:1 на фоне

#### Touch Targets

- [ ] Мобильные элементы >= 44x44px
- [ ] Spacing между элементами >= 8px
- [ ] Проверить в DevTools (инспектор размеров)

#### Keyboard Navigation

- [ ] Tab через все интерактивные элементы
- [ ] Enter/Space активируют кнопки
- [ ] Escape закрывает модальные окна
- [ ] Focus indicator видим (outline)

#### Screen Reader

- [ ] Проверить с NVDA (Windows) или VoiceOver (Mac)
- [ ] Все интерактивные элементы имеют `aria-label`
- [ ] Ошибки связаны с полями через `aria-describedby`

#### Responsive

- [ ] Тест на 375px (iPhone SE)
- [ ] Тест на 768px (iPad)
- [ ] Тест на 1024px+ (Desktop)
- [ ] Portrait и Landscape ориентации

---

## 7. Best Practices

### 7.1 Использование Design Tokens

**✅ DO:**

```typescript
// Использовать tokens через Tailwind classes
<div className="bg-brand-DEFAULT text-white p-4 rounded-md">

// Или импортировать напрямую (в JS логике)
import { designTokens } from '@/shared/config/tokens';
const brandColor = designTokens.colors.brand.DEFAULT;
```

**❌ DON'T:**

```typescript
// Не использовать hardcoded colors
<div style={{ background: '#2D6A4F' }}>

// Не использовать inline styles для tokens
<div style={{ padding: '16px' }}>
```

### 7.2 Mobile-First Подход

**✅ DO:**

```typescript
// Начинать с мобильных стилей, добавлять desktop
<Button
  size="md"
  className="w-full desktop:w-auto"
>
  Добавить
</Button>
```

**❌ DON'T:**

```typescript
// Desktop-first подход
<Button
  size="lg"
  className="w-auto mobile:w-full"
>
```

### 7.3 Animations

**✅ DO:**

```typescript
// Использовать CSS transitions
<div className="transition-all duration-200 ease-in-out hover:scale-105">

// Уважать prefers-reduced-motion
<div className="motion-safe:animate-fade-in">
```

**❌ DON'T:**

```typescript
// Layout-triggering properties
<div className="transition-[width,height]">

// Игнорировать reduced motion
<div className="animate-bounce">
```

### 7.4 Accessibility

**✅ DO:**

```typescript
<Button ariaLabel="Добавить новый прием пищи">
  <PlusIcon />
</Button>

<Input
  label="Email"
  error="Некорректный email"
  ariaDescribedBy="email-error"
/>
```

**❌ DON'T:**

```typescript
<button>
  <PlusIcon /> {/* Нет aria-label для icon-only */}
</button>

<input placeholder="Email" /> {/* Нет label */}
```

### 7.5 Performance

**✅ DO:**

```typescript
// Использовать transform и opacity
<div className="hover:translate-y-[-2px] hover:opacity-80">

// Lazy load тяжелых компонентов
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

**❌ DON'T:**

```typescript
// Использовать layout properties
<div className="hover:mt-[-2px]">

// Загружать все сразу
import { HeavyComponent } from './HeavyComponent';
```

---

## 8. Workflow разработки

### 8.1 Создание нового компонента

```bash
# 1. Установить shadcn/ui компонент (если есть)
npx shadcn@latest add button

# 2. Кастомизировать под наши design tokens
# Редактировать frontend/src/shared/ui/shadcn/Button.tsx

# 3. Добавить TypeScript интерфейс (если нет в contracts)
# Добавить в specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts

# 4. Экспортировать из public API
# Добавить в frontend/src/shared/ui/index.ts

# 5. Написать пример использования
# Создать frontend/src/shared/ui/shadcn/Button.stories.tsx (опционально)
```

### 8.2 Миграция существующей страницы

```bash
# 1. Открыть страницу для миграции
# Например: frontend/src/pages/diary/ui/DiaryPage.tsx

# 2. Заменить импорты Ant Design на shadcn/ui
# import { Button } from 'antd' → import { Button } from '@/shared/ui'

# 3. Обновить props компонентов согласно новым контрактам
# type="primary" → variant="primary"

# 4. Добавить responsive classes
# className="mt-4 desktop:mt-6"

# 5. Проверить accessibility
# Добавить aria-label, проверить contrast, touch targets

# 6. Ручное QA (FR-022)
# Проверить визуально на всех breakpoints

# 7. Обновить Migration Tracker (опционально)
# Отметить страницу как 'migrated' в migration-tracker.json
```

---

## 9. Troubleshooting

### Проблема: Tailwind classes не применяются

**Решение:**

```bash
# Проверить что content paths корректны в tailwind.config.ts
content: ['./src/**/*.{ts,tsx}']

# Перезапустить dev server
npm run dev
```

### Проблема: Конфликты между Ant Design и Tailwind CSS

**Решение:**

```typescript
// Изолировать Ant Design в отдельной папке
// frontend/src/shared/ui/legacy-antd/

// Использовать CSS modules для Ant Design компонентов
import styles from "./AntdWrapper.module.css";
```

### Проблема: Touch targets меньше 44px на мобильном

**Решение:**

```typescript
// Добавить mobile: классы
className = "h-10 mobile:min-h-[44px] mobile:min-w-[44px]";
```

---

## 10. Полезные ссылки

- **shadcn/ui Docs**: https://ui.shadcn.com
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Apple HIG (Touch Targets)**: https://developer.apple.com/design/human-interface-guidelines/inputs

---

## 11. Получение помощи

Если возникли вопросы:

1. Прочитайте [research.md](./research.md) для понимания решений
2. Проверьте [data-model.md](./data-model.md) для детализации entities
3. Посмотрите [contracts/](./contracts/) для TypeScript интерфейсов
4. Обратитесь к дизайнеру для визуальных вопросов
5. Обратитесь к QA для вопросов accessibility

---

**Статус**: ✅ Quickstart Guide Complete
**Следующий этап**: Обновление agent context через скрипт
