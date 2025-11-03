# Data Model: Mobile-First UI Redesign

**Дата**: 2025-11-04
**Фича**: 001-mobile-first-ui-redesign

Этот документ описывает ключевые entities (сущности) дизайн-системы, их поля, валидации и взаимосвязи. Все entities реализуются в `frontend/src/shared/config/`.

---

## 1. Design Token System

**Назначение**: Централизованная система переменных для обеспечения консистентности дизайна и упрощения будущих изменений.

**Расположение**: `frontend/src/shared/config/tokens.ts`

### 1.1 Color Tokens

#### Fields

```typescript
interface ColorTokens {
  // Brand Colors (Pastel Green Theme)
  brand: {
    pastel: string; // #A8E6A3 - Decorative, backgrounds
    light: string; // #C8F0C5 - Hover states на backgrounds
    DEFAULT: string; // #2D6A4F - WCAG Green для текста/UI
    dark: string; // #1F4A37 - Hover на интерактивных элементах
  };

  // Semantic Colors
  success: string; // #22C55E (Green)
  error: string; // #EF4444 (Red)
  warning: string; // #F59E0B (Amber)
  info: string; // #3B82F6 (Blue)

  // Background Colors
  background: {
    primary: string; // #FFFFFF (White) - основной фон
    secondary: string; // #F9FAFB (Gray-50) - альтернативный фон
    tertiary: string; // #F3F4F6 (Gray-100) - карточки, секции
  };

  // Text Colors
  text: {
    primary: string; // #1F2937 (Gray-800) - основной текст
    secondary: string; // #4B5563 (Gray-600) - вторичный текст
    disabled: string; // #9CA3AF (Gray-400) - disabled состояния
    inverse: string; // #FFFFFF - текст на темных фонах
  };

  // Border Colors
  border: {
    default: string; // #E5E7EB (Gray-200)
    focus: string; // brand.DEFAULT
    error: string; // error
  };

  // Dark Theme Variants (для темной темы)
  dark: {
    brand: {
      /* аналогичная структура */
    };
    background: {
      /* ... */
    };
    text: {
      /* ... */
    };
    border: {
      /* ... */
    };
  };
}
```

#### Validation Rules

