// Функция отправки verification email с retry механизмом
// T038: Exponential backoff retry: 3 attempts (1 min, 5 min, 15 min)

import { resendClient, FROM_EMAIL } from "./resend-client";
import VerificationEmail from "./templates/verification-email";

interface SendVerificationEmailParams {
  email: string;
  token: string;
}

/**
 * Задержка выполнения на указанное время (в миллисекундах)
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Отправляет verification email с механизмом retry
 * @param params Email адрес и токен верификации
 * @returns true если отправка успешна
 * @throws Error если все попытки отправки провалились
 */
export async function sendVerificationEmail({
  email,
  token,
}: SendVerificationEmailParams): Promise<boolean> {
  // Формируем URL для верификации
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  // Retry параметры: 3 попытки с задержками 1 мин, 5 мин, 15 мин
  const retryDelays = [
    1 * 60 * 1000, // 1 минута
    5 * 60 * 1000, // 5 минут
    15 * 60 * 1000, // 15 минут
  ];

  let lastError: Error | null = null;

  // Первая попытка + 3 retry
  for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
    try {
      await resendClient.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Подтвердите ваш email - Free Diet",
        react: VerificationEmail({
          email,
          verificationUrl,
        }),
      });

      // Успешная отправка
      console.log(`Verification email sent successfully to ${email} (attempt ${attempt + 1})`);
      return true;
    } catch (error) {
      lastError = error as Error;
      console.error(
        `Failed to send verification email to ${email} (attempt ${attempt + 1}):`,
        error
      );

      // Если это не последняя попытка, ждем перед следующей
      if (attempt < retryDelays.length) {
        const delayMs = retryDelays[attempt];
        console.log(`Retrying in ${delayMs / 1000 / 60} minutes...`);
        await delay(delayMs);
      }
    }
  }

  // Все попытки провалились
  console.error(
    `All ${retryDelays.length + 1} attempts to send verification email to ${email} failed`
  );
  throw new Error(
    `Failed to send verification email after ${retryDelays.length + 1} attempts: ${
      lastError?.message || "Unknown error"
    }`
  );
}

/**
 * Отправляет verification email без retry (для ручной переотправки)
 * @param params Email адрес и токен верификации
 * @returns true если отправка успешна
 */
export async function sendVerificationEmailNoRetry({
  email,
  token,
}: SendVerificationEmailParams): Promise<boolean> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  try {
    await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Подтвердите ваш email - Free Diet",
      react: VerificationEmail({
        email,
        verificationUrl,
      }),
    });

    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}
