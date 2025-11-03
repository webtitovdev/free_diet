# Technical Research: Трекер Калорий по Фотографии

**Date**: 2025-11-03
**Phase**: 0 (Research & Decision Making)
**Plan**: [plan.md](./plan.md)

This document resolves all NEEDS CLARIFICATION items from the implementation plan.

---

## R001: Authentication Strategy Selection

### Decision: NextAuth.js v5 (Auth.js)

**Rationale**:
- ✅ **Native Next.js integration** - Built specifically for Next.js App Router
- ✅ **Google OAuth support** - First-class OAuth provider integration out of the box
- ✅ **Email verification flow** - Built-in email verification with customizable templates
- ✅ **Session management** - JWT or database sessions, edge-compatible
- ✅ **TypeScript-first** - Excellent type safety with full TypeScript support
- ✅ **Open source** - No vendor lock-in, free for any scale
- ✅ **Active community** - Large ecosystem, extensive documentation

**Alternatives Considered**:
- **Clerk** ❌ - Excellent features but adds cost ($25/mo for production), overkill for MVP
- **Custom JWT** ❌ - More implementation effort, higher security risk, no OAuth benefits

**Implementation Details**:
```typescript
// auth.config.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Custom email/password verification logic
        // Returns user object or null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add custom fields to JWT
      if (user) {
        token.userId = user.id
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      // Expose custom fields to session
      session.user.id = token.userId as string
      session.user.emailVerified = token.emailVerified as boolean
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-email',
    error: '/auth/error',
  },
})
```

**Email Verification Flow**:
- Use NextAuth.js `sendVerificationRequest` callback
- Generate UUID token, store in database with 24h expiration
- Send verification email with unique link
- Verify token on callback, mark user as verified

**Dependencies**:
- `next-auth@^5.0.0-beta` (v5 for App Router support)
- `@auth/prisma-adapter` (if using Prisma)

---

## R002: Database & ORM Selection

### Decision: PostgreSQL + Prisma

**Rationale**:
- ✅ **Relational integrity** - Complex relationships между User, Meal, FoodPhoto, DailyLog
- ✅ **Best-in-class TypeScript support** - Auto-generated types, complete type safety
- ✅ **Migration system** - Schema versioning, easy evolution
- ✅ **Prisma Studio** - GUI for database inspection during development
- ✅ **Query optimization** - Efficient JOINs for calendar aggregations (DailyLog)
- ✅ **Compatibility** - Works with Vercel Postgres, Supabase, Railway, AWS RDS
- ✅ **Ecosystem** - Excellent Next.js integration, NextAuth.js adapter available

**Alternatives Considered**:
- **Drizzle** ✅ - Lightweight, SQL-first, but less mature ecosystem than Prisma
- **MongoDB + Mongoose** ❌ - Document model awkward for strong relationships (User ↔ Meal ↔ Photo)

**Schema Preview** (entities from spec):
```prisma
model User {
  id               String   @id @default(uuid())
  email            String   @unique
  emailVerified    DateTime?
  hashedPassword   String?  // null для Google OAuth
  authMethod       AuthMethod
  verificationToken String?  @unique
  tokenExpiresAt   DateTime?
  createdAt        DateTime @default(now())

  profile          UserProfile?
  photos           FoodPhoto[]
  meals            Meal[]
  dailyLogs        DailyLog[]
}

enum AuthMethod {
  GOOGLE
  EMAIL_PASSWORD
}

model UserProfile {
  id                  String   @id @default(uuid())
  userId              String   @unique
  weight              Float    // кг
  age                 Int      // лет
  gender              Gender
  height              Int      // см
  goal                GoalType
  targetCalories      Int      // calculated калории
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Gender {
  MALE
  FEMALE
}

enum GoalType {
  BULK          // Набор массы
  MAINTAIN      // Удержание веса
  CUT           // Похудение
  SUGAR_CONTROL // Контроль сахара
}

model FoodPhoto {
  id               String   @id @default(uuid())
  userId           String
  storageUrl       String   // URL в S3/Cloudinary
  uploadedAt       DateTime @default(now())
  autoDeleteAt     DateTime // uploadedAt + 30 days
  processingStatus PhotoStatus

  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  meal             Meal?    // Optional - meal может существовать без фото
}

enum PhotoStatus {
  UPLOADING
  PROCESSING
  COMPLETED
  FAILED
}

model Meal {
  id           String   @id @default(uuid())
  userId       String
  photoId      String?  @unique // Optional
  date         DateTime
  category     MealCategory
  totalCalories Float
  totalProtein Float    // белки
  totalFats    Float    // жиры
  totalCarbs   Float    // углеводы
  createdAt    DateTime @default(now())

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  photo        FoodPhoto? @relation(fields: [photoId], references: [id], onDelete: SetNull)
  foodItems    FoodItem[]
}

enum MealCategory {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}

model FoodItem {
  id            String   @id @default(uuid())
  mealId        String
  name          String   // название продукта
  weight        Float    // граммы или quantity
  caloriesPer100g Float
  proteinPer100g  Float
  fatsPer100g     Float
  carbsPer100g    Float
  addedManually Boolean  @default(false)

  meal          Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)
}

model DailyLog {
  id               String   @id @default(uuid())
  userId           String
  date             DateTime @unique // дата без времени
  totalCalories    Float
  totalProtein     Float
  totalFats        Float
  totalCarbs       Float
  deviationPercent Float    // отклонение от target
  goalAchieved     Boolean  // ±10% from target

  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
}
```

