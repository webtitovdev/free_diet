# Component & Design Token Contracts

Эта директория содержит TypeScript интерфейсы (контракты) для UI компонентов и Design Token System.

## Назначение

Контракты определяют:

- **Props интерфейсы** для всех UI компонентов
- **Type definitions** для Design Tokens
- **Validation rules** для соответствия требованиям (WCAG AA, FR-_, SC-_)
- **Event handlers** типы для type-safety

## Файлы

### component-contracts.ts

Содержит TypeScript интерфейсы для всех UI компонентов:

- **Layout Components**: Card, Container, Grid
- **Navigation Components**: BottomNavigation, TopHeader
- **Form Components**: Button, Input, Select
- **Feedback Components**: ProgressCircle, Toast, Skeleton, LoadingSpinner
- **Data Display**: MealCard, StatsCard
- **Modal Components**: Modal
- **State Components**: EmptyState, ErrorState

**Пример использования:**

```typescript
import { ButtonProps } from "@/specs/001-mobile-first-ui-redesign/contracts/component-contracts";

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  children,
  ariaLabel,
  ...props
}: ButtonProps) {
  // Implementation
}
```

### design-token-contracts.ts

Содержит TypeScript интерфейсы для Design Token System:

- **Color Tokens**: Brand, Semantic, Background, Text, Border colors
- **Spacing Tokens**: 0-24 scale (кратно 4px)
- **Typography Tokens**: Font families, sizes, weights, line heights
- **Border Radius Tokens**: none, sm, md, lg, xl, full
- **Shadow Tokens**: elevation levels
- **Breakpoint Tokens**: Mobile/Tablet/Desktop, media queries
- **Animation Tokens**: Durations, easings, transitions, presets
- **Accessibility Tokens**: Touch targets, contrast, focus, motion

**Пример использования:**

```typescript
import { DesignTokenSystem } from "@/specs/001-mobile-first-ui-redesign/contracts/design-token-contracts";

// В конфигурации Tailwind
export const tokens: DesignTokenSystem = {
  colors: {
    brand: {
      pastel: "#A8E6A3",
      light: "#C8F0C5",
      DEFAULT: "#2D6A4F",
      dark: "#1F4A37",
    },
    // ...
  },
  // ...
};
```

## Validation Rules

Контракты включают комментарии с validation rules:

### Color Tokens

- ✅ Все текстовые цвета ДОЛЖНЫ иметь контрастность 4.5:1 на white (WCAG AA)
- ✅ UI компоненты ДОЛЖНЫ иметь контрастность 3:1 (WCAG AA)
- ✅ Каждый цвет ДОЛЖЕН иметь dark theme variant

### Spacing Tokens

- ✅ Значения ДОЛЖНЫ быть кратны 4px
- ✅ Минимальный spacing между интерактивными элементами: 8px

### Typography Tokens

- ✅ Font size >= 14px (mobile), >= 16px (desktop) - FR-009
- ✅ Line height >= 1.5 для основного текста
- ✅ Font families ДОЛЖНЫ иметь fallback

### Button Component

- ✅ minTouchTarget >= 44px на мобильном - FR-002
- ✅ Visual feedback < 100ms - FR-007

### BottomNavigation Component

- ✅ items.length должна быть 3-5 (согласно research)
- ✅ position='fixed' рекомендуется

### Animation Tokens

- ✅ Длительность 200-300ms для transitions - FR-006
- ✅ Использовать transform и opacity для 60 FPS
- ✅ Поддержка prefers-reduced-motion

## Использование в Проекте

### Шаг 1: Импорт в Компонент

```typescript
// frontend/src/shared/ui/shadcn/Button.tsx
import { ButtonProps } from '@/specs/001-mobile-first-ui-redesign/contracts/component-contracts';

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Component implementation
};
```

### Шаг 2: Импорт в Design Tokens

```typescript
// frontend/src/shared/config/tokens.ts
import {
  DesignTokenSystem,
  ColorTokens,
  SpacingTokens,
} from "@/specs/001-mobile-first-ui-redesign/contracts/design-token-contracts";

export const designTokens: DesignTokenSystem = {
  colors: {
    /* ... */
  },
  spacing: {
    /* ... */
  },
  // ...
};
```

### Шаг 3: Интеграция с Tailwind CSS

```typescript
// tailwind.config.ts
import { designTokens } from "@/shared/config/tokens";

export default {
  theme: {
    extend: {
      colors: designTokens.colors,
      spacing: designTokens.spacing,
      // ...
    },
  },
};
```

## Type Safety Примеры

### 1. Type-Safe Color Usage

```typescript
import { ColorVariant } from "../contracts/component-contracts";

function getColorClass(variant: ColorVariant): string {
  const colorMap: Record<ColorVariant, string> = {
    brand: "bg-brand-DEFAULT",
    success: "bg-success",
    error: "bg-error",
    warning: "bg-warning",
    info: "bg-info",
  };

  return colorMap[variant];
}
```

### 2. Type-Safe Spacing Usage

```typescript
import { SpacingScale } from "../contracts/design-token-contracts";

function getSpacingClass(size: SpacingScale): string {
  return `p-${size}`;
}

// ✅ Type-safe: getSpacingClass(4) -> 'p-4'
// ❌ TypeScript error: getSpacingClass(7) -> не кратно 4
```

### 3. Responsive Props

```typescript
import { ResponsiveValue } from '../contracts/component-contracts';

interface GridProps {
  columns: ResponsiveValue<number>;
}

// ✅ Оба варианта валидны:
<Grid columns={3} />
<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} />
```

## Связь с Требованиями

Контракты напрямую связаны с требованиями из spec.md:

| Contract Rule               | Spec Requirement | Description                  |
| --------------------------- | ---------------- | ---------------------------- |
| `minTouchTarget >= 44px`    | FR-002           | Touch targets на мобильном   |
| `contrast >= 4.5:1`         | FR-016           | WCAG AA контрастность текста |
| `fontSize >= 14px (mobile)` | FR-009           | Минимальные размеры шрифтов  |
| `duration: 200-300ms`       | FR-006           | Длительность анимаций        |
| `feedback < 100ms`          | FR-007           | Визуальная обратная связь    |
| `items.length: 3-5`         | Research         | Bottom navigation items      |

## Обновление Контрактов

При изменении требований или добавлении новых компонентов:

1. Обновите соответствующий интерфейс в `component-contracts.ts` или `design-token-contracts.ts`
2. Добавьте validation rules в комментариях
3. Обновите примеры использования в этом README
4. Убедитесь что TypeScript компиляция проходит без ошибок

## Связанные Документы

- [spec.md](../spec.md) - Спецификация фичи с требованиями
- [data-model.md](../data-model.md) - Детальное описание entities
- [research.md](../research.md) - Исследование конкурентов и best practices
- [quickstart.md](../quickstart.md) - Руководство для разработчиков
