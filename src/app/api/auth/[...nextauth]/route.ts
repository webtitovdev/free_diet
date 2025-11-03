// NextAuth.js конфигурация с Google OAuth и Credentials providers
// T032: Configure NextAuth.js
// T033: Implement Prisma adapter
// T041: Create login credentials verification

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/shared/lib/prisma";
import { verifyPassword } from "@/entities/user/lib/hash-password";
import { AuthMethod } from "@/entities/user/model/types";

export const authOptions: NextAuthOptions = {
  // Prisma adapter для хранения сессий в БД
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async jwt({ token, user, account }) {
      // При первом входе добавляем данные пользователя в токен
      if (user) {
        const userWithAuth = user as {
          id: string;
          email: string;
          emailVerified: Date | null;
          authMethod: string;
        };
        token.userId = userWithAuth.id;
        token.email = userWithAuth.email;
        token.emailVerified = userWithAuth.emailVerified !== null;
        token.authMethod = userWithAuth.authMethod;
      }

      // При Google OAuth сохраняем provider
      if (account?.provider === "google") {
        token.authMethod = AuthMethod.GOOGLE;
      }

      return token;
    },

    async session({ session, token }) {
      // Добавляем данные из токена в сессию
      if (session.user) {
        const user = session.user as {
          id?: string;
          emailVerified?: boolean;
          authMethod?: string;
        };
        user.id = token.userId as string;
        user.emailVerified = token.emailVerified as boolean;
        user.authMethod = token.authMethod as string;
      }
      return session;
    },
  },

  // Кастомные страницы
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  // Настройки безопасности
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
