// Auth proxy для защиты authenticated routes
// Next.js 16+ Proxy (ранее называлось Middleware)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Маршруты, требующие аутентификации
const protectedRoutes = ["/dashboard", "/profile", "/calendar", "/photos"];

// Маршруты, доступные только не аутентифицированным пользователям
// Route group (auth) делает URL без префикса /auth
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Получение JWT токена из сессии
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Проверка protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !isAuthenticated) {
    // Редирект на login если не аутентифицирован (без префикса /auth)
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Проверка auth routes (login, register)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    // Редирект на dashboard если уже аутентифицирован
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Конфигурация proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
