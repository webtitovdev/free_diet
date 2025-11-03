// Конфигурация Resend email service
// T036: Setup Resend клиента

import { Resend } from "resend";

// Инициализация Resend клиента с API ключом из переменных окружения
export const resendClient = new Resend(process.env.RESEND_API_KEY);

// Email отправителя (должен быть настроен в Resend dashboard)
export const FROM_EMAIL = process.env.EMAIL_FROM || "Free Diet <noreply@freediet.com>";
