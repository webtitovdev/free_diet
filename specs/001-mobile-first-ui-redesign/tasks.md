# Tasks: Mobile-First UI Redesign

**Input**: Design documents from `/specs/001-mobile-first-ui-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Ручное QA согласно FR-022. Автоматизированные тесты НЕ требуются.

**Organization**: Задачи организованы по user stories для независимой реализации и тестирования каждой истории.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: К какой user story относится задача (US1, US2, US3, US4)
- Точные пути к файлам включены в описания

## Path Conventions

Используется структура Web App согласно plan.md:

- **Frontend**: `frontend/src/`
- **Backend**: Не затрагивается в этой фиче
- **FSD структура**: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`

---

## Phase 1: Setup (Инициализация проекта)

**Purpose**: Установка и настройка shadcn/ui + Tailwind CSS v4

- [x] T001 Установить зависимости shadcn/ui и Tailwind CSS v4 в frontend/package.json (npx shadcn@latest init, npm install tailwindcss@next @tailwindcss/postcss@next)
- [x] T002 Создать базовую конфигурацию shadcn/ui в frontend/components.json с настройками (style: Default, base color: Slate, CSS variables: yes)
- [x] T003 Создать utility функцию cn helper в frontend/src/shared/lib/utils.ts для объединения Tailwind классов
- [x] T004 [P] Обновить TypeScript конфигурацию frontend/tsconfig.json с path aliases (@/ для src/)
- [x] T005 [P] Настроить структуру директорий для dual-architecture: frontend/src/shared/ui/shadcn/ (новые компоненты) и frontend/src/shared/ui/legacy-antd/ (временно для Ant Design)

---

## Phase 2: Foundational (Блокирующие prerequisite - КРИТИЧНО)

**Purpose**: Создание Design Token System и базовой инфраструктуры. ДОЛЖНО быть завершено перед ЛЮБОЙ user story.

**⚠️ CRITICAL**: Все user stories зависят от этой фазы. Работа над US1-US4 может начаться только после завершения Phase 2.

### Design Token System

- [x] T006 [P] Создать интерфейсы color tokens в src/shared/config/colors.ts с brand (pastel, light, DEFAULT, dark), semantic (success, error, warning, info), background, text, border цветами согласно design-token-contracts.ts
- [x] T007 [P] Создать spacing tokens в src/shared/config/spacing.ts со значениями 0-24 кратными 4px согласно SpacingTokens интерфейсу
- [x] T008 [P] Создать typography tokens в src/shared/config/typography.ts с fontFamily (Inter + fallbacks), fontSize (xs-5xl), fontWeight, lineHeight, letterSpacing согласно TypographyTokens интерфейсу
- [x] T009 [P] Создать border-radius tokens в src/shared/config/border-radius.ts со значениями none, sm, DEFAULT (8px), md, lg, xl, full согласно BorderRadiusTokens интерфейсу
- [x] T010 [P] Создать shadow tokens в src/shared/config/shadows.ts с elevation levels (none, sm, DEFAULT, md, lg, xl) с opacity 0.05-0.1 согласно ShadowTokens интерфейсу

### Breakpoint & Animation Configuration

- [x] T011 [P] Создать breakpoint configuration в src/shared/config/breakpoints.ts с mobile (<768px), tablet (768-1024px), desktop (>1024px), mediaQueries, containerMaxWidth, touchTargetSize согласно BreakpointTokens интерфейсу
- [x] T012 [P] Создать animation specifications в src/shared/config/animations.ts с duration (fast: 150ms, normal: 200ms, slow: 300ms), easing, transitions, presets (buttonPress, modalSlideUp, fadeIn, skeletonPulse) согласно AnimationTokens интерфейсу
- [x] T013 [P] Создать accessibility configuration в src/shared/config/accessibility.ts с touchTargets (mobile: 44x44px, desktop: 32x32px), contrast requirements (4.5:1 text, 3:1 UI), focusIndicator, motion preferences согласно AccessibilityTokens интерфейсу

### Main Token Export & Tailwind Integration

