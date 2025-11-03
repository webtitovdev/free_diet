# Implementation Plan: Mobile-First UI Redesign

**Branch**: `001-mobile-first-ui-redesign` | **Date**: 2025-11-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mobile-first-ui-redesign/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Полный редизайн UI приложения с переходом от Ant Design к shadcn/ui, оптимизированный для мобильных устройств (90% пользователей). Включает анализ и адаптацию UX/UI паттернов основных конкурентов (MyFitnessPal, Yazio, Lifesum), внедрение адаптивного дизайна с тремя брейкпоинтами, современную типографическую систему и пастельную зеленую цветовую схему с соблюдением WCAG AA. Миграция выполняется постепенно страница-за-страницей с полным удалением Ant Design после завершения.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**:

- Next.js 14+ (App Router)
- React
- shadcn/ui + Tailwind CSS (целевой стек после миграции)
- Ant Design (текущий стек, будет полностью удален после миграции)
- Zustand (state management)
- Axios (HTTP клиент)

**Storage**: N/A (UI редизайн, изменения только на frontend)
**Testing**: Ручное QA (дизайнер/QA специалист проверяет каждый экран вручную)
**Target Platform**:

- Web browsers: iOS 14+, Android 10+
- Desktop: последние 2 версии Chrome, Safari, Firefox, Edge
- Основной фокус: мобильные устройства (<768px) - 90% пользователей

**Project Type**: Web application (Frontend + Backend, фокус на Frontend)

**Performance Goals**:

- First Contentful Paint (FCP) < 1.8s на мобильных устройствах
- Time to Interactive (TTI) < 3s на 4G соединении
- Анимации должны работать на 60 FPS
- JavaScript bundle < 200KB (gzipped) для мобильной версии

**Constraints**:

- Анимации и переходы: 200-300ms с ease-in-out
- Визуальная обратная связь: < 100ms на все действия пользователя
- WCAG AA контрастность: минимум 4.5:1 для текста, 3:1 для UI компонентов
- Touch targets: минимум 44x44px на мобильных устройствах
- Требуется активное интернет-соединение (офлайн режим не поддерживается)

**Scale/Scope**:

- 4 user stories с приоритетами P1-P2
- Миграция всех существующих экранов приложения
- 3 брейкпоинта: мобильный (<768px), планшет (768-1024px), десктоп (>1024px)
- Поддержка светлой и темной цветовых схем
- Постепенная миграция страница-за-страницей с сохранением работоспособности

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Проверка соответствия конституции Free Diet

**Принцип I: TypeScript без Any**

- ✅ **PASS** - Фича не меняет языковые требования, TypeScript 5.x strict mode сохраняется

**Принцип II: Feature-Sliced Design (FSD)**

- ✅ **PASS** - Архитектура FSD будет сохранена, новые компоненты shadcn/ui будут размещены в `shared/ui/` согласно FSD, страницы остаются в `pages/`, виджеты в `widgets/`

**Принцип III: Форматирование и Линтинг**

- ✅ **PASS** - Prettier и ESLint конфигурация не меняется, все новые компоненты будут следовать существующим правилам

**Принцип IV: UI библиотека Ant Design**

- ❌ **VIOLATION** - Конституция требует использовать Ant Design для всех UI компонентов
- **Нарушение**: Спецификация требует полную миграцию С Ant Design НА shadcn/ui с последующим удалением Ant Design из зависимостей (FR-004, FR-017, FR-018, FR-019)
- **Критичность**: CRITICAL - это фундаментальное изменение технологического стека
- **Требуется обоснование** в разделе Complexity Tracking

**Принцип V: Управление Состоянием через Zustand**

- ✅ **PASS** - State management не затрагивается, Zustand остается основной библиотекой

**Принцип VI: HTTP Клиент Axios**

- ✅ **PASS** - HTTP слой не затрагивается, Axios остается основным клиентом

**Принцип VII: Политика Тестирования**

- ✅ **PASS** - Используется ручное QA (FR-022), что соответствует опциональности тестов в конституции

### Статус Gate

**УСЛОВНЫЙ PASS** - Разрешено продолжить при условии обоснования критического нарушения Принципа IV в разделе Complexity Tracking.

**ACTION REQUIRED**: Перед началом реализации (Phase 2) необходимо обновить конституцию, заменив Принцип IV "UI библиотека Ant Design" на "UI библиотека shadcn/ui + Tailwind CSS".

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/src/
├── app/                         # Next.js App Router + инициализация
│   ├── (auth)/                 # Auth route group
│   ├── (main)/                 # Main route group
│   ├── providers/              # Провайдеры (Theme, Query Client)
│   ├── styles/                 # Глобальные стили
│   └── layout.tsx              # Root layout
│
├── pages/                       # FSD: Страницы приложения
│   ├── home/
│   ├── diary/                  # Дневник питания
│   ├── profile/
│   └── settings/
│
├── widgets/                     # FSD: Виджеты (композиция features)
│   ├── header/                 # Глобальный header
│   ├── navigation/             # Bottom navigation (mobile)
│   ├── meal-card/              # Карточка приема пищи
│   └── stats-dashboard/
│
├── features/                    # FSD: Фичи (действия пользователя)
│   ├── add-meal-photo/         # Фото-захват еды
│   ├── edit-meal/
│   └── view-statistics/
│
├── entities/                    # FSD: Бизнес-сущности
│   ├── meal/
│   ├── user/
│   └── daily-log/
│
└── shared/                      # FSD: Переиспользуемые ресурсы
    ├── ui/                      # UI-kit компоненты
    │   ├── shadcn/             # Компоненты shadcn/ui (новые)
    │   └── legacy-antd/        # Ant Design (временно, для миграции)
    ├── api/                     # Axios client
    ├── lib/                     # Утилиты
    ├── config/                  # Design tokens, theme config
    │   ├── tokens.ts           # Design tokens (colors, spacing, etc)
    │   ├── breakpoints.ts      # Responsive breakpoints
    │   └── animations.ts       # Animation specifications
    └── types/                   # Общие типы

