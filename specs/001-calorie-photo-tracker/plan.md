# Implementation Plan: Трекер Калорий по Фотографии

**Branch**: `001-calorie-photo-tracker` | **Date**: 2025-11-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-calorie-photo-tracker/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Веб-приложение для отслеживания калорий через анализ фотографий еды. Пользователи могут регистрироваться (Google OAuth или Email/Password), загружать фотографии блюд для автоматического определения продуктов и их калорийности, редактировать результаты, сохранять приемы пищи в профиль, управлять целями (набор/удержание/похудение), и отслеживать прогресс в календаре. Ключевая технология - интеграция с OpenRouter API для распознавания продуктов на фотографиях.

**Technical Approach**: Full-stack Next.js приложение с TypeScript, Feature-Sliced Design архитектурой для frontend, Zustand для state management, Axios для HTTP requests, Ant Design для UI компонентов, и OpenRouter API для photo recognition. Приложение использует Next.js API routes для backend logic, включая authentication, photo processing orchestration, и data persistence.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Next.js 14+ (App Router)
**Primary Dependencies**:
- Frontend: React 18+, Zustand 4.x, Axios 1.x, Ant Design 5.x
- Backend: Next.js API Routes, OpenRouter API (vision models)
- Authentication: NextAuth.js v5 (Auth.js)
- Database ORM: Prisma 5.x

**Storage**:
- Database: PostgreSQL (Vercel Postgres recommended)
- File Storage: Vercel Blob Storage (30-day auto-deletion)
- Email Service: Resend (React Email templates)

**Image Processing**:
- Client-side: browser-image-compression (pre-upload compression)
- Server-side: sharp (HEIC → JPG conversion)

**External APIs**:
- OpenRouter API: Food recognition via vision models (Claude Haiku/Sonnet)
- USDA FoodData Central: Nutritional data fallback (free API)

**Testing**: Optional per constitution (tests not mandatory, but can be added with Vitest or Jest if desired)

**Target Platform**: Web browser (modern browsers supporting ES6+), Server-Side Rendering with Next.js

**Project Type**: Web application (Next.js full-stack with FSD frontend architecture)

**Performance Goals**:
- Photo recognition API response < 10 seconds (Spec §SC-003)
- Calendar data load < 2 seconds (Spec §SC-009)
- Real-time weight recalculation < 1 second (Spec §SC-006)
- 75% minimum accuracy for food recognition (Spec §SC-004)

**Constraints**:
- Photo upload size limit: 10 MB maximum (Spec §FR-021)
- Photo retention: 30 days auto-deletion (Spec §FR-005a)
- Email verification token TTL: 24 hours (Spec §FR-003a)
- Password requirements: min 8 chars, 1 digit, 1 letter (Spec §FR-002b)

**Scale/Scope**:
- 5 user stories prioritized P1-P5
- 23 functional requirements
- 6 key entities (User, UserProfile, FoodPhoto, FoodItem, Meal, DailyLog)
- 12 measurable success criteria

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ **PASSED** (Initial check before Phase 0) | ✅ **CONFIRMED** (Post-Phase 1 recheck)

### Принцип I: TypeScript без Any
✅ **PASS** - Все файлы используют TypeScript strict mode, `any` запрещен в проекте.

**Evidence** (Post-Phase 1 Confirmation):
- tsconfig.json настроен с `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`
- Все компоненты, API routes, и utility functions полностью типизированы
- Zustand stores используют typed interfaces
- Axios requests используют typed request/response schemas
- **Finalized Dependencies** (research.md):
  - NextAuth.js v5: TypeScript-first, full type safety ✅
  - Prisma 5.x: Auto-generated types, @prisma/client ✅
  - Resend: TypeScript SDK with typed templates ✅
  - Vercel Blob: Full type safety (@vercel/blob) ✅
  - Sharp: TypeScript types for image processing ✅
  - OpenRouter API: Typed request/response via Axios ✅

### Принцип II: Feature-Sliced Design (FSD)
✅ **PASS** - Frontend структура следует FSD методологии с адаптацией под Next.js App Router.

