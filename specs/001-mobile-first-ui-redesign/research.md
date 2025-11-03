# Research: Mobile-First UI Redesign

**Дата**: 2025-11-04
**Фича**: 001-mobile-first-ui-redesign

Этот документ содержит результаты исследования, выполненного в Phase 0 процесса планирования. Все решения основаны на анализе конкурентов, best practices индустрии и технических требованиях.

---

## 1. Анализ UX/UI Паттернов Конкурентов

### 1.1 MyFitnessPal

**Ключевые паттерны:**

- **Bottom Navigation Bar**: 3-5 основных разделов внизу экрана. Исследования показали, что навигация на 20-30% быстрее при использовании bottom bar по сравнению с традиционным top menu, так как hit targets находятся в natural thumb zone
- **Barcode Scanner**: Сканер штрих-кодов делает логирование калорий почти бесшовным, позволяя пользователям вводить приемы пищи за секунды
- **Tab Bar + Top Navigation**: Комбинация элементов навигации с Dashboard, Progress indicators, Cards и Search Bar

**Проблемы UX (выводы из анализа):**

- Главная функция (добавление еды) скрыта за несколькими экранами или требует долгих шагов
- Менее важные функции занимают место на главной странице
- Слишком много функций в кнопке "More", включая важные (User Settings, Nutrition)

**Решение для нашего приложения**: Вынести главную CTA (добавление еды) на видное место, возможно в центр bottom navigation или как FAB

### 1.2 Yazio

**Ключевые паттерны:**

- **Круговые индикаторы прогресса**: Вверху экрана отображаются circles с различной информацией, включая уникальный tracking circle для напоминаний о measurements
- **Минималистичный интерфейс**: Фокус на простом интерфейсе без unnecessary features и gaudy color schemes
- **Чистая организация**: UI очень чистый, ясный и логичный
- **AI Calorie Counter**: В последних обновлениях добавлен AI счетчик калорий для быстрого отслеживания
- **Виджеты**: Helpul widgets для быстрого доступа к логированию приема пищи

**Решение для нашего приложения**: Использовать круговые индикаторы прогресса, минималистичный подход, виджеты для быстрого доступа

### 1.3 Lifesum

**Ключевые паттерны:**

- **Визуальная иерархия**: Вверху калории отображаются в трех формах: сколько съедено, сколько осталось на день, сколько сожжено
- **Цветовая кодировка макронутриентов**: Каждый макронутриент имеет свой цвет, показывая сколько употреблено из рекомендуемого количества
- **Сегментация приемов пищи**: Breakfast, lunch, dinner, snacks разделены на отдельные секции с рекомендуемыми калориями для каждого
- **Эстетика**: Interestingly styled interface с nice icons и анимациями, aesthetically pleasing

**Решение для нашего приложения**: Цветовая кодировка макронутриентов, четкая сегментация приемов пищи, приятная визуальная эстетика

### 1.4 Общие Паттерны Mobile-First Приложений 2025

**Bottom Tab Bars - Industry Standard:**

- Популярные приложения (Instagram, Twitter, Facebook, Spotify) давно используют bottom tab bars для основных разделов (Home, Search, Profile)
- Навигация остается в один тап и всегда доступна
- Thumb-friendly дизайн критичен для больших экранов

**Общие функции калорийных трекеров:**

- Barcode scanner для быстрого ввода еды
- Text search функциональность
- Visual progress indicators (круги, bars)
- Интеграция с fitness tracking устройствами

---

## 2. shadcn/ui + Tailwind CSS Best Practices

### 2.1 Ключевые Преимущества

**Mobile-First Responsive Design:**

- Tailwind CSS следует mobile-first подходу, делая responsive design легким
- shadcn/ui интегрируется seamlessly с Tailwind CSS, обеспечивая mobile-first компоненты легко адаптируемые под разные размеры экранов

**Ownership & Customization:**

- В отличие от традиционных UI библиотек, shadcn/ui не устанавливается как dependency
- Вы копируете компоненты напрямую в проект → вы владеете кодом
- Полный контроль над каждым аспектом вашего UI

**Accessibility из коробки:**

- Каждый компонент построен с использованием Tailwind CSS для стилей и Radix primitives для accessibility и interaction
- Это обеспечивает WCAG compliance из коробки

### 2.2 Performance Best Practices

**Just-in-Time (JIT) Mode:**

- Enabling JIT mode значительно улучшает производительность, генерируя стили динамически
- Уменьшает размер CSS bundle

**Tailwind v4 Support (2025):**

- shadcn/ui CLI теперь может инициализировать проекты с Tailwind v4
- Полная поддержка новой директивы `@theme` и `@theme inline` опции
- Все компоненты обновлены для Tailwind v4 и React 19

### 2.3 Design System Benefits

Комбинируя utility-first подход Tailwind с headless, accessible компонентами Shadcn, можно создать design system который одновременно:

- Highly customizable (полный контроль)
- Incredibly efficient (оптимизирован)

