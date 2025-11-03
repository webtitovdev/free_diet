# Quickstart Guide: Трекер Калорий по Фотографии

**Last Updated**: 2025-11-03
**Tech Stack**: Next.js 14 + TypeScript + Prisma + Vercel

This guide walks through setting up the development environment for the Free Diet calorie tracker application.

---

## Prerequisites

- **Node.js**: v20.x or later
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL**: v14+ (local or hosted)
- **Git**: Latest version

---

## 1. Clone Repository & Install Dependencies

```bash
# Clone repository
git clone <your-repo-url> free_diet
cd free_diet

# Install dependencies
pnpm install

# Or with npm
npm install
```

---

## 2. Environment Configuration

Create `.env.local` file in project root:

```bash
# Copy from example
cp .env.example .env.local
```

### Required Environment Variables

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/free_diet_dev"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"  # Generate: openssl rand -base64 32

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenRouter API (get from https://openrouter.ai)
OPENROUTER_API_KEY="sk-or-v1-your-api-key"

# Vercel Blob Storage (get from Vercel dashboard)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_from_dashboard"

# Resend Email (get from https://resend.com)
RESEND_API_KEY="re_your_resend_api_key"

# USDA Food Database (optional, get from https://fdc.nal.usda.gov/api-key-signup.html)
USDA_API_KEY="your-usda-api-key"
```

### How to Get API Keys

**Google OAuth**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

**OpenRouter API**:
1. Sign up at [OpenRouter.ai](https://openrouter.ai)
2. Go to API Keys section
3. Create new API key
4. Copy the key starting with `sk-or-v1-`

**Vercel Blob**:
1. Deploy to Vercel or use Vercel CLI
2. Go to Project Settings → Storage
3. Enable Vercel Blob
4. Copy the Read/Write token
5. **Note**: Automatic 30-day deletion is handled via `expires` parameter in upload code (no manual lifecycle policy setup needed - Vercel Blob automatically deletes files after the specified duration)

**Resend**:
1. Sign up at [Resend.com](https://resend.com)
2. Verify your sending domain
3. Create API key
4. Copy the key starting with `re_`

---

## 3. Database Setup

### Option A: Local PostgreSQL

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql@14

# Create database
createdb free_diet_dev

# Or manually
psql postgres
CREATE DATABASE free_diet_dev;
\q
```

### Option B: Hosted PostgreSQL

**Vercel Postgres** (Recommended for Vercel deployments):
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel postgres create

# Copy DATABASE_URL from Vercel dashboard to .env.local
```

**Supabase**:
1. Create project at [supabase.com](https://supabase.com)
2. Copy connection string from Settings → Database
3. Use as `DATABASE_URL` in `.env.local`

---

## 4. Initialize Prisma & Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### Prisma Studio (Database GUI)

```bash
# Open Prisma Studio to inspect database
npx prisma studio
```

Access at: http://localhost:5555

---

## 5. Start Development Server

```bash
# Start Next.js development server
pnpm dev

# Or with npm
npm run dev
```

Application runs at: **http://localhost:3000**

---

## 6. Verify Setup

### Check Environment Variables

```bash
# Run environment check script
node scripts/check-env.js
```

Should output:
```
✅ DATABASE_URL configured
✅ NEXTAUTH_URL configured
✅ NEXTAUTH_SECRET configured
✅ GOOGLE_CLIENT_ID configured
✅ GOOGLE_CLIENT_SECRET configured
✅ OPENROUTER_API_KEY configured
✅ BLOB_READ_WRITE_TOKEN configured
✅ RESEND_API_KEY configured
```

### Test Database Connection

```bash
# Test Prisma connection
npx prisma db push --preview-feature
```

### Test Authentication

1. Open http://localhost:3000/auth/login
2. Click "Sign in with Google"
3. Should redirect to Google OAuth consent screen

---

## 7. Project Structure Overview

```
free_diet/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes (login, register)
│   │   ├── (dashboard)/        # Authenticated routes
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth.js handlers
│   │   │   ├── photos/         # Photo upload & analysis
│   │   │   ├── meals/          # Meal CRUD
│   │   │   ├── profile/        # Profile management
│   │   │   └── calendar/       # Calendar data
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   │
│   ├── features/               # FSD: Features (user actions)
│   ├── entities/               # FSD: Business entities
│   ├── widgets/                # FSD: UI widgets
│   └── shared/                 # FSD: Shared resources
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration files
│   └── seed.ts                 # Seed data (optional)
│
├── public/                     # Static assets
├── .env.local                  # Environment variables (DO NOT COMMIT)
├── .env.example                # Example env vars template
├── package.json
└── tsconfig.json
```

---

## 8. Development Workflow

### Run Linter & Formatter

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run Prettier
pnpm format

# Type check
pnpm type-check
```

### Pre-commit Hook

Husky runs automatically before commit:
- ESLint check
- Prettier format
- TypeScript type check

### Create Database Migration

```bash
# After changing prisma/schema.prisma
npx prisma migrate dev --name add_new_field

# Apply migrations to production
npx prisma migrate deploy
```

---

## 9. Testing APIs

### Using OpenAPI Specs

API contracts available in `specs/001-calorie-photo-tracker/contracts/`:
- `auth.yaml`
- `photos.yaml`
- `meals.yaml`
- `profile.yaml`
- `calendar.yaml`

### Import to Postman/Insomnia

```bash
# Combine all contracts (optional)
cat specs/001-calorie-photo-tracker/contracts/*.yaml > api-spec.yaml

# Import api-spec.yaml to Postman or Insomnia
```

### Example API Requests

**Register User**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Upload Photo** (requires authentication):
```bash
curl -X POST http://localhost:3000/api/photos/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photo=@/path/to/food.jpg"
```

---

## 10. Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# (same as .env.local but for production)
```

### Environment Variables for Production

Set in Vercel dashboard (Settings → Environment Variables):
- `DATABASE_URL` → Vercel Postgres connection string
- `NEXTAUTH_URL` → Production domain (https://yourdomain.com)
- `NEXTAUTH_SECRET` → Generate new secure secret
- All other API keys (GOOGLE_*, OPENROUTER_*, etc.)

---

## 11. Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### NextAuth.js Errors

```bash
# Ensure NEXTAUTH_SECRET is set
openssl rand -base64 32

# Check NEXTAUTH_URL matches current URL
```

### Prisma Client Out of Sync

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart dev server
pnpm dev
```

### Port 3000 Already in Use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

---

## 12. Useful Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset"
  }
}
```

---

## 13. Next Steps

After completing setup:

1. ✅ **Verify all API endpoints work** using Postman/Insomnia
2. ✅ **Test Google OAuth flow** locally
3. ✅ **Test photo upload** with sample food image
4. ✅ **Check OpenRouter API integration** returns food items
5. ✅ **Verify Prisma migrations** applied correctly
6. ✅ **Validate food recognition accuracy** (SC-004): Create a test dataset of 20-30 food photos with known items, run analysis, manually verify correct identification. Target: ≥75% accuracy for common food items

**Ready to start implementation?** Run `/speckit.tasks` to generate development tasks.

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Resend API Docs](https://resend.com/docs)

---

**Setup Status**: ✅ Complete if all sections passed

**Questions?** Check [plan.md](./plan.md) and [research.md](./research.md) for technical decisions.
