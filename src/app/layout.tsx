import type { Metadata } from "next";
import { SessionProvider } from "@/shared/providers/SessionProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { Header } from "@/widgets/header/Header";
import { inter } from "./styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Diet - Трекер Калорий по Фотографии",
  description: "Отслеживайте калории, загружая фотографии еды",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <SessionProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
