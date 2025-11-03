# Tasks: Трекер Калорий по Фотографии

**Input**: Design documents from `/specs/001-calorie-photo-tracker/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are OPTIONAL per constitution (Принцип VII) - manual testing is primary quality assurance method

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Next.js 14 project with TypeScript strict mode and App Router in project root
- [ ] T002 [P] Install core dependencies: react@18, next@14, typescript@5, zustand@4, axios@1, antd@5, next-auth@5-beta, prisma@5
- [ ] T003 [P] Configure TypeScript strict mode in tsconfig.json with noImplicitAny and strictNullChecks
- [ ] T004 [P] Setup ESLint with @typescript-eslint, react, react-hooks plugins in .eslintrc.json
- [ ] T005 [P] Configure Prettier in .prettierrc with consistent formatting rules
- [ ] T006 [P] Setup Husky pre-commit hooks in .husky/pre-commit for lint and format checks
- [ ] T007 Create Next.js App Router structure in src/app/ with (auth) and (dashboard) route groups
- [ ] T008 [P] Configure environment variables template in .env.example with all required keys
- [ ] T009 [P] Setup Ant Design theme configuration in src/shared/config/theme.ts
- [ ] T010 Create root layout in src/app/layout.tsx with providers and global styles

**Checkpoint**: Project initialized with proper configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & ORM Setup

- [ ] T011 Create Prisma schema in prisma/schema.prisma with all 6 entities (User, UserProfile, FoodPhoto, Meal, FoodItem, DailyLog). IMPORTANT: Meal-Photo relationship must be optional (photoId nullable) with no cascade delete to satisfy FR-005b (meal records persist after photo deletion)
- [ ] T012 Configure PostgreSQL datasource and Prisma client generator in prisma/schema.prisma
- [ ] T013 Run initial Prisma migration: npx prisma migrate dev --name init
- [ ] T014 Generate Prisma Client types: npx prisma generate

### Shared API Infrastructure

- [ ] T015 [P] Create Axios client instance in src/shared/api/client.ts with interceptors for auth tokens and error handling
- [ ] T016 [P] Define common API types in src/shared/api/types.ts (ApiResponse, ApiError, PaginatedResponse)
- [ ] T017 [P] Create shared API utilities in src/shared/lib/api-utils.ts (error parsing, response formatting)

### Shared UI Components (Ant Design Wrappers)

- [ ] T018 [P] Create Button wrapper component in src/shared/ui/button/Button.tsx
- [ ] T019 [P] Create Input wrapper component in src/shared/ui/input/Input.tsx
- [ ] T020 [P] Create Card wrapper component in src/shared/ui/card/Card.tsx
- [ ] T021 [P] Create Modal wrapper component in src/shared/ui/modal/Modal.tsx
- [ ] T022 [P] Create Form wrapper component in src/shared/ui/form/Form.tsx

### Shared Utilities & Helpers

- [ ] T023 [P] Create date formatting utilities in src/shared/lib/format-date.ts
- [ ] T024 [P] Create email validation utility in src/shared/lib/validate-email.ts
- [ ] T025 [P] Create environment config in src/shared/config/env.ts with type-safe env variable access
- [ ] T026 [P] Create app constants in src/shared/config/constants.ts (API timeouts, file size limits, etc.)

### Feature-Sliced Design Structure

- [ ] T027 [P] Create FSD directory structure: src/entities/, src/features/, src/widgets/, src/pages/
- [ ] T028 [P] Create entity barrel exports in src/entities/index.ts
- [ ] T029 [P] Create feature barrel exports in src/features/index.ts
- [ ] T030 [P] Create widget barrel exports in src/widgets/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Регистрация и Вход в Систему (Priority: P1) 🎯 MVP

**Goal**: Пользователи могут регистрироваться через Google OAuth или Email/Password (с подтверждением email) и входить в систему

**Independent Test**: Создать аккаунт через Google или Email/Password, подтвердить email (для второго варианта), войти в систему и увидеть личный кабинет

**Spec Reference**: §US1, §FR-001 to §FR-004

### Backend Implementation for User Story 1

- [ ] T031 [P] [US1] Create User entity model types in src/entities/user/model/types.ts (User, AuthMethod enum)
- [ ] T032 [US1] Configure NextAuth.js in src/app/api/auth/[...nextauth]/route.ts with Google and Credentials providers
- [ ] T033 [US1] Implement Prisma adapter for NextAuth in src/app/api/auth/[...nextauth]/route.ts
- [ ] T034 [P] [US1] Create user registration API route in src/app/api/auth/register/route.ts with email/password validation
- [ ] T035 [P] [US1] Implement email verification token generation in src/entities/user/lib/generate-token.ts (UUID v4, 24h expiry)
- [ ] T036 [US1] Setup Resend email service in src/shared/lib/email/resend-client.ts
- [ ] T037 [P] [US1] Create React Email verification template in src/shared/lib/email/templates/verification-email.tsx
- [ ] T038 [US1] Implement send verification email function in src/shared/lib/email/send-verification.ts with retry mechanism. Per edge case (spec.md:L116), implement exponential backoff retry queue: 3 attempts with delays 1 min, 5 min, 15 min. If all retries fail, log error and allow manual resend via user profile
- [ ] T039 [US1] Create email verification API route in src/app/api/auth/verify-email/route.ts. IMPORTANT: Check token expiration (tokenExpiresAt) per FR-003a - tokens are valid for 24 hours. If expired, return user-friendly error with option to resend verification email
- [ ] T040 [P] [US1] Implement password hashing with bcrypt in src/entities/user/lib/hash-password.ts (salt rounds: 10)
- [ ] T041 [US1] Create login credentials verification in src/app/api/auth/[...nextauth]/route.ts authorize callback
- [ ] T042 [P] [US1] Create session check API route in src/app/api/auth/session/route.ts

### Frontend Implementation for User Story 1

- [ ] T043 [P] [US1] Create auth feature store in src/features/auth/model/auth-store.ts with Zustand (login, logout, session state)
- [ ] T044 [P] [US1] Create auth API methods in src/features/auth/api/auth-api.ts (register, login, verifyEmail using Axios)
- [ ] T045 [P] [US1] Create LoginForm component in src/features/auth/ui/LoginForm.tsx with Ant Design Form
- [ ] T046 [P] [US1] Create RegisterForm component in src/features/auth/ui/RegisterForm.tsx with client-side email/password validation. IMPORTANT: Implement FR-002b validation rules: minimum 8 characters, at least one digit, at least one letter. Show user-friendly error messages in real-time (use Ant Design Form validation)
- [ ] T047 [P] [US1] Create GoogleOAuthButton component in src/features/auth/ui/GoogleOAuthButton.tsx
- [ ] T048 [US1] Create EmailVerification page component in src/pages/auth-page/EmailVerification.tsx
- [ ] T049 [US1] Create auth page layout in src/app/(auth)/layout.tsx
- [ ] T050 [US1] Create login page in src/app/(auth)/login/page.tsx composing LoginForm and GoogleOAuthButton
- [ ] T051 [US1] Create register page in src/app/(auth)/register/page.tsx composing RegisterForm
- [ ] T052 [US1] Create verify-email page in src/app/(auth)/verify-email/page.tsx
- [ ] T053 [US1] Implement auth middleware in src/middleware.ts to protect authenticated routes
- [ ] T054 [US1] Create authenticated layout in src/app/(dashboard)/layout.tsx with session check

**Checkpoint**: User Story 1 complete - users can register, verify email, and login

---

## Phase 4: User Story 2 - Анализ Фотографии Еды (Priority: P2)

**Goal**: Пользователи могут загружать фотографии еды и получать автоматический анализ продуктов с калорийностью и БЖУ

**Independent Test**: Загрузить фото тарелки с едой, дождаться анализа, увидеть список продуктов с весом, калориями и БЖУ

**Spec Reference**: §US2, §FR-005 to §FR-009

### Backend Implementation for User Story 2

- [ ] T055 [P] [US2] Create FoodPhoto entity model types in src/entities/photo/model/types.ts (PhotoStatus enum)
- [ ] T056 [P] [US2] Create FoodItem entity model types in src/entities/food-item/model/types.ts
- [ ] T057 [P] [US2] Setup Vercel Blob client in src/shared/lib/storage/blob-client.ts with configuration (auto-deletion per FR-005a)
- [ ] T057a [US2] Configure Vercel Blob 30-day auto-deletion via expires parameter in put() calls in src/shared/lib/storage/blob-client.ts. IMPORTANT: All photo uploads MUST include expires: 30 * 24 * 60 * 60 * 1000 (30 days in milliseconds) to satisfy FR-005a automatic deletion requirement
- [ ] T058 [US2] Implement client-side image compression in src/features/photo-analysis/lib/compress-image.ts using browser-image-compression
- [ ] T059 [P] [US2] Create photo upload API route in src/app/api/photos/upload/route.ts with Vercel Blob integration and 10 MB file size validation (FR-021)
- [ ] T060 [US2] Implement HEIC to JPEG conversion in src/app/api/photos/upload/route.ts using sharp
- [ ] T061 [P] [US2] Setup OpenRouter API client in src/shared/api/openrouter.ts with vision model configuration
- [ ] T062 [US2] Implement food photo analysis function in src/shared/api/openrouter.ts (analyzeFoodPhoto with Claude Haiku)
- [ ] T063 [US2] Create photo analysis API route in src/app/api/photos/analyze/route.ts orchestrating OpenRouter API call
- [ ] T064 [P] [US2] Implement USDA FoodData API client in src/shared/api/usda-food-api.ts for nutritional data fallback
- [ ] T065 [US2] Create photo status polling API route in src/app/api/photos/[id]/status/route.ts
- [ ] T066 [US2] Create photo results retrieval API route in src/app/api/photos/[id]/results/route.ts

### Frontend Implementation for User Story 2

- [ ] T067 [P] [US2] Create photo analysis feature store in src/features/photo-analysis/model/photo-store.ts (upload state, results)
- [ ] T068 [P] [US2] Create photo API methods in src/features/photo-analysis/api/photo-api.ts (upload, getStatus, getResults)
- [ ] T069 [P] [US2] Create PhotoUploadButton component in src/features/photo-analysis/ui/PhotoUploadButton.tsx with client-side file size validation (max 10 MB, user-friendly error message before upload)
- [ ] T070 [P] [US2] Create UploadProgress component in src/features/photo-analysis/ui/UploadProgress.tsx with loading indicator
- [ ] T070a [US2] Implement photo processing status polling logic in src/features/photo-analysis/model/photo-store.ts (poll /api/photos/[id]/status every 2 seconds while processingStatus === 'PROCESSING'). Rationale: 2-second interval balances UX responsiveness (photo analysis takes 5-10 seconds per SC-003) with API load. User sees update within 2s of completion, minimal server requests (~5 polls per analysis)
- [ ] T071 [US2] Create PhotoUploadForm widget in src/widgets/photo-upload-form/PhotoUploadForm.tsx
- [ ] T072 [P] [US2] Create FoodItemCard component in src/features/photo-analysis/ui/FoodItemCard.tsx displaying product details
- [ ] T073 [US2] Create FoodItemsList widget in src/widgets/food-items-list/FoodItemsList.tsx displaying all recognized items
- [ ] T074 [US2] Create photo upload page in src/pages/photo-upload-page/PhotoUploadPage.tsx
- [ ] T075 [US2] Create photo upload route in src/app/(dashboard)/photo/page.tsx
- [ ] T076 [P] [US2] Create AddFoodManuallyButton component in src/features/photo-analysis/ui/AddFoodManuallyButton.tsx
- [ ] T077 [P] [US2] Create FoodSearchModal component in src/features/photo-analysis/ui/FoodSearchModal.tsx with USDA API search
- [ ] T078 [P] [US2] Create ManualFoodItemForm component in src/features/photo-analysis/ui/ManualFoodItemForm.tsx (name, weight, nutrition inputs)
- [ ] T079 [US2] Add manual food item API method in src/features/photo-analysis/api/photo-api.ts (searchFood, addManualItem)
- [ ] T080 [US2] Integrate manual add functionality into FoodItemsList widget in src/widgets/food-items-list/FoodItemsList.tsx
- [ ] T081 [US2] Update photo upload page in src/pages/photo-upload-page/PhotoUploadPage.tsx to support manual additions

**Checkpoint**: User Story 2 complete - users can upload photos, see food analysis results, and manually add unrecognized items

---

## Phase 5: User Story 3 - Редактирование и Сохранение Приема Пищи (Priority: P3)

**Goal**: Пользователи могут редактировать вес продуктов (с автоматическим пересчетом калорий) и сохранять прием пищи в профиль с выбором категории

**Independent Test**: Изменить вес продукта, проверить пересчет калорий, сохранить прием пищи с категорией, проверить сохранение в профиле

**Spec Reference**: §US3, §FR-010 to §FR-014

### Backend Implementation for User Story 3

- [ ] T082 [P] [US3] Create Meal entity model types in src/entities/meal/model/types.ts (MealCategory enum)
- [ ] T083 [P] [US3] Implement calorie calculation utility in src/entities/food-item/lib/calculate-nutrition.ts (weight-based macro calculation)
- [ ] T084 [P] [US3] Implement meal category suggestion logic in src/entities/meal/lib/suggest-category.ts (time-based: breakfast/lunch/dinner/snack). Per FR-012, use client-side timezone (new Date().getHours() on client) to determine category: 6-11h = breakfast, 11-16h = lunch, 16-21h = dinner, else = snack. Timezone is captured at meal creation and stored with meal record
- [ ] T085 [US3] Create meal creation API route in src/app/api/meals/route.ts POST (create meal with food items)
- [ ] T086 [P] [US3] Create meal update API route in src/app/api/meals/[id]/route.ts PATCH (update food item weights)
- [ ] T087 [US3] Create meal retrieval API route in src/app/api/meals/[id]/route.ts GET
- [ ] T088 [P] [US3] Implement DailyLog update logic in src/entities/daily-log/lib/update-daily-log.ts (recalculate daily totals from all meals). Architecture: This function is called within Prisma transaction context from meal CRUD operations (src/app/api/meals/route.ts POST/PATCH/DELETE). Ensures atomic updates: meal change + DailyLog recalculation happen together or both fail
- [ ] T089 [US3] Create meal deletion API route in src/app/api/meals/[id]/route.ts DELETE

### Frontend Implementation for User Story 3

- [ ] T090 [P] [US3] Create meal editing feature store in src/features/meal-editing/model/meal-store.ts (editedMeal, recalculate)
- [ ] T091 [P] [US3] Create meal API methods in src/features/meal-editing/api/meal-api.ts (create, update, delete meal)
- [ ] T092 [P] [US3] Create WeightEditor component in src/features/meal-editing/ui/WeightEditor.tsx with real-time recalculation
- [ ] T093 [P] [US3] Create MealCategorySelector component in src/features/meal-editing/ui/MealCategorySelector.tsx (Ant Design Select)
- [ ] T094 [P] [US3] Create SaveMealButton component in src/features/meal-editing/ui/SaveMealButton.tsx
- [ ] T095 [US3] Create MealEditor widget in src/widgets/meal-editor/MealEditor.tsx composing weight editing and category selection
- [ ] T096 [US3] Integrate MealEditor into photo upload page in src/pages/photo-upload-page/PhotoUploadPage.tsx

**Checkpoint**: User Story 3 complete - users can edit food weights and save meals to profile

---

## Phase 6: User Story 4 - Управление Профилем и Целями (Priority: P4)

**Goal**: Пользователи могут настроить профиль (вес, возраст, пол, рост), выбрать цель, и система рассчитывает рекомендуемую дневную калорийность

**Independent Test**: Заполнить профиль с базовыми параметрами, выбрать цель, увидеть рассчитанную рекомендуемую калорийность

**Spec Reference**: §US4, §FR-015 to §FR-017

### Backend Implementation for User Story 4

- [ ] T097 [P] [US4] Create UserProfile entity model types in src/entities/profile/model/types.ts (Gender, GoalType enums)
- [ ] T098 [P] [US4] Implement Mifflin-St Jeor calorie calculation in src/entities/profile/lib/calculate-calories.ts (BMR + TDEE + goal multipliers)
- [ ] T099 [P] [US4] Create profile validation rules in src/entities/profile/lib/validate-profile.ts (weight 30-300kg, height 100-250cm, age 10-120)
- [ ] T100 [US4] Create profile creation API route in src/app/api/profile/route.ts POST with calorie calculation
- [ ] T101 [US4] Create profile update API route in src/app/api/profile/route.ts PATCH with recalculation
- [ ] T102 [US4] Create profile retrieval API route in src/app/api/profile/route.ts GET

### Frontend Implementation for User Story 4

- [ ] T103 [P] [US4] Create profile management feature store in src/features/profile-management/model/profile-store.ts (profile data, update)
- [ ] T104 [P] [US4] Create profile API methods in src/features/profile-management/api/profile-api.ts (get, update profile)
- [ ] T105 [P] [US4] Create ProfileFormFields component in src/features/profile-management/ui/ProfileFormFields.tsx (weight, age, gender, height inputs)
- [ ] T106 [P] [US4] Create GoalSelector component in src/features/profile-management/ui/GoalSelector.tsx (BULK/MAINTAIN/CUT/SUGAR_CONTROL)
- [ ] T107 [P] [US4] Create CalorieDisplay component in src/features/profile-management/ui/CalorieDisplay.tsx showing calculated target
- [ ] T108 [US4] Create ProfileForm widget in src/widgets/profile-form/ProfileForm.tsx composing all profile fields
- [ ] T109 [US4] Create profile page in src/pages/profile-page/ProfilePage.tsx
- [ ] T110 [US4] Create profile route in src/app/(dashboard)/profile/page.tsx

**Checkpoint**: User Story 4 complete - users can manage profile and see personalized calorie recommendations

---

## Phase 7: User Story 5 - Календарь Прогресса (Priority: P5)

**Goal**: Пользователи могут просматривать календарь с визуальными индикаторами дней, в которые они придерживались целевой калорийности

**Independent Test**: Открыть календарь, увидеть дни с активностью, кликнуть на день и увидеть детальную информацию (приемы пищи, отклонение от цели)

**Spec Reference**: §US5, §FR-018 to §FR-020

### Backend Implementation for User Story 5

- [ ] T111 [P] [US5] Create DailyLog entity model types in src/entities/daily-log/model/types.ts
- [ ] T112 [P] [US5] Implement daily log calculation logic in src/entities/daily-log/lib/calculate-daily-log.ts (aggregate meals, deviation %, goal achieved). Formula for goal achievement per FR-019: goalAchieved = (Math.abs(actualCalories - targetCalories) / targetCalories) <= 0.10
- [ ] T113 [US5] Create calendar month data API route in src/app/api/calendar/route.ts GET (returns DailyLog for month range)
- [ ] T114 [US5] Create day details API route in src/app/api/calendar/[date]/route.ts GET (meals for specific day)

### Frontend Implementation for User Story 5

- [ ] T115 [P] [US5] Create progress tracking feature store in src/features/progress-tracking/model/calendar-store.ts (month data, selected day)
- [ ] T116 [P] [US5] Create calendar API methods in src/features/progress-tracking/api/calendar-api.ts (getMonthData, getDayDetails)
- [ ] T117 [P] [US5] Create CalendarDayCell component in src/features/progress-tracking/ui/CalendarDayCell.tsx (green if goal achieved, gray otherwise)
- [ ] T118 [P] [US5] Create DayDetailModal component in src/features/progress-tracking/ui/DayDetailModal.tsx showing meals and totals
- [ ] T119 [US5] Create CalendarView widget in src/widgets/calendar-view/CalendarView.tsx using Ant Design Calendar
- [ ] T120 [US5] Create calendar page in src/pages/calendar-page/CalendarPage.tsx
- [ ] T121 [US5] Create calendar route in src/app/(dashboard)/calendar/page.tsx

**Checkpoint**: User Story 5 complete - users can track progress via visual calendar

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T122 [P] Create app header widget in src/widgets/header/Header.tsx with navigation and user menu
- [ ] T123 [P] Create landing page in src/pages/landing/LandingPage.tsx with feature overview
- [ ] T124 [P] Update root page in src/app/page.tsx to use landing page
- [ ] T125 [P] Add error boundary in src/app/error.tsx for global error handling
- [ ] T126 [P] Add loading states in src/app/loading.tsx for route transitions
- [ ] T127 [P] Create not-found page in src/app/not-found.tsx
- [ ] T128 [P] Implement global error toast notifications using Ant Design message
- [ ] T129 Add environment validation script in scripts/check-env.js
- [ ] T130 [P] Create database seed script in prisma/seed.ts with common food items (optional)
- [ ] T131 [P] Update README.md with project overview and setup instructions
- [ ] T132 Run quickstart.md validation to ensure all setup steps work
- [ ] T133 [P] [Post-MVP] Setup analytics integration for tracking SC-010 (user awareness surveys), SC-011 (30-day retention rate), SC-012 (time to first photo analysis). CRITICAL CONSTITUTION CHECK: Before implementation, verify that selected analytics library (Google Analytics 4 via @next/third-parties or Mixpanel SDK) has full TypeScript support without 'any' types (Принцип I). Recommended: @next/third-parties/google for GA4 (TypeScript-first) or mixpanel-browser@^2.48.0 with @types/mixpanel-browser

**Checkpoint**: Application polished and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies, but benefits from US1 authentication
- **User Story 3 (P3)**: Depends on User Story 2 completion (needs photo analysis results to edit)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories (except US1 for authentication)
- **User Story 5 (P5)**: Depends on User Story 3 completion (needs saved meals for calendar data)

### Optimal Execution Strategy

**MVP First (Most Value, Fastest)**:
1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: US1 (Authentication) → **Can test login/register**
4. Phase 4: US2 (Photo Analysis) → **Can test photo upload and recognition**
5. Phase 5: US3 (Meal Saving) → **Full meal tracking works!** 🎯 **MVP COMPLETE**

**Incremental Delivery After MVP**:
6. Phase 6: US4 (Profile) → Personalized calorie recommendations
7. Phase 7: US5 (Calendar) → Progress tracking
8. Phase 8: Polish → Production-ready

### Parallel Opportunities

- **Setup Phase**: Tasks T002-T010 can run in parallel (all marked [P])
- **Foundational Phase**: Tasks T015-T030 can run in parallel (all marked [P])
- **Within Each User Story**:
  - Backend tasks marked [P] can run in parallel
  - Frontend tasks marked [P] can run in parallel
- **User Stories in Parallel** (if team capacity allows):
  - US1 and US4 can run in parallel (both only need Foundational)
  - After US1 complete: US2 can start
  - After US2 complete: US3 can start
  - After US3 complete: US5 can start

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

Это минимальный набор функций для полноценного трекера калорий:

1. **Complete Setup + Foundational** → Foundation ready
2. **Add US1 (Auth)** → Users can register and login
3. **Add US2 (Photo Analysis)** → Users can upload photos and see results
4. **Add US3 (Meal Saving)** → Users can save meals to track calories
5. **STOP and VALIDATE**: Test complete flow: Register → Upload photo → Edit → Save meal

**MVP Value**: Users can track calories by taking photos - core value proposition complete!

### Incremental Delivery After MVP

6. **Add US4 (Profile)** → Personalized recommendations based on user goals
7. **Add US5 (Calendar)** → Visual progress tracking and motivation
8. **Add Polish** → Production-ready with proper error handling, documentation

Each story adds value without breaking previous functionality.

---

## Task Summary

**Total Tasks**: 134

**By Phase**:
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 20 tasks
- Phase 3 (US1 - Auth): 24 tasks
- Phase 4 (US2 - Photo Analysis): 28 tasks (added T057a for lifecycle policy)
- Phase 5 (US3 - Meal Editing): 15 tasks
- Phase 6 (US4 - Profile): 14 tasks
- Phase 7 (US5 - Calendar): 11 tasks
- Phase 8 (Polish): 11 tasks

**By User Story**:
- US1 (Authentication): 24 tasks
- US2 (Photo Analysis): 28 tasks (added T057a for lifecycle policy)
- US3 (Meal Editing): 15 tasks
- US4 (Profile Management): 14 tasks
- US5 (Calendar Progress): 11 tasks

**Parallel Opportunities**: 49 tasks marked [P] can run in parallel within their phase

**MVP Scope** (US1+US2+US3): 67 implementation tasks + 30 foundational = **97 tasks for MVP**

---

## Format Validation

✅ **All tasks follow required format**: `- [ ] [ID] [P?] [Story?] Description with file path`
✅ **Story labels present** for all user story tasks ([US1], [US2], [US3], [US4], [US5])
✅ **No story labels** for Setup, Foundational, and Polish phases
✅ **Parallel markers [P]** for independent tasks (different files, no dependencies)
✅ **Exact file paths** included in all task descriptions
✅ **Sequential task IDs** T001-T126 in execution order

---

## Notes

- Тесты опциональны согласно конституции проекта (Принцип VII) - основной метод QA: ручное тестирование + TypeScript strict typing + ESLint
- [P] задачи = разные файлы, нет зависимостей, можно выполнять параллельно
- [Story] метка связывает задачу с конкретной user story для отслеживаемости
- Каждая user story должна быть независимо завершаемой и тестируемой
- После каждого checkpoint можно остановиться и протестировать story независимо
- Commit после каждой задачи или логической группы задач
- Избегайте: неясных задач, конфликтов в одном файле, зависимостей между stories, которые нарушают независимость