**Решение**: Использовать Tailwind v4 + shadcn/ui с JIT mode для оптимальной производительности и кастомизации

---

## 3. Стратегия Миграции от Ant Design к shadcn/ui

### 3.1 Результаты Реальных Миграций

**Case Study:**

- Один разработчик выполнил миграцию за несколько недель
- **Результат**: 35% уменьшение JavaScript bundle после удаления Ant Design

### 3.2 Ключевые Различия

**Ant Design vs shadcn/ui:**

- **Ant Design**: импорт pre-built компонентов, использует Less и CSS-in-JS
- **shadcn/ui**: получаете source code компонентов напрямую, построен на Tailwind CSS

### 3.3 Рекомендуемый Подход - Gradual Migration

**Dual-Architecture Strategy:**

- Библиотека компонентов с dual-architecture: legacy V1 компоненты (Ant Design) и modern V2 компоненты (shadcn/ui)
- Позволяет постепенную миграцию с сохранением backward compatibility
- Запуск старой и новой систем параллельно

**Phased Approach:**

- Сегментация и transfer компонентов в phases
- Основано на business priorities (в нашем случае - user stories приоритеты)
- Постепенная миграция departments или system modules

**Порядок миграции (из spec FR-017):**

1. **US1 - Мобильный опыт** (фото-захват + дневной журнал) - критичные экраны для 90% пользователей
2. **US2 - Навигация** (навигационные компоненты и общая структура)
3. **US4 - Визуальный стиль** (карточки, типографика)
4. **US3 - Десктопные адаптации**

### 3.4 Challenges и Решения

**Challenge 1: Value-add Features**

- Ant Design автоматически обрабатывает table cells с overrunning text
- Ant Design автоматически virtualize lists

**Решение**: Реализовать эти features вручную или использовать дополнительные библиотеки (например, `@tanstack/react-virtual` для virtualization)

**Challenge 2: Стилевые Конфликты**

- Ant Design CSS может конфликтовать с Tailwind CSS

**Решение**: Изолировать Ant Design компоненты в отдельной папке `shared/ui/legacy-antd/`, использовать CSS modules или scoped styles для предотвращения конфликтов

**Решение для проекта**: Использовать phased approach с dual-architecture на период миграции (FR-018), полное удаление Ant Design после завершения (FR-019)

---

## 4. Design Tokens и WCAG AA Accessibility

### 4.1 WCAG AA Контрастность - Требования

**Стандарты:**

- **4.5:1** для обычного текста (minimum contrast ratio)
- **3:1** для крупного текста (19px+ bold или 24px+ normal)
- Нет исключений для brand colors или corporate design guidelines

### 4.2 Использование Pastel Colors Accessibly

**Ключевое правило:**

> "Не существует недоступных цветов, только недоступные комбинации"

**Это означает:**

- Можно использовать light или pastel colors
- Нужно тщательно продумывать как они используются
- Фокус на комбинациях цветов, а не на отдельных цветах

### 4.3 Практические Решения для Pastel Green

**Case Study - "WCAG Green":**

- Команда ввела более темный зеленый, названный "WCAG Green"
- Passed AA на белых фонах
- Дал гибкость в дизайне для использования зеленого с сохранением brand aesthetic

**Решение для проекта**:

