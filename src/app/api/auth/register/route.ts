// API route для регистрации пользователя с email/password
// T034: User registration с email/password validation (FR-002, FR-002b, FR-003)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/entities/user/lib/hash-password";
import { generateVerificationToken } from "@/entities/user/lib/generate-token";
import { sendVerificationEmail } from "@/shared/lib/email/send-verification";
import { AuthMethod } from "@/entities/user/model/types";

/**
 * Валидация пароля (FR-002b):
 * - Минимум 8 символов
 * - Хотя бы одна цифра
 * - Хотя бы одна буква
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: "Пароль должен содержать минимум 8 символов" };
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: "Пароль должен содержать хотя бы одну цифру" };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, error: "Пароль должен содержать хотя бы одну букву" };
  }

  return { valid: true };
}

/**
 * Валидация email
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Валидация входных данных
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    // Валидация email формата
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Неверный формат email" }, { status: 400 });
    }

    // Валидация пароля (FR-002b)
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 });
    }

    // Проверка, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    // Генерация токена верификации (FR-003a: 24h TTL)
    const { token, expiresAt } = generateVerificationToken();

    // Хеширование пароля
    const hashedPassword = await hashPassword(password);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        authMethod: AuthMethod.EMAIL_PASSWORD,
        verificationToken: token,
        tokenExpiresAt: expiresAt,
        emailVerified: null, // Не верифицирован до подтверждения
      },
    });

    // Отправка verification email (FR-003)
    try {
      await sendVerificationEmail({
        email: user.email,
        token,
      });
    } catch (emailError) {
      // Email не отправился, но пользователь создан
      // Пользователь может повторно запросить verification email
      console.error("Failed to send verification email:", emailError);
    }

    return NextResponse.json(
      {
        message: "Регистрация успешна! Пожалуйста, проверьте email для подтверждения аккаунта.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка при регистрации. Пожалуйста, попробуйте снова." },
      { status: 500 }
    );
  }
}