- [x] T014 Создать главный export design tokens в src/shared/config/tokens.ts который импортирует и экспортирует все token файлы как DesignTokenSystem согласно design-token-contracts.ts
- [x] T015 Обновить Tailwind конфигурацию в tailwind.config.ts с импортом designTokens и настройкой theme.extend (colors, spacing, fontSize, fontWeight, lineHeight, borderRadius, boxShadow, screens) согласно quickstart.md секции 2.3
- [x] T016 [P] Создать глобальные стили в src/app/globals.css с CSS variables для light и dark тем, базовыми стилями body, и Tailwind директивами (@tailwind base, components, utilities)
- [x] T017 [P] Проверить все color combinations на контрастность с помощью WebAIM Contrast Checker (WCAG Green #2D6A4F подобран для 4.5:1 на white)

### Theme Provider & Dual-Architecture Setup

- [x] T018 Создать Theme Provider в src/app/providers/ThemeProvider.tsx с поддержкой light/dark режимов через CSS variables и localStorage persistence
- [x] T019 Создать Ant Design wrapper provider в src/shared/ui/legacy-antd/AntdThemeProvider.tsx с ConfigProvider который применяет design tokens к Ant Design компонентам для визуальной консистентности в переходный период согласно quickstart.md секции 5.4
- [x] T020 Обновить root layout в src/app/layout.tsx с импортом globals.css и оборачиванием children в ThemeProvider и AntdThemeProvider

**Checkpoint**: Foundation готова - user story реализация может начаться параллельно

---

## Phase 3: User Story 1 - Мобильный опыт фото-подсчета калорий (Priority: P1) 🎯 MVP

**Goal**: Интуитивный мобильный интерфейс для фото-захвата еды и просмотра дневника с крупными элементами (44x44px touch targets), карточным форматом и плавными анимациями

**Independent Test**: Открыть приложение на мобильном устройстве (<768px), сфотографировать еду, убедиться что интерфейс адаптивен, кнопки >= 44x44px доступны для нажатия пальцем, процесс занимает < 30 секунд, анимации плавные (<300ms)

### Core Components для US1

- [x] T021 [P] [US1] Создать Button компонент в frontend/src/shared/ui/shadcn/Button.tsx с variants (primary, secondary, outline, ghost, danger), sizes (sm, md, lg), loading состоянием, fullWidth опцией, минимальным touch target 44x44px на мобильном согласно ButtonProps интерфейсу и quickstart.md секции 4.1
- [x] T022 [P] [US1] Создать Card компонент в frontend/src/shared/ui/shadcn/Card.tsx с variants (default, outlined, elevated), configurable padding/borderRadius/shadow, interactive опцией с hover эффектами согласно CardProps интерфейсу
- [x] T023 [P] [US1] Создать ProgressCircle компонент в frontend/src/shared/ui/shadcn/ProgressCircle.tsx с размерами (sm, md, lg, xl), цветами, showPercentage/showValue опциями, animated transitions согласно ProgressCircleProps интерфейсу (Yazio-style круговые индикаторы)
- [x] T024 [US1] Создать LoadingSpinner компонент в frontend/src/shared/ui/shadcn/LoadingSpinner.tsx с размерами, цветами, fullScreen опцией для использования в Button loading состояниях согласно LoadingSpinnerProps интерфейсу

### MealCard Widget (Critical для дневника)

- [x] T025 [US1] Создать MealCard widget в frontend/src/widgets/meal-card/ui/MealCard.tsx с imageUrl, calories, macros (protein/carbs/fat), timestamp, onClick/onEdit/onDelete handlers, variants (compact, detailed) согласно MealCardProps интерфейсу с использованием Card и Button компонентов
- [x] T026 [US1] Стилизовать MealCard с border-radius 8-16px, box-shadow для глубины, responsive layout (полная ширина на мобильном с padding 16-24px), макронутриенты с цветовой кодировкой (protein: синий, carbs: желтый, fat: оранжевый) согласно research.md (Lifesum pattern)

### Diary Page Migration (Критичный экран для 90% пользователей)

- [x] T027 [US1] Мигрировать Diary страницу с Ant Design на shadcn/ui в frontend/src/pages/diary/ui/DiaryPage.tsx: заменить Ant Design List на нативный map с MealCard компонентами, заменить Ant Design Button на shadcn/ui Button, добавить mobile-first стили (p-4 mobile:p-6)
- [x] T028 [US1] Добавить ProgressCircle компоненты на Diary страницу для отображения дневного прогресса калорий (calories eaten / remaining / burned) в верхней части экрана согласно research.md (Lifesum visual hierarchy pattern)
- [x] T029 [US1] Реализовать плавную прокрутку списка приемов пищи на Diary странице с scroll-smooth behavior, fade-in анимациями для MealCard (200ms ease-in-out) согласно FR-006, lazy loading для оптимизации производительности

### Visual Feedback & Touch Optimization

- [x] T030 [US1] Добавить визуальную обратную связь < 100ms на все интерактивные элементы US1: Button hover/active states (scale 0.98 transform), MealCard ripple effect при клике, touch feedback через active:scale-[0.98] согласно FR-007 и animations.ts buttonPress preset
- [x] T031 [US1] Валидировать touch targets на мобильном: все кнопки и интерактивные элементы >= 44x44px (mobile:min-h-[44px] mobile:min-w-[44px]), spacing между элементами >= 8px согласно FR-002 и accessibility.ts touchTargets.mobile config

**Checkpoint**: User Story 1 полностью функциональна и testable независимо. Можно деплоить как MVP.

---

## Phase 4: User Story 2 - Навигация и общий UX по паттернам конкурентов (Priority: P1)

**Goal**: Знакомая структура навигации с bottom navigation bar (3-5 items), центральной CTA кнопкой добавления еды, графиками прогресса как в MyFitnessPal/Yazio/Lifesum

**Independent Test**: Открыть приложение, проверить наличие bottom navigation с 3-5 разделами (Дневник, Добавить, Прогресс, Профиль), центральная кнопка добавления визуально выделена, навигация интуитивно понятна без обучения

### Navigation Components

- [x] T032 [P] [US2] Создать BottomNavigation компонент в frontend/src/widgets/navigation/ui/BottomNavigation.tsx с 3-5 items (id, label, icon, href, badge), activeItem highlighting, onItemClick handler, position (fixed/sticky/static), showLabels опцией согласно BottomNavigationProps интерфейсу и research.md (MyFitnessPal/Instagram pattern)
- [x] T033 [P] [US2] Создать TopHeader компонент в frontend/src/widgets/header/ui/TopHeader.tsx с title, leftAction (кнопка назад/меню), rightAction (поиск/настройки), sticky positioning при скролле, showShadowOnScroll согласно TopHeaderProps интерфейсу
- [x] T034 [US2] Стилизовать BottomNavigation с fixed positioning внизу экрана, height 64-72px на мобильном для удобного thumb access, активный item с brand.DEFAULT цветом и scale animation, неактивные items с text.secondary цветом согласно research.md thumb-friendly design

### Main Navigation Integration

- [x] T035 [US2] Создать конфигурацию navigation items в frontend/src/widgets/navigation/config/navigationItems.tsx с 4 основными разделами: Дневник (diary icon, href: /diary), Добавить (plus icon в центре, href: /add-meal, выделен размером/цветом), Прогресс (chart icon, href: /progress), Профиль (user icon, href: /profile) согласно research.md section 5.1
- [x] T036 [US2] Интегрировать BottomNavigation в root layout frontend/src/app/layout.tsx для отображения на всех страницах кроме auth routes, передать текущий активный route из usePathname hook
- [x] T037 [US2] Интегрировать TopHeader в main route group layout frontend/src/app/(main)/layout.tsx с динамическим title на основе текущей страницы, leftAction (меню icon), rightAction (notification bell icon)

### Central CTA (FAB) для добавления еды

- [x] T038 [US2] Создать FAB (Floating Action Button) вариант Button компонента в frontend/src/shared/ui/shadcn/Button.tsx с круглой формой (rounded-full), размером 56x56px на мобильном (touch-friendly), shadow-lg, fixed positioning, z-index высокий, animated scale hover согласно research.md section 5.2 (главная CTA должна быть самой доступной)
- [x] T039 [US2] Разместить центральную кнопку "Добавить еду" в BottomNavigation как средний item с визуальным выделением (больший размер, elevated shadow, brand.DEFAULT background) или как отдельный FAB в правом нижнем углу согласно research.md MyFitnessPal critique

### Progress Visualization (Графики и диаграммы)

- [x] T040 [P] [US2] Создать StatsCard компонент в frontend/src/shared/ui/shadcn/StatsCard.tsx с title, value, unit, icon, color, trend (value, direction: up/down/neutral) согласно StatsCardProps интерфейсу для отображения статистики
- [x] T041 [US2] Создать Progress страницу в frontend/src/pages/progress/ui/ProgressPage.tsx с использованием ProgressCircle компонентов для макронутриентов (protein, carbs, fat) с цветовой кодировкой согласно research.md Lifesum color-coding pattern, StatsCard для weekly/monthly trends

**Checkpoint**: User Stories 1 И 2 работают независимо. Навигация функциональна.

---

## Phase 5: User Story 4 - Визуальный стиль по референсам конкурентов (Priority: P1)

**Goal**: Современный чистый интерфейс с пастельным зеленым акцентом (WCAG AA), типографической системой, скругленными углами, тенями, плавными анимациями 200-300ms

**Independent Test**: Визуальное сравнение с топ-3 конкурентами по критериям: цветовая схема (pastel green используется консистентно), типографика (Inter 14-16px mobile, 16-18px desktop), spacing (16-24px card padding), скругления (8-16px), тени (subtle elevation)

### Typography System Implementation

- [x] T042 [P] [US4] Загрузить Inter font family в frontend/src/app/styles/fonts.ts через @next/font или local files с font-weights 400, 500, 600, 700 и настроить variable font для оптимизации согласно typography tokens fontFamily
- [x] T043 [P] [US4] Создать Typography компоненты в frontend/src/shared/ui/shadcn/Typography.tsx: Heading (h1-h6 с адаптивными размерами mobile: 24-32px, desktop: 28-36px), Text (body text с sizes sm/base/lg), Caption (xs для вспомогательного текста) согласно fontSize tokens и FR-009
- [x] T044 [US4] Применить Typography систему ко всем текстовым элементам в мигрированных компонентах (Button, Card, MealCard, StatsCard, TopHeader, BottomNavigation): заменить hardcoded font sizes на Typography компоненты или Tailwind typography classes. Mapping к FR-009: text-sm (14px mobile), text-base (16px mobile/desktop), text-lg (18px desktop) для основного текста

### Visual Elements & Feedback Components

- [x] T045 [P] [US4] Создать Skeleton компонент в frontend/src/shared/ui/shadcn/Skeleton.tsx с variants (text, circular, rectangular), width/height configurable, animation (pulse/wave/none), lines опцией для text variant согласно SkeletonProps интерфейсу. Используется для loading состояний при низкой скорости интернета (edge case) и улучшения воспринимаемой производительности согласно FR-023
- [x] T046 [P] [US4] Создать Toast notification компонент в frontend/src/shared/ui/shadcn/Toast.tsx с types (success, error, warning, info), duration auto-close, action button, positions (top/bottom left/center/right) согласно ToastProps интерфейсу с использованием Radix Toast primitives
- [x] T047 [US4] Создать EmptyState компонент в frontend/src/shared/ui/shadcn/EmptyState.tsx с title, description, illustration placeholder, action button согласно EmptyStateProps интерфейсу для пустых списков (например, "Нет приемов пищи сегодня")
- [x] T048 [US4] Создать ErrorState компонент в frontend/src/shared/ui/shadcn/ErrorState.tsx с title, description, illustration, onRetry handler, retryLabel, type (network/server/not-found/generic) согласно ErrorStateProps интерфейсу для обработки FR-020, FR-021 offline error

### Dark Theme Support

- [x] T049 [P] [US4] Реализовать dark theme color tokens в frontend/src/shared/config/colors.ts с dark variants для всех цветов: background (темные gray), text (светлые gray), shadows (светлее или отключены) согласно DarkThemeColorTokens интерфейсу
- [x] T050 [US4] Добавить dark mode переключение в ThemeProvider frontend/src/app/providers/ThemeProvider.tsx с localStorage persistence, system preference detection (prefers-color-scheme), toggle функцией и CSS class application (dark class на html element)
- [x] T051 [US4] Применить dark: variants ко всем компонентам (Button, Card, Input, etc.): dark:bg-_, dark:text-_, dark:border-\* Tailwind classes для корректного отображения в темной теме согласно FR-008

### Visual Polish

- [x] T052 [US4] Валидировать визуальную консистентность всех компонентов: border-radius 8-16px на всех Card/MealCard/Modal, box-shadow elevation levels применены корректно (sm для buttons, md для cards, lg для modals), spacing 16-24px padding на мобильных карточках согласно design tokens
- [x] T053 [US4] Добавить micro-interactions ко всем интерактивным элементам: ripple effect на touch (active state), scale animations (0.98) на button press, smooth color transitions 200ms ease-in-out согласно animation presets и FR-006, FR-007

**Checkpoint**: Визуальный стиль применен консистентно. All user stories имеют modern clean look.

---

## Phase 6: User Story 3 - Десктопная версия (Priority: P2)

**Goal**: Адаптация интерфейса для больших экранов (>1024px) с центрированным контентом max-width 1200-1400px, hover эффектами, grid layouts

**Independent Test**: Открыть приложение на экране >1024px, убедиться что контент центрирован (не растягивается на всю ширину), присутствуют hover эффекты на интерактивных элементах, grid layouts используют горизонтальное пространство

### Layout Components для Desktop

- [ ] T054 [P] [US3] Создать Container компонент в frontend/src/shared/ui/shadcn/Container.tsx с maxWidth (mobile: 100%, tablet: 100%, desktop: 1200px), padding configurable, centered опцией согласно ContainerProps интерфейсу и FR-013
- [ ] T055 [P] [US3] Создать Grid компонент в frontend/src/shared/ui/shadcn/Grid.tsx с responsive columns ({ mobile: 1, tablet: 2, desktop: 3 }), gap configurable согласно GridProps интерфейсу для multi-column layouts на desktop
- [ ] T056 [US3] Обернуть контент всех страниц (Diary, Progress, Profile) в Container компонент с maxWidth="desktop" для центрирования на широких экранах согласно FR-013

### Desktop-Specific Adaptations

- [ ] T057 [P] [US3] Добавить hover эффекты для desktop ко всем интерактивным элементам: Button (hover:brightness-110, cursor-pointer), Card (hover:shadow-lg transition), MealCard (hover:scale-[1.02]), навигационные items (hover:bg-gray-100) используя desktop: breakpoint согласно research.md section 5.7
- [ ] T058 [US3] Адаптировать Diary страницу для desktop: использовать Grid layout с 2-3 колонками для MealCard компонентов вместо vertical списка, ProgressCircle компоненты разместить в sidebar или top bar согласно research.md desktop adaptation patterns
- [ ] T059 [US3] Скрыть BottomNavigation на desktop (desktop:hidden) и добавить sidebar или top navigation для desktop пользователей с теми же navigation items но в горизонтальном layout согласно responsive navigation patterns

### Desktop Input Optimization

- [ ] T060 [P] [US3] Создать Input компонент в frontend/src/shared/ui/shadcn/Input.tsx с label, placeholder, error, helperText, disabled/required states, value/onChange/onBlur handlers, icon support, ariaDescribedBy согласно InputProps интерфейсу
- [ ] T061 [P] [US3] Создать Select компонент в frontend/src/shared/ui/shadcn/Select.tsx с options, value, onChange, searchable опцией, multiple select support согласно SelectProps интерфейсу с использованием Radix Select primitives
- [ ] T062 [US3] Оптимизировать Input/Select для desktop: размеры курсор-friendly (min 32x32px), hover states, focus ring более выраженный, placeholder hints более заметные согласно desktop UX best practices

**Checkpoint**: Desktop адаптация завершена. All user stories работают на mobile, tablet, desktop.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Финализация миграции, удаление Ant Design, QA, performance optimization

### Ant Design Removal (FR-019)

- [ ] T063 Аудит всех страниц и компонентов на использование Ant Design: grep -r "from 'antd'" frontend/src/, составить список оставшихся не мигрированных компонентов
- [ ] T064 Мигрировать оставшиеся компоненты с Ant Design на shadcn/ui согласно mapping таблице из quickstart.md section 5.2 (Modal -> Dialog, Table -> custom + @tanstack/react-table, DatePicker -> Calendar + Popover, etc.)
- [ ] T065 Удалить Ant Design из зависимостей: npm uninstall antd в frontend/, удалить AntdThemeProvider из layout.tsx, удалить директорию frontend/src/shared/ui/legacy-antd/
- [ ] T066 Удалить Ant Design CSS imports и ConfigProvider из всех файлов, проверить что bundle size уменьшился на ~35% согласно research.md case study

### Manual QA (FR-022)

- [ ] T067 Ручная QA проверка всех мигрированных экранов на визуальное соответствие дизайну: размеры шрифтов (14-16px mobile, 16-18px desktop), отступы (16-24px card padding), цвета (pastel green акцент, WCAG AA контраст), тени (subtle elevation), скругления (8-16px) согласно visual QA checklist в quickstart.md section 6.2
- [ ] T068 Проверить accessibility на всех страницах: touch targets >= 44x44px на мобильном через DevTools inspector, color contrast >= 4.5:1 для текста через WebAIM Contrast Checker, keyboard navigation работает (Tab, Enter, Escape), focus indicators видимы согласно FR-002, FR-016, accessibility.ts config
- [ ] T069 Тестировать на всех breakpoints: mobile 375px (iPhone SE), tablet 768px (iPad), desktop 1024px+ (MacBook), portrait и landscape ориентации. Проверить смену ориентации portrait ↔ landscape без потери введенных данных в формах согласно FR-015. Убедиться в отсутствии horizontal scroll и обрезанного контента согласно FR-001, SC-005
- [ ] T070 Проверить offline behavior: отключить интернет, убедиться что ErrorState компонент показывает понятное сообщение с иллюстрацией и кнопкой "Попробовать снова", весь функционал блокирован до восстановления связи согласно FR-020, FR-021

### Performance Optimization

- [ ] T071 [P] Измерить и оптимизировать Core Web Vitals: First Contentful Paint (FCP) < 1.8s на мобильном, Time to Interactive (TTI) < 3s на 4G, использовать Lighthouse для анализа согласно Performance Goals из plan.md
- [ ] T072 [P] Оптимизировать JavaScript bundle size: проверить что bundle < 200KB gzipped для мобильной версии, использовать webpack-bundle-analyzer, применить code splitting по routes, lazy loading для тяжелых компонентов (Charts, Modals) согласно Performance Budget
- [ ] T073 Оптимизировать изображения: использовать modern форматы (WebP, AVIF) с fallback на JPEG/PNG, responsive images с srcset, lazy loading для images в MealCard согласно research.md section 5.7
- [ ] T074 Валидировать анимации работают на 60 FPS: использовать Chrome DevTools Performance tab, проверить что все анимации используют CSS transforms и opacity (GPU-accelerated), избегать layout-triggering properties (width, height, top, left) согласно animations.ts performance guidelines
- [ ] T074b Валидировать визуальную обратную связь <= 100ms через Performance Observer API: измерить event → visual response delay для кнопок, inputs, cards, использовать performance.mark() и performance.measure() для замера времени между user interaction и DOM update согласно SC-004

### Documentation & Migration Tracking

- [ ] T075 [P] Создать migration tracker опционально в specs/001-mobile-first-ui-redesign/migration-tracker.json с статусами всех страниц (pending, in-progress, migrated, qa-approved), компонентов Ant Design -> shadcn/ui mapping, QA approver names согласно MigrationTracker entity из data-model.md
- [ ] T076 [P] Обновить CLAUDE.md проекта вручную (или через скрипт .specify/scripts/powershell/update-agent-context.ps1 если доступен): заменить "N/A" на "shadcn/ui + Tailwind CSS" в Active Technologies секции, обновить дату Last updated согласно plan.md post-design constitution re-evaluation
- [ ] T077 Создать changelog запись в CHANGELOG.md с описанием UI редизайна: миграция от Ant Design к shadcn/ui, mobile-first подход, WCAG AA accessibility, dark theme support, performance improvements (bundle size -35%)

**Checkpoint**: Миграция полностью завершена. Ant Design удален. QA пройдено. Performance оптимизирован.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Нет зависимостей - можно начать немедленно
- **Foundational (Phase 2)**: Зависит от Setup - **БЛОКИРУЕТ все user stories**
- **User Stories (Phase 3, 4, 5, 6)**: Все зависят от Foundational (Phase 2)
  - **US1 (Phase 3)**: Может начаться после Phase 2 - Нет зависимостей от других stories
  - **US2 (Phase 4)**: Может начаться после Phase 2 - Может интегрироваться с US1 но independently testable
  - **US4 (Phase 5)**: Может начаться после Phase 2 - Применяет стили к компонентам из US1, US2
  - **US3 (Phase 6)**: Может начаться после Phase 2 - Desktop адаптации для всех stories
- **Polish (Phase 7)**: Зависит от завершения всех желаемых user stories

### User Story Priority Order (согласно FR-017)

Рекомендуемый порядок миграции для максимизации ценности:

1. **US1 (P1)** - Мобильный опыт фото-подсчета (критичные экраны для 90% пользователей) → **MVP**
2. **US2 (P1)** - Навигация (общая структура приложения)
3. **US4 (P1)** - Визуальный стиль (консистентность дизайна)
4. **US3 (P2)** - Десктопные адаптации (10% пользователей)

### Within Each User Story

- Core компоненты (Button, Card) перед composite компонентами (MealCard, BottomNavigation)
- Компоненты перед страницами
- Базовая функциональность перед визуальным polish
- Story полностью завершена перед переходом к следующей

### Parallel Opportunities

- **Phase 1**: Все задачи с [P] (T004, T005) можно выполнять параллельно
- **Phase 2**: Все token creation задачи (T006-T013) можно выполнять параллельно
- **Phase 3 (US1)**: Компоненты T021-T024 можно создавать параллельно
- **Phase 4 (US2)**: T032, T033 (navigation компоненты) параллельно
- **Phase 5 (US4)**: T042, T043, T045, T046, T049 параллельно
- **Phase 6 (US3)**: T054, T055, T057, T060, T061 параллельно
- **Phase 7**: T071, T072, T075, T076 параллельно

**Team Parallelization Strategy**: После Phase 2, разные разработчики могут работать над US1, US2, US4, US3 одновременно, так как stories независимы.

---

## Parallel Execution Examples

### Phase 2: Foundational Setup

```bash
# Запустить все token creation задачи одновременно (разные файлы):
Task T006: "Создать color tokens в frontend/src/shared/config/colors.ts"
Task T007: "Создать spacing tokens в frontend/src/shared/config/spacing.ts"
Task T008: "Создать typography tokens в frontend/src/shared/config/typography.ts"
Task T009: "Создать border-radius tokens в frontend/src/shared/config/border-radius.ts"
Task T010: "Создать shadow tokens в frontend/src/shared/config/shadows.ts"
Task T011: "Создать breakpoint config в frontend/src/shared/config/breakpoints.ts"
Task T012: "Создать animation specs в frontend/src/shared/config/animations.ts"
Task T013: "Создать accessibility config в frontend/src/shared/config/accessibility.ts"
```

### Phase 3: User Story 1 Components

```bash
# Запустить все core компоненты US1 параллельно:
Task T021: "Создать Button в frontend/src/shared/ui/shadcn/Button.tsx"
Task T022: "Создать Card в frontend/src/shared/ui/shadcn/Card.tsx"
Task T023: "Создать ProgressCircle в frontend/src/shared/ui/shadcn/ProgressCircle.tsx"
Task T024: "Создать LoadingSpinner в frontend/src/shared/ui/shadcn/LoadingSpinner.tsx"
```

### Cross-Story Parallelization (после Phase 2)

```bash
# Разные разработчики работают над разными stories:
Developer A: Phase 3 (US1) - Мобильный опыт
Developer B: Phase 4 (US2) - Навигация
Developer C: Phase 5 (US4) - Визуальный стиль
Developer D: Phase 6 (US3) - Десктоп адаптации
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

Минимально жизнеспособный продукт для релиза:

1. Завершить **Phase 1: Setup** (T001-T005)
2. Завершить **Phase 2: Foundational** (T006-T020) - КРИТИЧНО, блокирует все
3. Завершить **Phase 3: User Story 1** (T021-T031) - Мобильный опыт для 90% пользователей
4. **STOP and VALIDATE**: Протестировать US1 независимо на мобильных устройствах
5. Deploy/Demo если готово

**MVP Scope**: Setup + Foundational + US1 = ~31 задача
**Estimated Value**: Критичная функциональность для 90% пользователей готова

### Incremental Delivery

Постепенное добавление ценности:

1. **Phase 1 + 2** → Foundation готова
2. **+ Phase 3 (US1)** → Протестировать независимо → Deploy/Demo (**MVP!** 🎯)
3. **+ Phase 4 (US2)** → Протестировать независимо → Deploy/Demo (Навигация улучшена)
4. **+ Phase 5 (US4)** → Протестировать независимо → Deploy/Demo (Визуально современный)
5. **+ Phase 6 (US3)** → Протестировать независимо → Deploy/Demo (Desktop support)
6. **+ Phase 7** → Final polish → Production release

Каждая story добавляет ценность без breaking предыдущих stories.

### Parallel Team Strategy (если несколько разработчиков)

Оптимизация для командной работы:

1. **Вся команда**: Завершить Phase 1 + Phase 2 вместе (критичный фундамент)
2. **После Phase 2 - параллелизация**:
   - **Developer A**: User Story 1 (Phase 3) - Мобильный опыт
   - **Developer B**: User Story 2 (Phase 4) - Навигация
   - **Developer C**: User Story 4 (Phase 5) - Визуальный стиль
   - **Developer D**: User Story 3 (Phase 6) - Десктоп адаптации
3. Stories завершаются и интегрируются независимо
4. **Вся команда**: Phase 7 - Final polish вместе

**Benefit**: 4x ускорение после Phase 2 при наличии 4 разработчиков

---

## Success Metrics

После завершения всех tasks, проект должен соответствовать:

### Functional Requirements (из spec.md)

- ✅ FR-001: Адаптивный дизайн с 3 breakpoints (mobile/tablet/desktop)
- ✅ FR-002: Touch targets >= 44x44px на мобильном
- ✅ FR-003: Загрузка и интерактивность <= 3 секунд на мобильном
- ✅ FR-004: Постепенная миграция от Ant Design к shadcn/ui с dual-architecture
- ✅ FR-006: Анимации 200-300ms с CSS transitions
- ✅ FR-007: Визуальная обратная связь < 100ms
- ✅ FR-008: Светлая и темная цветовые схемы
- ✅ FR-009: Адаптивные размеры шрифтов (14-16px mobile, 16-18px desktop)
- ✅ FR-016: Пастельный зеленый с контрастностью 4.5:1 для текста, 3:1 для UI
- ✅ FR-019: Полное удаление Ant Design после миграции
- ✅ FR-022: Ручное QA каждого экрана

### Success Criteria (из spec.md)

- ✅ SC-001: 90% пользователей добавляют еду за <= 30 секунд
- ✅ SC-002: Загрузка <= 3 секунды на 4G
- ✅ SC-003: Touch targets >= 44x44px (automated check)
- ✅ SC-004: Visual feedback <= 100ms (performance API)
- ✅ SC-005: Корректное отображение на всех breakpoints без scroll
- ✅ SC-006: FCP < 1.8s на мобильном
- ✅ SC-007: Контрастность >= 4.5:1 для текста, >= 3:1 для UI
- ✅ SC-008: Pastel green консистентно используется
- ✅ SC-009: Offline сообщение отображается в течение 3 секунд

### Performance Goals (из plan.md)

- ✅ First Contentful Paint (FCP) < 1.8s на мобильном
- ✅ Time to Interactive (TTI) < 3s на 4G
- ✅ Анимации на 60 FPS
- ✅ JavaScript bundle < 200KB gzipped для мобильной версии

---

## Notes

- **[P] tasks**: Разные файлы, нет зависимостей, можно выполнять параллельно
- **[Story] label**: Связывает задачу с user story для traceability (US1, US2, US3, US4)
- **Каждая user story**: Независимо completable и testable
- **Ручное QA**: Дизайнер/QA специалист проверяет каждый экран вручную перед релизом (FR-022)
- **Тесты**: Автоматизированные тесты НЕ требуются (только ручное QA)
- **Commit strategy**: Commit после каждой задачи или логической группы
- **Checkpoints**: Останавливаться на каждом checkpoint для валидации story независимо
- **Избегать**: Vague tasks, конфликты в одном файле, cross-story зависимости нарушающие независимость

---

**Total Tasks**: 78 (добавлен T074b для валидации visual feedback)
**MVP Tasks (Phase 1 + 2 + 3)**: 31
**Estimated Timeline**:

- Solo developer: 3-4 недели (sequential)
- Team of 4: 1.5-2 недели (parallel after Phase 2)

**Status**: ✅ Tasks list complete and ready for /speckit.implement