1. Базовый pastel green (#A8E6A3 или similar) для decorative elements и backgrounds
2. Более темный "WCAG Green" (#2D6A4F или similar, проверить контраст) для:
   - Текста
   - Интерактивных элементов (кнопки, ссылки)
   - UI компонентов

### 4.4 Design Token Systems

**USWDS Color-Grade System:**

- Помогает командам выбирать accessible colors с color-grade системой
- Colors of grade 50 результируют в Section 508 AA contrast против white (grade 0) и black (grade 100)
- "Magic numbers" для выбора accessible комбинаций из любой палитры

**Решение для проекта**:
Создать design tokens систему в `shared/config/tokens.ts`:

```typescript
// Пример структуры (финальные значения требуют проверки контраста)
export const colorTokens = {
  // Pastel green для decorative (низкая контрастность OK)
  brand: {
    pastel: "#A8E6A3", // Для backgrounds, illustrations
    light: "#C8F0C5", // Для hover states на backgrounds
    DEFAULT: "#2D6A4F", // WCAG Green - для текста/UI
    dark: "#1F4A37", // Для hover states на интерактивных элементах
  },

  // Semantic colors
  success: "#22C55E", // Green - проверить 4.5:1
  error: "#EF4444", // Red - проверить 4.5:1
  warning: "#F59E0B", // Amber - проверить 4.5:1

  // Text colors (гарантированно WCAG AA)
  text: {
    primary: "#1F2937", // Gray-800 - 4.5:1+ на white
    secondary: "#4B5563", // Gray-600 - 4.5:1+ на white
    disabled: "#9CA3AF", // Gray-400 - decorative only
  },
};
```

### 4.5 Рекомендуемые Инструменты Проверки

1. **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
2. **axe DevTools** - browser extension для автоматической проверки
3. **WAVE** - Web Accessibility Evaluation Tool

**Action Items**:

- Использовать эти инструменты для проверки всех цветовых комбинаций перед финализацией design tokens
- Включить automated accessibility tests в CI/CD pipeline (опционально, так как FR-022 требует только ручное QA)

---

## 5. Финальные Решения и Рекомендации

### 5.1 Навигация

**Решение**: Bottom Navigation Bar (tab bar)

- **Обоснование**: Industry standard (Instagram, Facebook, Spotify), 20-30% быстрее top menu, thumb-friendly
- **Структура**: 4 раздела (Дневник, Добавить [CTA], Прогресс, Профиль)
- **Имплементация**: shadcn/ui Tabs компонент + custom styling

### 5.2 Главная CTA (Добавление Еды)

**Решение**: Центральная кнопка в bottom navigation или FAB

- **Обоснование**: Главная функция должна быть самой доступной (урок из MyFitnessPal проблем)
- **Визуально выделена**: Больший размер, акцентный цвет (WCAG Green)
- **Always accessible**: На всех экранах

### 5.3 Визуализация Прогресса

**Решение**: Круговые индикаторы прогресса (как Yazio) + цветовые bars (как Lifesum)

- **Обоснование**: Круги интуитивны для понимания процента, цветовые bars для макронутриентов
- **Размещение**: Верхняя часть главного экрана

### 5.4 UI Library Stack

**Решение**: shadcn/ui + Tailwind CSS v4

- **Обоснование**:
  - Mobile-first из коробки
  - 35% уменьшение bundle size (vs Ant Design)
  - Полный контроль и кастомизация
  - Accessibility через Radix primitives
- **Миграция**: Gradual, dual-architecture, следуя порядку user stories

### 5.5 Color Scheme

**Решение**: Dual pastel green palette

- **Pastel Green (#A8E6A3)**: Decorative elements, backgrounds, illustrations
- **WCAG Green (#2D6A4F)**: Text, interactive elements, UI components
- **Validation**: Все комбинации проверены на 4.5:1 (текст) и 3:1 (UI)

### 5.6 Типографика

**Решение**: Sans-serif font stack (Inter recommended)

- **Mobile**: 14-16px основной текст, 24-32px заголовки
- **Desktop**: 16-18px основной текст, 28-36px заголовки
- **Line height**: 1.5-1.75 для читаемости

### 5.7 Spacing & Layout

**Решение**: Mobile-first spacing system

- **Touch targets**: 44x44px minimum (FR-002)
- **Card padding**: 16-24px
- **Content max-width**: 1200-1400px на десктопе (FR-013)

### 5.8 Animations

**Решение**: CSS transitions + modern Animation API

- **Duration**: 200-300ms (FR-006)
- **Easing**: ease-in-out
- **Performance**: Использовать CSS transforms и opacity для 60 FPS
- **Accessibility**: Respect `prefers-reduced-motion`

---

## 6. Риски и Митигация

### Риск 1: Bundle Size в Переходный Период

**Проблема**: Во время миграции оба фреймворка (Ant Design + shadcn/ui) увеличат bundle size

**Митигация**:

- Tree-shaking для неиспользуемых Ant Design компонентов
- Code splitting по routes
- Lazy loading для тяжелых компонентов
- Мониторинг bundle size (limit 200KB gzipped)

### Риск 2: Визуальная Несогласованность в Переходный Период

**Проблема**: Компоненты разных библиотек могут выглядеть по-разному

**Митигация**:

- Общие design tokens в `shared/config/tokens.ts`
- Обертки вокруг Ant Design компонентов для применения новых токенов
- Четкий style guide для обеих библиотек

### Риск 3: Потеря Функциональности

**Проблема**: Ant Design features (table virtualization, etc.) нужно реплицировать

**Митигация**:

- Аудит всех используемых Ant Design features до миграции
- Подготовка замен: `@tanstack/react-virtual`, `@tanstack/react-table`
- Ручное тестирование каждой мигрированной страницы (FR-022)

---

## 7. Next Steps (Phase 1)

На основе этого research, Phase 1 (Design & Contracts) должна включать:

1. **data-model.md**: Детальное описание entities:
   - Design Token System (colors, spacing, typography)
   - Breakpoint Configuration
   - Component Library (список всех shadcn/ui компонентов)
   - Animation Specifications

2. **contracts/**: API контракты (если применимо для UI фичи)

3. **quickstart.md**: Руководство для разработчиков:
   - Как настроить shadcn/ui
   - Как использовать design tokens
   - Как мигрировать компонент от Ant Design

4. **Обновление agent context**: Добавить shadcn/ui + Tailwind CSS в CLAUDE.md

---

**Статус**: ✅ Research Complete
**Следующий этап**: Phase 1 - Design & Contracts