**Dependencies**:
- `prisma@^5.7.0`
- `@prisma/client@^5.7.0`
- `@auth/prisma-adapter@^1.0.0` (for NextAuth integration)

**Database Hosting Recommendation**:
- **Vercel Postgres** - Seamless Vercel deployment, generous free tier
- **Alternative**: Supabase (includes auth if needed), Railway (affordable)

---

## R003: File Storage Strategy

### Decision: Vercel Blob Storage

**Rationale**:
- ✅ **Next.js native integration** - Zero configuration with Vercel deployment
- ✅ **30-day TTL support** - Built-in lifecycle policies via `expires` option
- ✅ **CDN included** - Global edge network for fast photo serving
- ✅ **Simple API** - Single SDK call for upload, signed URLs automatic
- ✅ **Cost-effective for MVP** - Free tier: 1GB storage + 100GB bandwidth/month
- ✅ **TypeScript SDK** - Full type safety

**Alternatives Considered**:
- **AWS S3** ✅ - More features, but complex setup (IAM, bucket policies, lifecycle rules)
- **Cloudinary** ❌ - Image-focused features unnecessary, higher cost
- **Local filesystem** ❌ - No auto-deletion, no CDN, not scalable

**Implementation Example**:
```typescript
import { put, del } from '@vercel/blob';

// Upload photo with 30-day expiration
export async function uploadFoodPhoto(file: File, userId: string) {
  const blob = await put(`photos/${userId}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
    expires: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  });

  return {
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
  };
}

// Manual deletion if needed
export async function deleteFoodPhoto(url: string) {
  await del(url);
}
```

**Automatic Cleanup**:
- Vercel Blob automatically deletes files after `expires` duration
- No manual cleanup job required
- Database records (FoodPhoto) can reference deleted URLs safely (FK with onDelete: SetNull)

**Dependencies**:
- `@vercel/blob@^0.17.0`

**Cost Estimate** (after free tier):
- Storage: $0.15/GB/month
- Bandwidth: $0.20/GB
- For 1000 photos/month (avg 2MB each): ~$2/month storage + bandwidth

---

## R004: Email Service Provider

### Decision: Resend

**Rationale**:
- ✅ **Developer-first** - Clean API, React Email integration
- ✅ **Next.js ecosystem** - Recommended by Vercel, excellent DX
- ✅ **High deliverability** - Built on AWS SES, 99% delivery rate
- ✅ **Free tier** - 3,000 emails/month free (sufficient for MVP email verification)
- ✅ **React Email templates** - Type-safe, component-based email design
- ✅ **TypeScript SDK** - Full type safety

**Alternatives Considered**:
- **SendGrid** ✅ - Robust, but more complex API, free tier only 100 emails/day
- **SMTP** ❌ - Poor deliverability, no analytics, manual template management

**Implementation Example**:
```typescript
import { Resend } from 'resend';
import VerificationEmail from '@/emails/verification-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
  userName: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'Free Diet <noreply@yourdomain.com>',
    to: email,
    subject: 'Подтвердите ваш email',
    react: VerificationEmail({ userName, verificationUrl }),
  });
}
```

**React Email Template Example**:
```tsx
// emails/verification-email.tsx
import { Html, Button, Text } from '@react-email/components';