**Evidence**:
```
src/
├── app/              # Next.js App Router (слой приложения)
├── pages/            # Страницы (композиция виджетов)
├── widgets/          # Самостоятельные блоки страниц
├── features/         # Действия пользователя (auth, photo-analysis, meal-editing)
├── entities/         # Бизнес-сущности (user, meal, photo, profile)
└── shared/           # UI-kit, утилиты, API клиент
```

**Note**: Next.js `app/` directory используется для роутинга и layout, но business logic организована по FSD слоям.

### Принцип III: Форматирование и Линтинг
✅ **PASS** - Prettier и ESLint настроены для проекта.

**Evidence**:
- `.prettierrc` и `.eslintrc.json` в корне проекта
- ESLint plugins: `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-config-prettier`
- Husky pre-commit hook запускает lint и format check
- Все предупреждения ESLint обрабатываются перед commit

### Принцип IV: UI библиотека Ant Design
✅ **PASS** - Все UI компоненты используют Ant Design.

**Evidence**:
- `antd` package установлен
- Theme configuration в `shared/config/theme.ts`
- Кастомные компоненты в `shared/ui/` оборачивают Ant Design компоненты для переиспользования
- Формы используют Ant Design Form components

### Принцип V: Управление Состоянием через Zustand
✅ **PASS** - Глобальное состояние управляется через Zustand.

**Evidence**:
- Zustand stores в `model/` папках соответствующих слайсов
- Типизированные store interfaces (StoreState & StoreActions)
- Селекторы для оптимизации re-renders
- Локальное состояние через `useState`, глобальное через Zustand

### Принцип VI: HTTP Клиент Axios
✅ **PASS** - Все HTTP requests используют Axios.

**Evidence**:
- Axios instance настроен в `shared/api/client.ts`
- Interceptors для error handling и auth tokens
- API методы в `api/` папках слайсов
- Все requests полностью типизированы (request + response types)

### Принцип VII: Политика Тестирования
✅ **PASS** - Тесты опциональны, ручное тестирование обязательно.

**Evidence**:
- Tests не являются blocking requirement
- Quality assurance через TypeScript strict typing, ESLint, и code review
- Если добавляются тесты, они используют Vitest или Jest с TypeScript

**Constitution Compliance**: ✅ **ALL GATES PASSED** (Initial + Post-Phase 1 Recheck)

**Post-Phase 1 Confirmation Notes**:
- All 9 NEEDS CLARIFICATION items resolved (research.md) ✅
- All selected technologies comply with constitution principles ✅
- No constitution violations introduced during Phase 0 or Phase 1 ✅
- TypeScript-first approach maintained across all dependencies ✅
- FSD architecture validated for project structure ✅
- Ant Design confirmed as sole UI library ✅
- Zustand confirmed for state management ✅
- Axios confirmed for all HTTP operations ✅

## Project Structure

### Documentation (this feature)

```text
specs/001-calorie-photo-tracker/
├── spec.md              # Feature specification ✅
├── plan.md              # This file (/speckit.plan command output) ✅
├── research.md          # Phase 0 output ✅
├── data-model.md        # Phase 1 output ✅
├── quickstart.md        # Phase 1 output ✅
├── contracts/           # Phase 1 output ✅
│   ├── auth.yaml        # Authentication endpoints ✅
│   ├── photos.yaml      # Photo upload & analysis ✅
│   ├── meals.yaml       # Meal CRUD operations ✅
│   ├── profile.yaml     # User profile & goals ✅
│   └── calendar.yaml    # Calendar & progress tracking ✅
└── tasks.md             # Phase 2 output (/speckit.tasks - separate command, not run yet)
```

### Source Code (repository root)

Next.js full-stack приложение с Feature-Sliced Design для frontend части:

