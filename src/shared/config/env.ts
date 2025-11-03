/**
 * Environment Configuration
 * Безопасный доступ к environment variables с валидацией
 */

/**
 * Валидирует, что все обязательные environment variables присутствуют
 */
function validateEnv(): void {
  const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET"];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env file and ensure all required variables are set."
    );
  }
}

/**
 * Получает environment variable с валидацией
 * TODO: Будет использоваться для динамического получения переменных
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }

  return value || defaultValue || "";
}

/**
 * Проверяет, является ли текущая среда production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Проверяет, является ли текущая среда development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Проверяет, является ли текущая среда test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Environment configuration объект
 */
export const env = {
  // Node environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // NextAuth.js
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",

  // OpenRouter API
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",

  // Vercel Blob Storage
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || "",

  // Resend Email
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",

  // USDA Food Database (optional)
  USDA_API_KEY: process.env.USDA_API_KEY,

  // Helper functions
  isProduction: isProduction(),
  isDevelopment: isDevelopment(),
  isTest: isTest(),
} as const;

// Валидация при импорте модуля (только на сервере)
if (typeof window === "undefined" && !isTest()) {
  try {
    validateEnv();
  } catch (error) {
    console.error("Environment validation failed:", error);
    // В production останавливаем приложение, в development логируем warning
    if (isProduction()) {
      process.exit(1);
    }
  }
}

export default env;