export default function VerificationEmail({
  userName,
  verificationUrl,
}: {
  userName: string;
  verificationUrl: string;
}) {
  return (
    <Html>
      <Text>Привет, {userName}!</Text>
      <Text>Подтвердите ваш email, чтобы активировать аккаунт:</Text>
      <Button href={verificationUrl}>Подтвердить Email</Button>
      <Text>Ссылка действительна в течение 24 часов.</Text>
    </Html>
  );
}
```

**Dependencies**:
- `resend@^2.0.0`
- `@react-email/components@^0.0.11`
- `react-email@^2.0.0` (for local testing)

**Cost Estimate**:
- Free tier: 3,000 emails/month
- After: $0.001/email ($1 per 1,000 emails)
- MVP estimate: 500 verifications/month = FREE

---

## R005: OpenRouter API Integration Pattern

### Decision: REST API via Axios with Vision Model

**Rationale**:
- ✅ **OpenRouter supports vision models** - GPT-4 Vision, Claude 3, LLaVA for image analysis
- ✅ **Single API for multiple LLMs** - Can switch models without code changes
- ✅ **Pay-per-use pricing** - No subscription, only pay for API calls
- ✅ **Structured outputs** - JSON mode for consistent food item extraction
- ✅ **TypeScript types** - Define request/response schemas

**API Integration Pattern**:
```typescript
// src/shared/api/openrouter.ts
import axios from 'axios';

const openRouterClient = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'HTTP-Referer': process.env.NEXTAUTH_URL,
    'X-Title': 'Free Diet',
  },
});

interface FoodItem {
  name: string;
  weight_grams: number; // IMPORTANT: OpenRouter vision model estimates this from visual analysis (FR-007). Expected accuracy: ±20-30% (user can edit later)
  calories_per_100g: number;
  protein_per_100g: number;
  fats_per_100g: number;
  carbs_per_100g: number;
  confidence: number; // 0-1
}