```text
src/
├── app/                        # Next.js App Router (инициализация, роутинг, layouts)
│   ├── (auth)/                 # Auth группа routes (login, register, verify-email)
│   ├── (dashboard)/            # Authenticated routes группа
│   │   ├── profile/
│   │   ├── calendar/
│   │   └── layout.tsx          # Authenticated layout
│   ├── api/                    # Next.js API Routes (backend)
│   │   ├── auth/               # Auth endpoints (login, register, verify, session)
│   │   ├── photos/             # Photo upload & OpenRouter integration
│   │   ├── meals/              # Meal CRUD
│   │   ├── profile/            # Profile & goals management
│   │   └── calendar/           # Calendar aggregation queries
│   ├── layout.tsx              # Root layout (providers)
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
│
├── pages/                      # FSD: Страницы приложения (композиция виджетов)
│   ├── landing/                # Landing page components
│   ├── auth-page/              # Login/Register page logic
│   ├── photo-upload-page/      # Main photo upload & analysis page
│   ├── profile-page/           # Profile & goals management page
│   └── calendar-page/          # Progress calendar page
│
├── widgets/                    # FSD: Виджеты (самостоятельные блоки)
│   ├── header/                 # App header with navigation
│   ├── photo-upload-form/      # Photo upload UI block
│   ├── food-items-list/        # Recognized food items display
│   ├── meal-editor/            # Meal editing widget
│   ├── profile-form/           # Profile form widget
│   └── calendar-view/          # Calendar widget with day details
│
├── features/                   # FSD: Фичи (действия пользователя)
│   ├── auth/                   # Authentication flows
│   │   ├── ui/                 # Login, Register, Email verification UI
│   │   ├── model/              # Auth store (Zustand), auth state
│   │   └── api/                # Auth API calls (Axios)
│   ├── photo-analysis/         # Photo upload & recognition
│   │   ├── ui/                 # Upload button, loading indicator
│   │   ├── model/              # Photo analysis state
│   │   └── api/                # Photo upload, OpenRouter integration
│   ├── meal-editing/           # Meal editing & saving
│   │   ├── ui/                 # Weight editor, meal category selector
│   │   ├── model/              # Meal editing store
│   │   └── api/                # Meal CRUD operations
│   ├── profile-management/     # Profile & goals CRUD
│   │   ├── ui/                 # Profile form fields
│   │   ├── model/              # Profile store
│   │   └── api/                # Profile API calls
│   └── progress-tracking/      # Calendar & statistics
│       ├── ui/                 # Calendar day cell, detail modal
│       ├── model/              # Calendar state
│       └── api/                # Calendar data fetching
│
├── entities/                   # FSD: Бизнес-сущности
│   ├── user/                   # User entity
│   │   ├── model/              # User types, interfaces
│   │   ├── api/                # User-related API
│   │   └── lib/                # User utility functions
│   ├── meal/                   # Meal entity
│   │   ├── model/              # Meal types, validation
│   │   ├── api/                # Meal API
│   │   └── lib/                # Meal calculations (calories, БЖУ)
│   ├── photo/                  # FoodPhoto entity
│   │   ├── model/              # Photo types
│   │   └── api/                # Photo storage API
│   ├── profile/                # UserProfile entity
│   │   ├── model/              # Profile types
│   │   ├── api/                # Profile API
│   │   └── lib/                # Calorie calculation (Mifflin-St Jeor)
│   └── food-item/              # FoodItem entity
│       ├── model/              # FoodItem types
│       └── lib/                # Nutrition calculations
│
└── shared/                     # FSD: Переиспользуемые ресурсы
    ├── ui/                     # UI-kit компоненты (Ant Design wrappers)
    │   ├── button/
    │   ├── input/
    │   ├── card/
    │   ├── modal/
    │   └── ...
    ├── api/                    # API клиент, базовые настройки
    │   ├── client.ts           # Axios instance with interceptors
    │   └── types.ts            # Common API types
    ├── lib/                    # Утилиты, хелперы
    │   ├── format-date.ts
    │   ├── validate-email.ts
    │   └── calculate-macros.ts
    ├── config/                 # Конфигурация приложения
    │   ├── env.ts              # Environment variables
    │   ├── theme.ts            # Ant Design theme config
    │   └── constants.ts        # App constants
    └── types/                  # Общие типы
        ├── api.ts              # Common API types
        └── entities.ts         # Shared entity types

prisma/                         # Database schema (если используется Prisma)
├── schema.prisma               # Data models
└── migrations/                 # DB migrations

public/                         # Static assets
├── images/
└── icons/

.husky/                         # Git hooks
└── pre-commit                  # ESLint & Prettier check
```

