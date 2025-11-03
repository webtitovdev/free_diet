// NextAuth.js конфигурация с Google OAuth и Credentials providers
// T032: Configure NextAuth.js
// T033: Implement Prisma adapter
// T041: Create login credentials verification

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/shared/lib/prisma";
import { verifyPassword } from "@/entities/user/lib/hash-password";
import { AuthMethod } from "@/entities/user/model/types";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Увеличиваем таймаут для Google OAuth
      httpOptions: {
        timeout: 10000, // 10 секунд вместо дефолтных 3.5
      },
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          emailVerified: new Date(profile.email_verified ? Date.now() : 0),
          authMethod: AuthMethod.GOOGLE,
        };
      },
    }),

    // Email/Password Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email и пароль обязательны");
        }

        // Найти пользователя по email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Неверный email или пароль");
        }

        // Проверить, что email верифицирован (FR-004)
        if (!user.emailVerified) {
          throw new Error("Пожалуйста, подтвердите ваш email перед входом");
        }

        // Проверить пароль
        if (!user.hashedPassword) {
          throw new Error("Этот аккаунт использует Google OAuth");
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.hashedPassword);

        if (!isPasswordValid) {
          throw new Error("Неверный email или пароль");
        }

        // Вернуть пользователя для создания сессии
        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          authMethod: user.authMethod,
        };
      },
    }),
  ],

  // Настройки сессии
  session: {
    strategy: "jwt", // JWT strategy для serverless compatibility
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  // JWT callbacks
  callbacks: {
    // Обработка входа - создание/обновление пользователя в БД
    async signIn({ user, account }) {
      // Для Google OAuth создаем/обновляем пользователя в БД
      if (account?.provider === "google" && user.email) {
        try {
          // Используем providerAccountId (Google sub) как постоянный ID
          const googleUserId = account.providerAccountId;

          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Создаем нового пользователя для Google OAuth
            await prisma.user.create({
              data: {
                id: googleUserId,
                email: user.email,
                emailVerified: new Date(), // Google OAuth уже верифицирован
                authMethod: AuthMethod.GOOGLE,
              },
            });
            console.log(`Created new Google user: ${user.email} with ID: ${googleUserId}`);
          } else if (!existingUser.emailVerified) {
            // Обновляем существующего пользователя (верификация email)
            await prisma.user.update({
              where: { email: user.email },
              data: {
                emailVerified: new Date(),
                authMethod: AuthMethod.GOOGLE,
              },
            });
          }
        } catch (error) {
          console.error("Error creating/updating user during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // При первом входе добавляем данные пользователя в токен
      if (user) {
        // Для Google OAuth получаем или создаем пользователя из БД
        if (account?.provider === "google" && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (dbUser) {
            token.userId = dbUser.id;
            token.email = dbUser.email;
            token.emailVerified = dbUser.emailVerified !== null;
            token.authMethod = dbUser.authMethod;
          }
        } else {
          // Для credentials provider
          const userWithAuth = user as {
            id: string;
            email: string;
            emailVerified: Date | null;
            authMethod: AuthMethod;
          };
          token.userId = userWithAuth.id;
          token.email = userWithAuth.email;
          token.emailVerified = userWithAuth.emailVerified !== null;
          token.authMethod = userWithAuth.authMethod;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Добавляем данные из токена в сессию
      if (session.user) {
        const user = session.user as {
          id?: string;
          emailVerified?: boolean;
          authMethod?: AuthMethod;
        };
        user.id = token.userId as string;
        user.emailVerified = token.emailVerified as boolean;
        user.authMethod = token.authMethod;
      }
      return session;
    },
  },

  // Кастомные страницы
  pages: {
    signIn: "/login", // Route group (auth) делает URL /login вместо /auth/login
    error: "/error", // Аналогично для error страницы
  },

  // Настройки безопасности
  secret: process.env.NEXTAUTH_SECRET,

  // Отладочные логи (удалить в production)
  debug: process.env.NODE_ENV === "development",
};