export async function analyzeFoodPhoto(imageUrl: string): Promise<FoodItem[]> {
  const response = await openRouterClient.post('/chat/completions', {
    model: 'anthropic/claude-3-haiku', // or 'openai/gpt-4-vision-preview'
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
          {
            type: 'text',
            text: `Analyze this food image and identify all food items.
For each item, estimate:
- Name (in Russian)
- Weight in grams (estimate from visual portion size - this will have ±20-30% accuracy, user can adjust later)
- Nutritional values per 100g (calories, protein, fats, carbs)
- Confidence score (0-1)

Return JSON array of food items in format: {"foodItems": [...]}.`,
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.data.choices[0].message.content;
  const parsed = JSON.parse(content);
  return parsed.foodItems;
}
```

**Error Handling**:
```typescript
export async function analyzeFoodPhotoWithFallback(imageUrl: string) {
  try {
    return await analyzeFoodPhoto(imageUrl);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      if (error.response?.status >= 500) {
        throw new Error('OpenRouter service unavailable. Please try again later.');
      }
    }
    throw new Error('Failed to analyze photo. Please try again.');
  }
}
```

**Model Recommendation**:
- **MVP**: `anthropic/claude-3-haiku` - Fast, cost-effective ($0.25/1M tokens)
- **Production**: `anthropic/claude-3-sonnet` - Better accuracy ($3/1M tokens)
- **Alternative**: `openai/gpt-4-vision-preview` - Excellent but pricier

**Dependencies**:
- `axios@^1.6.0` (already in stack)

**Cost Estimate**:
- Average request: ~1000 tokens (image + prompt + response)
- Haiku: $0.00025 per image analysis
- 1000 analyses/month: $0.25
- Very affordable for MVP

**Fallback Strategy**:
- If API returns low confidence scores (<0.5), allow manual food entry (Spec §FR-023)
- If API unavailable (500 errors), show user-friendly error, allow retry
- Store API responses in database for audit/improvement

---

## R006: Calorie Calculation Formula Implementation

### Decision: Mifflin-St Jeor Equation with Goal Multipliers

**Rationale**:
- ✅ **Industry standard** - Most accurate for general population
- ✅ **Simple inputs** - Only needs age, weight, height, gender
- ✅ **Validated formula** - Widely used in nutrition apps

**Formula Implementation**:
```typescript
// src/entities/profile/lib/calculate-calories.ts

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum GoalType {
  BULK = 'BULK',           // Набор массы
  MAINTAIN = 'MAINTAIN',   // Удержание веса
  CUT = 'CUT',             // Похудение
  SUGAR_CONTROL = 'SUGAR_CONTROL', // Контроль сахара
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 *
 * Men: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Women: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 */
function calculateBMR(
  weight: number, // кг
  height: number, // см
  age: number,    // лет
  gender: Gender
): number {
  const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === Gender.MALE ? baseBMR + 5 : baseBMR - 161;
}

/**
 * Activity multiplier (assuming sedentary for MVP)
 * Sedentary (little to no exercise): BMR × 1.2
 * Could be made configurable in future versions
 */
const ACTIVITY_MULTIPLIER = 1.2;

/**
 * Goal-based calorie adjustment
 */
const GOAL_MULTIPLIERS = {
  [GoalType.BULK]: 1.15,        // +15% surplus
  [GoalType.MAINTAIN]: 1.0,     // maintenance
  [GoalType.CUT]: 0.85,         // -15% deficit
  [GoalType.SUGAR_CONTROL]: 1.0, // maintenance, carb focus
};

export function calculateTargetCalories(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  goal: GoalType
): number {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = bmr * ACTIVITY_MULTIPLIER; // Total Daily Energy Expenditure
  const targetCalories = tdee * GOAL_MULTIPLIERS[goal];

  return Math.round(targetCalories); // округление до целого
}

/**
 * Validation rules for profile inputs (from Spec clarifications)
 */
export const PROFILE_VALIDATION = {
  weight: { min: 30, max: 300, unit: 'kg' },      // reasonable human range
  height: { min: 100, max: 250, unit: 'cm' },     // reasonable human range
  age: { min: 10, max: 120, unit: 'years' },      // app usage age range
};

export function validateProfileInput(
  weight: number,
  height: number,
  age: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (weight < PROFILE_VALIDATION.weight.min || weight > PROFILE_VALIDATION.weight.max) {
    errors.push(`Вес должен быть от ${PROFILE_VALIDATION.weight.min} до ${PROFILE_VALIDATION.weight.max} кг`);
  }
  if (height < PROFILE_VALIDATION.height.min || height > PROFILE_VALIDATION.height.max) {
    errors.push(`Рост должен быть от ${PROFILE_VALIDATION.height.min} до ${PROFILE_VALIDATION.height.max} см`);
  }
  if (age < PROFILE_VALIDATION.age.min || age > PROFILE_VALIDATION.age.max) {
    errors.push(`Возраст должен быть от ${PROFILE_VALIDATION.age.min} до ${PROFILE_VALIDATION.age.max} лет`);
  }

  return { valid: errors.length === 0, errors };
}
```

**Example Usage**:
```typescript
const targetCalories = calculateTargetCalories(
  75,            // weight: 75 kg
  180,           // height: 180 cm
  30,            // age: 30 years
  Gender.MALE,
  GoalType.CUT   // похудение
);
// Result: ~2040 kcal/day (BMR ~1700 × 1.2 activity × 0.85 deficit)
```

**Goal Multipliers Explanation**:
- **BULK (Набор массы)**: +15% calorie surplus for muscle building
- **MAINTAIN (Удержание)**: 0% adjustment, maintenance calories
- **CUT (Похудение)**: -15% calorie deficit for fat loss
- **SUGAR_CONTROL (Контроль сахара)**: Maintenance calories, focus on carb tracking (future feature)

---

## R007: Food Database Source

### Decision: Hybrid Approach - USDA API + Local Seeded Database

**Rationale**:
- ✅ **USDA FoodData Central** - Free, comprehensive, reliable
- ✅ **Local seed for common foods** - Fast lookup, no API calls for popular items
- ✅ **Fallback chain** - Local → USDA API → Manual entry
- ✅ **Cost-effective** - Free tier: 1000 requests/hour (sufficient)

**Hybrid Strategy**:
1. **Check local database first** - Fast lookup for ~500 common Russian/international foods
2. **Fallback to USDA API** - If not found locally, query USDA FoodData Central
3. **Manual entry** - If both fail, allow user to add manually (Spec §FR-023)

**USDA API Integration**:
```typescript
// src/shared/api/usda-food-api.ts
import axios from 'axios';

const usdaClient = axios.create({
  baseURL: 'https://api.nal.usda.gov/fdc/v1',
  params: {
    api_key: process.env.USDA_API_KEY, // Free key from https://fdc.nal.usda.gov/api-key-signup.html
  },
});

interface FoodNutrition {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
}

export async function searchFoodNutrition(query: string): Promise<FoodNutrition[]> {
  const response = await usdaClient.get('/foods/search', {
    params: {
      query,
      pageSize: 5,
      dataType: 'Survey (FNDDS)', // Most comprehensive nutritional data
    },
  });

  return response.data.foods.map((food: any) => ({
    name: food.description,
    caloriesPer100g: getNutrient(food, 'Energy', 'kcal'),
    proteinPer100g: getNutrient(food, 'Protein', 'g'),
    fatsPer100g: getNutrient(food, 'Total lipid (fat)', 'g'),
    carbsPer100g: getNutrient(food, 'Carbohydrate, by difference', 'g'),
  }));
}

function getNutrient(food: any, nutrientName: string, unit: string): number {
  const nutrient = food.foodNutrients.find(
    (n: any) => n.nutrientName === nutrientName && n.unitName === unit
  );
  return nutrient ? nutrient.value : 0;
}
```

**Local Seeded Database**:
- Create Prisma seed with ~500 common foods (chicken, rice, apple, etc.)
- Include Russian food names + translations
- Priority: Most frequently photographed foods

**Dependencies**:
- `axios@^1.6.0` (already in stack)
- No additional packages needed

**Cost**: Free (USDA API has no cost, only rate limits)

---

## R008: Photo Preprocessing Requirements

### Decision: Minimal Server-Side Preprocessing

**Rationale**:
- ✅ **Client-side compression** - Reduce upload time, save bandwidth
- ✅ **Server-side format normalization** - Handle HEIC → JPG conversion
- ✅ **Optimal size for OpenRouter** - Balance quality vs API cost

**Preprocessing Pipeline**:

**Client-Side** (before upload):
```typescript
// src/features/photo-analysis/lib/compress-image.ts
import imageCompression from 'browser-image-compression';

export async function compressPhotoBeforeUpload(file: File): Promise<File> {
  const options = {
    maxSizeMB: 5,                    // Max 5MB (spec allows 10MB, but compress for speed)
    maxWidthOrHeight: 1920,          // Sufficient for recognition, not excessive
    useWebWorker: true,              // Performance
    fileType: 'image/jpeg',          // Normalize to JPEG
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression failed, using original:', error);
    return file; // Fallback to original if compression fails
  }
}
```

**Server-Side** (Next.js API route):
```typescript
// src/app/api/photos/upload/route.ts
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('photo') as File;

  // Convert HEIC to JPEG if needed (iOS photos)
  let buffer = Buffer.from(await file.arrayBuffer());
  if (file.type === 'image/heic' || file.name.endsWith('.heic')) {
    buffer = await sharp(buffer).jpeg({ quality: 85 }).toBuffer();
  }

  // Upload to Vercel Blob
  const blob = await put(`photos/${userId}/${Date.now()}.jpg`, buffer, {
    access: 'public',
    expires: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return Response.json({ url: blob.url });
}
```

**Preprocessing Strategy**:
- **Format**: Convert all to JPEG (universal, best compression)
- **Size**: Max 1920px longest edge (sufficient for food recognition)
- **Quality**: 85% JPEG quality (good balance)
- **Compression**: ~5MB target (faster uploads)

**Dependencies**:
- Client: `browser-image-compression@^2.0.2`
- Server: `sharp@^0.33.0` (for HEIC conversion)

**Performance Impact**:
- Client compression: ~1-2s for 8MB photo
- Server HEIC conversion: ~0.5s
- Upload time reduction: 50-70% (8MB → 3MB)

---

## R009: Development & Deployment Environment

### Decision: Vercel for Hosting + Environment Configuration

**Rationale**:
- ✅ **Zero-config Next.js deployment** - Native integration, automatic optimization
- ✅ **Edge Functions** - Fast API routes globally
- ✅ **Preview deployments** - Every git push gets preview URL
- ✅ **Free tier generous** - Sufficient for MVP (100GB bandwidth, 1000 edge requests/day)
- ✅ **Integrated monitoring** - Analytics, error tracking built-in

**Alternatives Considered**:
- **AWS** ❌ - Complex setup (ALB, ECS/EC2, CloudFront), higher DevOps overhead
- **Self-hosted** ❌ - Requires VPS management, no edge network

**Environment Variables Configuration**:

```bash
# .env.local (development)

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/free_diet_dev"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenRouter API
OPENROUTER_API_KEY="sk-or-v1-your-api-key"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_token_from_dashboard"

# Resend Email
RESEND_API_KEY="re_your_resend_api_key"

# USDA Food Database (optional)
USDA_API_KEY="your-usda-api-key-from-fdc.nal.usda.gov"
```

**Vercel Environment Setup**:
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard (Settings → Environment Variables)
3. Use Vercel Postgres for database (or Supabase, Railway)
4. Enable Vercel Blob in project settings

**Database Hosting Recommendation**:
- **Vercel Postgres** (Primary choice) - Native integration, generous free tier (256MB, 60h/month)
- **Supabase** (Alternative) - Includes auth, realtime features (if needed), 500MB free
- **Railway** (Alternative) - Simple, affordable ($5/mo), good for production scale

**CI/CD Pipeline** (GitHub Actions):
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npx prisma validate

  # Vercel deployment happens automatically on push
```

**Cost Estimate (MVP scale, 100 users)**:
- **Vercel Hosting**: FREE (within free tier limits)
- **Vercel Postgres**: FREE (256MB sufficient for MVP)
- **Vercel Blob**: FREE (1GB storage, 100GB bandwidth)
- **Resend**: FREE (3000 emails/month)
- **OpenRouter**: ~$5/month (1000 image analyses with Haiku)
- **USDA API**: FREE

**Total**: ~$5/month for MVP

**Production Scale Cost Estimate (1000 users)**:
- **Vercel Pro**: $20/month (required for higher limits)
- **Vercel Postgres**: $12/month (2GB database)
- **Vercel Blob**: ~$5/month (10GB storage + bandwidth)
- **Resend**: FREE (within 3000 emails)
- **OpenRouter**: ~$50/month (10,000 analyses)

**Total**: ~$87/month for 1000 active users

---

## Summary of Research Decisions

| Research Item | Decision | Primary Rationale |
|---------------|----------|-------------------|
| **R001: Auth** | NextAuth.js v5 | Native Next.js integration, free, TypeScript-first |
| **R002: Database** | PostgreSQL + Prisma | Best TypeScript support, complex relationships |
| **R003: File Storage** | Vercel Blob | Native integration, auto-deletion, cost-effective |
| **R004: Email** | Resend | Developer-friendly, Next.js ecosystem, free tier |
| **R005: OpenRouter** | REST API + Axios | Vision models, pay-per-use, JSON mode |
| **R006: Calories** | Mifflin-St Jeor | Industry standard, simple inputs, validated |
| **R007: Food DB** | USDA API + Local Seed | Free, comprehensive, hybrid fallback |
| **R008: Preprocessing** | Client + Server (minimal) | Client compression, server HEIC handling |
| **R009: Hosting** | Vercel + Postgres | Zero-config, edge functions, free tier |

---

## Updated Dependencies List

**Frontend Dependencies**:
```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "zustand": "^4.5.0",
    "axios": "^1.6.5",
    "antd": "^5.12.8",
    "next-auth": "^5.0.0-beta.4",
    "@auth/prisma-adapter": "^1.0.12",
    "@prisma/client": "^5.7.1",
    "@vercel/blob": "^0.17.0",
    "resend": "^2.1.0",
    "@react-email/components": "^0.0.11",
    "browser-image-compression": "^2.0.2",
    "sharp": "^0.33.1",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "@types/bcrypt": "^5.0.2",
    "prisma": "^5.7.1",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.1.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "react-email": "^2.0.0"
  }
}
```

---

## Next Actions

✅ **Phase 0 Complete** - All NEEDS CLARIFICATION items resolved

**Phase 1 Ready to Begin**:
1. Generate `data-model.md` from Prisma schema
2. Create API contracts in `contracts/` (OpenAPI specs)
3. Generate `quickstart.md` with setup instructions
4. Update agent context with finalized tech stack

---

**Research Status**: ✅ COMPLETE | **Ready for Phase 1**: YES
