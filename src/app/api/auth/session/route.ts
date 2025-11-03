// API route для получения текущей сессии пользователя
// T042: Session check API route

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Получение сессии из NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: session.user,
        expiresAt: session.expires,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ error: "Ошибка при проверке сессии" }, { status: 500 });
  }
}
