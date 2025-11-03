/**
 * Application Constants
 * Константы приложения для переиспользования
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 секунд
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000, // 1 секунда начальная задержка
} as const;

/**
 * File Upload Configuration (Spec §FR-021)
 */
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10, // Максимальный размер файла
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB в байтах
  ALLOWED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/heic"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".heic"],
} as const;

/**
 * Photo Storage Configuration (Spec §FR-005a)
 */
export const PHOTO_STORAGE = {
  AUTO_DELETE_DAYS: 30, // Автоудаление через 30 дней
  AUTO_DELETE_MS: 30 * 24 * 60 * 60 * 1000, // 30 дней в миллисекундах
  MAX_WIDTH: 1920, // Максимальная ширина для compression
  JPEG_QUALITY: 85, // Качество JPEG сжатия (0-100)
} as const;

/**
 * Authentication Configuration
 */
export const AUTH = {
  TOKEN_EXPIRY_HOURS: 24, // Verification token TTL (Spec §FR-003a)
  TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
  MIN_PASSWORD_LENGTH: 8, // Минимальная длина пароля (Spec §FR-002b)
  SESSION_MAX_AGE_DAYS: 30, // Срок действия session
} as const;

/**
 * Profile Validation Rules (from research.md R006)
 */
export const PROFILE_VALIDATION = {
  WEIGHT: { MIN: 30, MAX: 300, UNIT: "kg" }, // Вес в кг
  HEIGHT: { MIN: 100, MAX: 250, UNIT: "cm" }, // Рост в см
  AGE: { MIN: 10, MAX: 120, UNIT: "years" }, // Возраст в годах
} as const;

/**
 * Calorie Calculation Constants (from research.md R006)
 */
export const CALORIE_CALC = {
  ACTIVITY_MULTIPLIER: 1.2, // Sedentary activity level
  GOAL_MULTIPLIERS: {
    BULK: 1.15, // +15% surplus для набора массы
    MAINTAIN: 1.0, // Maintenance для удержания веса
    CUT: 0.85, // -15% deficit для похудения
    SUGAR_CONTROL: 1.0, // Maintenance для контроля сахара
  },
  GENDER_OFFSETS: {
    MALE: 5,
    FEMALE: -161,
  },
} as const;

/**
 * Daily Log Configuration (Spec §FR-019)
 */
export const DAILY_LOG = {
  GOAL_DEVIATION_THRESHOLD: 0.1, // ±10% deviation считается успехом
} as const;

/**
 * Meal Category Time Suggestions (Spec §FR-012)
 */
export const MEAL_TIME_RANGES = {
  BREAKFAST: { START: 6, END: 11 }, // 6:00-11:00
  LUNCH: { START: 11, END: 16 }, // 11:00-16:00
  DINNER: { START: 16, END: 21 }, // 16:00-21:00
  // SNACK: other times
} as const;

/**
 * Photo Processing Configuration (Spec §SC-003)
 */
export const PHOTO_PROCESSING = {
  MAX_PROCESSING_TIME_MS: 10000, // 10 секунд максимум для анализа
  POLL_INTERVAL_MS: 2000, // Polling каждые 2 секунды
  MIN_CONFIDENCE_THRESHOLD: 0.5, // Минимальная уверенность AI (0-1)
} as const;

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  DISPLAY: "DD.MM.YYYY", // Формат для отображения
  DISPLAY_WITH_TIME: "DD.MM.YYYY HH:mm",
  API: "YYYY-MM-DD", // ISO 8601 для API
  CALENDAR: "YYYY-MM-DD", // Формат для календаря
} as const;

/**
 * OpenRouter API Configuration (from research.md R005)
 */
export const OPENROUTER = {
  DEFAULT_MODEL: "anthropic/claude-3-haiku", // Fast & cost-effective для MVP
  PRODUCTION_MODEL: "anthropic/claude-3-sonnet", // Better accuracy для production
  TIMEOUT_MS: 30000, // 30 секунд timeout
} as const;

/**
 * Success Criteria Thresholds (Spec Success Criteria)
 */
export const SUCCESS_CRITERIA = {
  MIN_FOOD_RECOGNITION_ACCURACY: 0.75, // SC-004: 75% minimum accuracy
  MAX_PHOTO_ANALYSIS_TIME_MS: 10000, // SC-003: < 10 seconds
  MAX_CALENDAR_LOAD_TIME_MS: 2000, // SC-009: < 2 seconds
  MAX_WEIGHT_RECALC_TIME_MS: 1000, // SC-006: < 1 second
} as const;

/**
 * App Routes
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  DASHBOARD: "/dashboard",
  PHOTO_UPLOAD: "/photos/upload",
  PROFILE: "/profile",
  CALENDAR: "/calendar",
} as const;

/**
 * Local Storage Keys
 */
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Ошибка сети. Проверьте подключение к интернету.",
  UNAUTHORIZED: "Необходима авторизация.",
  FORBIDDEN: "Недостаточно прав для выполнения операции.",
  NOT_FOUND: "Ресурс не найден.",
  SERVER_ERROR: "Ошибка сервера. Попробуйте позже.",
  RATE_LIMIT: "Превышен лимит запросов. Попробуйте позже.",
  VALIDATION_ERROR: "Ошибка валидации данных.",
  FILE_TOO_LARGE: `Файл слишком большой. Максимальный размер: ${FILE_UPLOAD.MAX_SIZE_MB} MB`,
  INVALID_FILE_FORMAT: "Неверный формат файла. Разрешены: JPG, PNG, HEIC",
} as const;