backend/
├── src/
│   ├── api/                    # API endpoints (не затрагивается)
│   └── services/               # Бизнес-логика (не затрагивается)
└── tests/
```

**Structure Decision**:
Используется Feature-Sliced Design архитектура для frontend согласно конституции проекта. Новые компоненты shadcn/ui размещаются в `shared/ui/shadcn/`, компоненты Ant Design временно остаются в `shared/ui/legacy-antd/` на период миграции. Design tokens и конфигурация темизации размещаются в `shared/config/`. Backend не затрагивается этой фичей, изменения только на frontend.

## Complexity Tracking

> **Обоснование нарушений конституции**

| Violation                                      | Why Needed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Simpler Alternative Rejected Because                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Принцип IV: Замена Ant Design на shadcn/ui** | **Критические UX проблемы текущего дизайна**:<br>- Ant Design не оптимизирован для мобильных устройств (90% пользователей)<br>- Компоненты Ant Design имеют фиксированные размеры, не адаптированные для touch-интерфейсов<br>- Визуальный стиль Ant Design выглядит устаревшим по сравнению с современными health & fitness приложениями 2025 года<br>- Невозможно достичь требуемого UX паттернов конкурентов (MyFitnessPal, Yazio, Lifesum) с Ant Design из-за его корпоративного дизайн-языка<br><br>**Бизнес-обоснование**:<br>- Пользовательский запрос: "полностью слижать чейто дизайн отказавшись от antd"<br>- Необходимо для конкурентоспособности продукта | **Альтернатива 1: Кастомизация Ant Design**<br>❌ Отклонена потому что:<br>- Ant Design имеет ограниченные возможности темизации для мобильных паттернов<br>- Компоненты спроектированы для desktop-first подходов<br>- Требуется значительный override стилей, что увеличивает bundle size<br>- Технический долг от борьбы с дефолтными стилями Ant Design<br><br>**Альтернатива 2: Гибридный подход (Ant Design + shadcn/ui)**<br>❌ Отклонена потому что:<br>- Увеличение bundle size (две UI библиотеки вместо одной)<br>- Визуальная несогласованность между компонентами разных библиотек<br>- Сложность поддержки двух design systems<br>- Конфликты между Ant Design CSS и Tailwind CSS<br><br>**Выбрано: Полная замена на shadcn/ui + Tailwind**<br>✅ Потому что:<br>- shadcn/ui headless, полностью кастомизируем<br>- Tailwind CSS идеально подходит для mobile-first подхода<br>- Современный визуальный стиль, соответствующий трендам 2025<br>- Меньший bundle size после завершения миграции<br>- Лучшая производительность на мобильных устройствах |

**Статус**: Нарушение обосновано необходимостью достижения бизнес-целей (конкурентоспособный mobile-first UX). Требуется обновление конституции перед Phase 2 (реализация).

---

## Post-Design Constitution Re-evaluation

_Выполнено после Phase 1: Design & Contracts_

### Статус после завершения дизайна

После создания полного дизайна (research.md, data-model.md, contracts/, quickstart.md) переоценка показывает:

**Принцип IV: UI библиотека Ant Design**

- ❌ **VIOLATION CONFIRMED** - Нарушение подтверждено и обосновано
- **Design artifacts созданы**:
  - ✅ Design Token System (colors, spacing, typography, etc.)
  - ✅ Component Library contracts (TypeScript интерфейсы)
  - ✅ Migration strategy (gradual, dual-architecture)
  - ✅ Quickstart guide для разработчиков
- **Complexity Tracking обновлен**: Полное обоснование с альтернативами

**Все остальные принципы**:

- ✅ **PASS** - Подтверждено соответствие после дизайна

### Финальное решение Gate

**УСЛОВНЫЙ PASS** - Планирование завершено успешно.

**CRITICAL ACTION REQUIRED перед Phase 2 (Implementation)**:

1. **Обновить конституцию** (.specify/memory/constitution.md):
   - Заменить Принцип IV "UI библиотека Ant Design" на "UI библиотека shadcn/ui + Tailwind CSS"
   - Обновить правила использования UI компонентов
   - Обновить версию конституции (MINOR bump: 1.0.0 → 1.1.0)

2. **Синхронизировать шаблоны** (если затрагиваются):
   - Проверить что spec-template.md, plan-template.md, tasks-template.md не требуют изменений

3. **Получить одобрение команды**:
   - Минорные изменения (добавление принципов) требуют одобрения тимлида
   - Представить обоснование из Complexity Tracking

**Только после выполнения этих действий можно переходить к `/speckit.tasks` и Phase 2: Implementation.**

---