**Structure Decision**:
Выбрана Next.js full-stack структура с Feature-Sliced Design для frontend части. Next.js App Router используется для роутинга и SSR, а FSD применяется для организации frontend кода внутри `src/` директории. Backend logic изолирован в `src/app/api/` как Next.js API routes.

**Rationale**:
1. **Next.js App Router** обеспечивает SSR/CSR flexibility, SEO optimization, и быстрый холодный старт
2. **FSD архитектура** обеспечивает масштабируемость frontend кода, четкое разделение ответственности, и независимость фич
3. **Colocation** `app/api/` routes с frontend кодом упрощает full-stack development в monorepo

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All constitution principles are satisfied by the selected technical approach.

## Phase 0: Research Tasks (NEEDS CLARIFICATION Items)

The following technical decisions require research before implementation can begin:

### R001: Authentication Strategy Selection
**Question**: Which authentication library/service to use for Google OAuth + Email/Password?

**Options**:
1. **NextAuth.js v5** (Auth.js) - Open source, Next.js native integration
2. **Clerk** - Managed service, comprehensive auth features
3. **Custom JWT** - Full control, more implementation effort

**Research Focus**:
- Google OAuth integration complexity
- Email verification flow support
- Session management capabilities
- TypeScript support quality
- Cost considerations

**Target Decision**: Select authentication approach with rationale

---

### R002: Database & ORM Selection
**Question**: Which database and ORM to use for persistence?

**Options**:
1. **PostgreSQL + Prisma** - Relational, excellent TypeScript support, migrations
2. **PostgreSQL + Drizzle** - Relational, lightweight, SQL-first
3. **MongoDB + Mongoose** - Document-based, flexible schema

**Research Focus**:
- Schema complexity (6 entities with relationships)
- Migration strategy for evolving schema
- TypeScript integration quality
- Query performance for calendar aggregations
- Hosting options compatibility

**Target Decision**: Database + ORM combination with rationale

---

### R003: File Storage Strategy
**Question**: Where to store uploaded food photos (10MB max, 30-day retention)?

**Options**:
1. **AWS S3** - Industry standard, CDN integration, lifecycle policies
2. **Cloudinary** - Image-focused, transformations included
3. **Vercel Blob** - Next.js native, simple setup
4. **Local filesystem** - Simple, cost-effective, limited scalability

**Research Focus**:
- Automatic 30-day deletion support (lifecycle policies)
- Cost for expected usage (storage + bandwidth)
- Next.js integration complexity
- CDN availability for photo serving
- Signed URL generation for secure access

**Target Decision**: File storage solution with cost estimate

---

### R004: Email Service Provider
**Question**: Which email service to use for verification emails?

**Options**:
1. **Resend** - Developer-friendly, Next.js ecosystem integration
2. **SendGrid** - Established, robust analytics
3. **SMTP** (e.g., Gmail, custom) - Cost-effective, limited features

**Research Focus**:
- Email deliverability rates
- Template management
- Cost per email (verification + potential marketing)
- API simplicity
- TypeScript SDK availability

**Target Decision**: Email provider with rationale

---

### R005: OpenRouter API Integration Pattern
**Question**: How to integrate OpenRouter API for food recognition from Next.js backend?

**Research Focus**:
- OpenRouter API documentation review
- Authentication method (API keys storage)
- Request/response format for image analysis
- Rate limiting and pricing model
- Error handling strategies
- Fallback behavior if API unavailable
- TypeScript SDK availability

**Target Decision**: Integration pattern and OpenRouter configuration

---