- Все color values ДОЛЖНЫ быть в HEX формате (#RRGGBB)
- Комбинации text color на background ДОЛЖНЫ иметь контрастность минимум 4.5:1 (WCAG AA)
- Комбинации UI components на background ДОЛЖНЫ иметь контрастность минимум 3:1
- Каждый цвет ДОЛЖЕН иметь dark theme variant

#### Relationships

- Используется в **Component Library** для стилизации компонентов
- Связан с **Accessibility Configuration** через контрастность
- Импортируется в Tailwind config для генерации utility classes

---

### 1.2 Spacing Tokens

#### Fields

```typescript
interface SpacingTokens {
  0: "0px";
  1: "4px";
  2: "8px";
  3: "12px";
  4: "16px"; // Базовый spacing для карточек
  5: "20px";
  6: "24px"; // Max padding для карточек на мобильном
  8: "32px";
  10: "40px";
  12: "48px";
  16: "64px";
  20: "80px";
  24: "96px";
}
```

#### Validation Rules

- Значения ДОЛЖНЫ быть кратны 4px (для консистентности)
- Минимальный spacing между интерактивными элементами: 8px (spacing.2)

#### Relationships

- Используется в **Component Library** для margins, paddings, gaps
- Связан с **Accessibility Configuration** (touch target spacing)

---

### 1.3 Typography Tokens

#### Fields

```typescript
interface TypographyTokens {
  fontFamily: {
    sans: string[]; // ['Inter', 'system-ui', 'sans-serif']
    mono: string[]; // ['Fira Code', 'monospace']
  };

  fontSize: {
    xs: "12px"; // Вспомогательный текст
    sm: "14px"; // Маленький текст (мобильный основной)
    base: "16px"; // Основной текст (десктоп)
    lg: "18px"; // Крупный текст
    xl: "20px"; // Подзаголовки
    "2xl": "24px"; // H3 (мобильный)
    "3xl": "28px"; // H2 (мобильный)
    "4xl": "32px"; // H1 (мобильный)
    "5xl": "36px"; // H1 (десктоп)
  };

  fontWeight: {
    normal: 400;
    medium: 500;
    semibold: 600;
    bold: 700;
  };

  lineHeight: {
    tight: 1.25; // Заголовки
    normal: 1.5; // Основной текст
    relaxed: 1.75; // Длинный текст
  };

  letterSpacing: {
    tight: "-0.01em";
    normal: "0em";
    wide: "0.025em";
  };
}
```

#### Validation Rules

- fontFamily ДОЛЖНЫ иметь fallback fonts
- fontSize для основного текста ДОЛЖЕН быть минимум 14px на мобильном, 16px на десктопе
- lineHeight для основного текста ДОЛЖЕН быть минимум 1.5 (для читаемости)

#### Relationships

- Используется в **Component Library** для всех текстовых компонентов
- Связан с **Accessibility Configuration** (минимальные размеры текста)

---

### 1.4 Border Radius Tokens

#### Fields

```typescript
interface BorderRadiusTokens {
  none: "0px";
  sm: "4px"; // Маленькие элементы (badges)
  DEFAULT: "8px"; // Карточки, кнопки
  md: "12px"; // Средние карточки
  lg: "16px"; // Крупные изображения
  xl: "24px"; // Модальные окна
  full: "9999px"; // Круглые элементы (аватары, индикаторы)
}
```

#### Validation Rules

- Значения ДОЛЖНЫ быть кратны 4px (кроме `full`)
- Дефолтное значение для карточек: 8px или 16px (согласно research)

---

### 1.5 Shadow Tokens

#### Fields

```typescript
interface ShadowTokens {
  none: "none";
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)";
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)";
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)";
}
```

#### Validation Rules

- Shadows ДОЛЖНЫ быть subtle (opacity 0.05-0.1) для соответствия современным трендам
- На темных темах shadows ДОЛЖНЫ быть светлее или отключены

---

## 2. Breakpoint Configuration

**Назначение**: Определение точек переключения между мобильным, планшетным и десктопным представлениями.

**Расположение**: `frontend/src/shared/config/breakpoints.ts`

### 2.1 Fields

```typescript
interface BreakpointConfig {
  // Breakpoint values
  mobile: {
    min: 0;
    max: 767; // <768px
  };

  tablet: {
    min: 768;
    max: 1023; // 768-1024px
  };

  desktop: {
    min: 1024;
    max: Infinity; // >1024px
  };

  // Media queries (для использования в CSS/styled-components)
  mediaQueries: {
    mobile: "@media (max-width: 767px)";
    tablet: "@media (min-width: 768px) and (max-width: 1023px)";
    desktop: "@media (min-width: 1024px)";
    tabletAndUp: "@media (min-width: 768px)";
    desktopAndUp: "@media (min-width: 1024px)";
  };

  // Container max-widths
  containerMaxWidth: {
    mobile: "100%";
    tablet: "100%";
    desktop: "1200px"; // Max 1200-1400px согласно FR-013
  };

  // Touch target sizes by breakpoint
  touchTargetSize: {
    mobile: 44; // 44x44px минимум (FR-002)
    tablet: 40; // Немного меньше для планшетов
    desktop: 32; // 32x32px для desktop с мышью
  };
}
```

### 2.2 Validation Rules

- Breakpoints ДОЛЖНЫ не пересекаться (mobile.max + 1 === tablet.min)
- Touch target size на мобильном ДОЛЖЕН быть минимум 44px (WCAG, Apple HIG)
- Container max-width на десктопе ДОЛЖЕН быть 1200-1400px (FR-013)

### 2.3 State Transitions

```
User resizes browser window
↓
Window width changes
↓
if (width < 768px) → Apply mobile breakpoint
else if (width < 1024px) → Apply tablet breakpoint
else → Apply desktop breakpoint
↓
Re-render components with appropriate breakpoint styles
```

### 2.4 Relationships

- Используется в **Component Library** для responsive компонентов
- Связан с **Accessibility Configuration** (touch target sizes)
- Импортируется в Tailwind config для breakpoints

---

## 3. Component Library

**Назначение**: Набор переиспользуемых UI компонентов, заменяющих Ant Design.

**Расположение**: `frontend/src/shared/ui/shadcn/`

### 3.1 Component Categories

#### 3.1.1 Layout Components

```typescript
// Card Component
interface Card {
  variant: "default" | "outlined" | "elevated";
  padding: keyof SpacingTokens; // Ссылка на Spacing Tokens
  borderRadius: keyof BorderRadiusTokens;
  shadow: keyof ShadowTokens;
  children: ReactNode;
}

// Container Component
interface Container {
  maxWidth: keyof BreakpointConfig["containerMaxWidth"];
  padding: keyof SpacingTokens;
  children: ReactNode;
}
```

#### 3.1.2 Navigation Components

```typescript
// BottomNavigation Component (Critical для мобильного UX)
interface BottomNavigation {
  items: NavigationItem[]; // 3-5 items (согласно research)
  activeItem: string;
  onItemClick: (itemId: string) => void;
  position: "fixed" | "sticky"; // Fixed для постоянной видимости
}

interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  badge?: number; // Для уведомлений
}

// TopHeader Component
interface TopHeader {
  title: string;
  leftAction?: ReactNode; // Кнопка назад, меню
  rightAction?: ReactNode; // Действия, поиск
  sticky: boolean;
}
```

#### 3.1.3 Form Components

```typescript
// Button Component
interface Button {
  variant: "primary" | "secondary" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  disabled: boolean;
  loading: boolean;
  children: ReactNode;
  onClick: () => void;

  // Accessibility
  ariaLabel?: string;
  minTouchTarget: 44 | 40 | 32; // Из BreakpointConfig.touchTargetSize
}

// Input Component
interface Input {
  type: "text" | "email" | "password" | "number";
  label: string;
  placeholder?: string;
  error?: string;
  disabled: boolean;
  required: boolean;

  // Validation
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;

  // Accessibility
  ariaDescribedBy?: string; // Для error messages
}
```

#### 3.1.4 Feedback Components

```typescript
// Progress Circle (Yazio-style)
interface ProgressCircle {
  value: number; // 0-100
  max: number;
  label: string;
  size: "sm" | "md" | "lg";
  color: keyof ColorTokens["brand"];
  showPercentage: boolean;
}

// Toast Notification
interface Toast {
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration: number; // Auto-close после X ms
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading Skeleton (для медленных соединений)
interface Skeleton {
  variant: "text" | "circular" | "rectangular";
  width: string | number;
  height: string | number;
  animation: "pulse" | "wave";
}
```

### 3.2 Component State Management

Каждый компонент может иметь следующие состояния:

```typescript
type ComponentState =
  | "default" // Нормальное состояние
  | "hover" // Курсор наведен (desktop only)
  | "focus" // Фокус (клавиатура навигация)
  | "active" // Нажатие/touch
  | "disabled" // Недоступен
  | "loading" // Загрузка данных
  | "error"; // Ошибка валидации
```

### 3.3 Validation Rules

- Все интерактивные компоненты ДОЛЖНЫ иметь минимальный touch target 44x44px на мобильном
- Все компоненты ДОЛЖНЫ поддерживать keyboard navigation (accessibility)
- Все компоненты ДОЛЖНЫ иметь `aria-*` атрибуты где применимо
- Visual feedback на action ДОЛЖНА появляться в течение 100ms (FR-007)

### 3.4 Relationships

- Использует **Design Token System** для всех стилей
- Использует **Breakpoint Configuration** для responsive поведения
- Следует **Animation Specifications** для transitions
- Соответствует **Accessibility Configuration**

---

## 4. Animation Specifications

**Назначение**: Определение стандартных переходов, длительности анимаций и easing-функций.

**Расположение**: `frontend/src/shared/config/animations.ts`

### 4.1 Fields

```typescript
interface AnimationConfig {
  // Duration (FR-006: 200-300ms)
  duration: {
    fast: 150; // Micro-interactions (hover)
    normal: 200; // Стандартные transitions
    slow: 300; // Modal opening, slide-ins
  };

  // Easing functions
  easing: {
    ease: "ease";
    easeIn: "ease-in";
    easeOut: "ease-out";
    easeInOut: "ease-in-out"; // Рекомендуемая по умолчанию
    linear: "linear";
  };

  // Transition definitions
  transitions: {
    default: "all 200ms ease-in-out";
    color: "color 200ms ease-in-out";
    transform: "transform 200ms ease-in-out";
    opacity: "opacity 200ms ease-in-out";
    shadow: "box-shadow 200ms ease-in-out";
  };

  // Animation presets
  presets: {
    // Button press (FR-007: <100ms feedback)
    buttonPress: {
      duration: 100;
      property: "transform";
      from: "scale(1)";
      to: "scale(0.98)";
    };

    // Modal slide-up
    modalSlideUp: {
      duration: 300;
      property: "transform, opacity";
      from: "translateY(100%) opacity(0)";
      to: "translateY(0) opacity(1)";
    };

    // Fade in
    fadeIn: {
      duration: 200;
      property: "opacity";
      from: "opacity(0)";
      to: "opacity(1)";
    };

    // Skeleton pulse
    skeletonPulse: {
      duration: 1500;
      property: "opacity";
      keyframes: "0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; }";
      iteration: "infinite";
    };
  };

  // Accessibility
  respectReducedMotion: true; // Проверять prefers-reduced-motion
}
```

### 4.2 Validation Rules

- Длительность анимаций ДОЛЖНА быть 200-300ms для основных transitions (FR-006)
- Визуальная обратная связь ДОЛЖНА появляться в течение 100ms (FR-007)
- Анимации ДОЛЖНЫ использовать CSS transforms и opacity для 60 FPS (Performance Goal)
- ДОЛЖНА быть поддержка `prefers-reduced-motion` для accessibility

### 4.3 Performance Guidelines

```typescript
// РЕКОМЕНДУЕТСЯ: Use transform and opacity (GPU-accelerated)
✅ transition: transform 200ms ease-in-out;
✅ transition: opacity 200ms ease-in-out;

// ИЗБЕГАТЬ: Layout-triggering properties (CPU-heavy)
❌ transition: width 200ms;
❌ transition: height 200ms;
❌ transition: top/left 200ms;
```

### 4.4 Relationships

- Используется в **Component Library** для всех transitions
- Связан с **Accessibility Configuration** (reduced motion)

---

## 5. Accessibility Configuration

**Назначение**: Настройки для соответствия WCAG AA стандартам.

**Расположение**: `frontend/src/shared/config/accessibility.ts`

### 5.1 Fields

```typescript
interface AccessibilityConfig {
  // Touch Targets (WCAG, Apple HIG)
  touchTargets: {
    mobile: {
      minWidth: 44; // FR-002: минимум 44x44px
      minHeight: 44;
      spacing: 8; // Минимум 8px между targets
    };
    desktop: {
      minWidth: 32;
      minHeight: 32;
      spacing: 4;
    };
  };

  // Color Contrast (WCAG AA)
  contrast: {
    normalText: {
      min: 4.5; // FR-016: минимум 4.5:1
      wcagLevel: "AA";
    };
    largeText: {
      // 19px+ bold или 24px+ normal
      min: 3.0;
      wcagLevel: "AA";
    };
    uiComponents: {
      min: 3.0; // FR-016: минимум 3:1
      wcagLevel: "AA";
    };
  };

  // Focus Indicators
  focusIndicator: {
    outline: `2px solid ${ColorTokens.brand.DEFAULT}`;
    outlineOffset: "2px";
    borderRadius: "4px";
  };

  // Screen Reader
  screenReader: {
    srOnlyClass: "sr-only"; // Класс для visually hidden текста
    ariaLiveRegions: boolean; // Использовать aria-live для dynamic content
  };

  // Motion Preferences
  motion: {
    respectReducedMotion: true;
    reducedMotionClass: "motion-reduce";
  };

  // Font Sizes
  fontSize: {
    mobileMin: 14; // FR-009: минимум 14-16px на мобильном
    desktopMin: 16; // FR-009: минимум 16-18px на десктопе
  };
}
```

### 5.2 Validation Rules

- Touch targets на мобильном ДОЛЖНЫ быть минимум 44x44px (FR-002)
- Контрастность текста ДОЛЖНА быть минимум 4.5:1 (FR-016)
- Контрастность UI компонентов ДОЛЖНА быть минимум 3:1 (FR-016)
- Все интерактивные элементы ДОЛЖНЫ иметь visible focus indicator
- Размер шрифта ДОЛЖЕН быть минимум 14px на мобильном, 16px на десктопе (FR-009)

### 5.3 Testing Checklist

```typescript
interface AccessibilityTest {
  colorContrast: boolean; // Проверка через axe DevTools/WAVE
  touchTargets: boolean; // Проверка размеров через инспектор
  keyboardNav: boolean; // Ручная проверка Tab навигации
  screenReader: boolean; // Проверка через NVDA/VoiceOver
  focusIndicators: boolean; // Визуальная проверка outline
  semanticHTML: boolean; // Валидация HTML5 семантики
}
```

### 5.4 Relationships

- Влияет на все компоненты **Component Library**
- Использует **Design Token System** для цветовой контрастности
- Связан с **Breakpoint Configuration** для touch target sizes
- Связан с **Animation Specifications** для reduced motion

---

## 6. Migration Tracker Entity

**Назначение**: Отслеживание прогресса миграции от Ant Design к shadcn/ui.

**Расположение**: `specs/001-mobile-first-ui-redesign/migration-tracker.json` (опционально)

### 6.1 Fields

```typescript
interface MigrationTracker {
  pages: PageMigrationStatus[];
  components: ComponentMigrationStatus[];
  overallProgress: {
    totalPages: number;
    migratedPages: number;
    percentComplete: number;
  };
}

interface PageMigrationStatus {
  pagePath: string; // e.g., 'pages/diary'
  userStory: "US1" | "US2" | "US3" | "US4";
  priority: 1 | 2 | 3;
  status: "pending" | "in-progress" | "migrated" | "qa-approved";
  antdComponents: string[]; // Компоненты Ant Design на странице
  shadcnComponents: string[]; // Замененные на shadcn/ui
  qaApprover?: string; // Кто провел ручное QA (FR-022)
  qaDate?: string;
}

interface ComponentMigrationStatus {
  antdComponent: string; // e.g., 'Button', 'Card', 'Modal'
  shadcnEquivalent: string; // e.g., 'shadcn/Button'
  status: "mapped" | "migrated" | "not-needed";
  notes?: string;
}
```

### 6.2 State Transitions

```
Page starts: status = 'pending'
↓
Developer begins work: status = 'in-progress'
↓
Migration complete: status = 'migrated'
↓
QA approval (FR-022): status = 'qa-approved'
```

---

## 7. Entity Relationships Diagram

```
┌─────────────────────────┐
│  Design Token System    │
│  - Colors               │
│  - Spacing              │
│  - Typography           │
│  - Border Radius        │
│  - Shadows              │
└───────────┬─────────────┘
            │
            │ используется в
            ↓
┌─────────────────────────┐         ┌──────────────────────┐
│  Component Library      │────────→│  Breakpoint Config   │
│  - Layout Components    │ использует│  - Mobile/Tablet/    │
│  - Navigation           │         │    Desktop           │
│  - Forms                │         │  - Touch Targets     │
│  - Feedback             │         └──────────────────────┘
└───────────┬─────────────┘
            │
            │ следует
            ↓
┌─────────────────────────┐         ┌──────────────────────┐
│  Animation Specs        │────────→│  Accessibility       │
│  - Duration             │ учитывает│  - WCAG AA          │
│  - Easing               │         │  - Touch Targets     │
│  - Presets              │         │  - Contrast          │
└─────────────────────────┘         └──────────────────────┘
            ↑
            │
            │ отслеживается через
            │
┌─────────────────────────┐
│  Migration Tracker      │
│  - Page Status          │
│  - Component Mapping    │
│  - QA Approval          │
└─────────────────────────┘
```

---

## 8. Implementation Priority

Согласно FR-017, entities должны быть реализованы в следующем порядке:

1. **Phase 0 (Сейчас)**: Design Token System, Breakpoint Configuration
   - Критично для начала миграции любых компонентов

2. **Phase 1a - US1 (Мобильный опыт)**:
   - Component Library: Button, Card, BottomNavigation, ProgressCircle
   - Animation Specs: buttonPress, fadeIn
   - Accessibility Config: mobile touch targets

3. **Phase 1b - US2 (Навигация)**:
   - Component Library: TopHeader, Menu, Tabs
   - Animation Specs: modalSlideUp

4. **Phase 1c - US4 (Визуальный стиль)**:
   - Полная реализация Typography Tokens
   - Border Radius, Shadows finalization

5. **Phase 2 - US3 (Десктоп)**:
   - Desktop breakpoint optimization
   - Hover states, cursor-optimized components

---

**Статус**: ✅ Data Model Complete
**Следующий этап**: Создание quickstart.md для разработчиков