### R006: Calorie Calculation Formula Implementation
**Question**: How to implement Mifflin-St Jeor formula and goal-based calorie adjustment?

**Research Focus**:
- Precise Mifflin-St Jeor formula parameters
- Activity level multipliers (if needed)
- Calorie adjustment for goals:
  - Набор массы: +X% surplus
  - Удержание веса: maintenance
  - Похудение: -X% deficit
  - Контроль сахара: maintenance with carb tracking
- Validation rules for profile inputs

**Target Decision**: Formula implementation with constants

---

### R007: Food Database Source
**Question**: Where to get nutritional data for foods (calories, БЖУ per 100g)?

**Options**:
1. **USDA FoodData Central API** - Free, comprehensive, US-focused
2. **Nutritionix API** - Commercial, extensive database
3. **Local seeded database** - Pre-populated from open datasets
4. **Hybrid** - API + local fallback

**Research Focus**:
- Coverage of common Russian/international foods
- API rate limits and costs
- Data freshness and accuracy
- Search/matching capabilities
- TypeScript SDK or REST API

**Target Decision**: Food database strategy with integration approach

---

### R008: Photo Preprocessing Requirements
**Question**: Should photos be preprocessed before sending to OpenRouter API?

**Research Focus**:
- Optimal image size for recognition accuracy vs API cost
- Format conversion needs (HEIC → JPG)
- Compression strategy to reduce upload time
- Client-side vs server-side preprocessing tradeoffs
- Next.js Image component integration

**Target Decision**: Preprocessing pipeline specification

---

### R009: Development & Deployment Environment
**Question**: Where to host the application and what environment variables are needed?

**Options for Hosting**:
1. **Vercel** - Next.js native, zero-config, edge functions
2. **AWS** (EC2, ECS, or Amplify) - Full control, potentially complex
3. **Self-hosted** (VPS) - Cost-effective, requires DevOps

**Research Focus**:
- Environment variables needed:
  - `DATABASE_URL`
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `OPENROUTER_API_KEY`
  - `FILE_STORAGE_*` (bucket, region, keys)
  - `EMAIL_API_KEY`
- CI/CD pipeline (GitHub Actions?)
- Database hosting (Vercel Postgres, Supabase, Railway?)
- Cost estimates for MVP scale

**Target Decision**: Deployment platform and environment configuration

---

## Phase 1: Design Artifacts ✅ COMPLETE

Phase 1 generated the following artifacts after Phase 0 research completion:

1. ✅ **data-model.md**: Complete entity schemas with Prisma schema, 6 entities, relationships, ERD
2. ✅ **contracts/**: OpenAPI 3.0 specs for all API routes:
   - `auth.yaml`: Register, verify, login, Google OAuth
   - `photos.yaml`: Upload, status polling, results, deletion
   - `meals.yaml`: CRUD operations, category suggestions
   - `profile.yaml`: Profile management, calorie calculation
   - `calendar.yaml`: Month view, day details, statistics
3. ✅ **quickstart.md**: Complete development setup guide with all environment variables, database setup, deployment instructions

**Phase 1 Execution Status**: ✅ **COMPLETE** (All artifacts generated)

---

## Next Steps

1. ✅ **Phase 0 Complete**: Technical Context filled, Constitution Check passed, all 9 research items resolved
2. ✅ **Phase 0 Complete**: `research.md` generated with all technical decisions documented
3. ✅ **Phase 1 Complete**: `data-model.md`, `contracts/`, `quickstart.md` generated
4. ✅ **Agent Context Updated**: Claude Code context file updated with finalized tech stack
5. ✅ **Constitution Recheck Complete**: All principles validated post-Phase 1
6. ⏳ **Phase 2 Ready**: Run `/speckit.tasks` to generate implementation tasks (separate command)

---

**Plan Status**: ✅ **PLANNING COMPLETE** | Constitution: ✅ PASSED | Phase 0: ✅ COMPLETE | Phase 1: ✅ COMPLETE

**Ready for Implementation**: Run `/speckit.tasks` to generate detailed implementation tasks (tasks.md)
