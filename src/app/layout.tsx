import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp } from "antd";
import { SessionProvider } from "@/shared/providers/SessionProvider";
import { ToastProvider } from "@/shared/providers";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AntdThemeProvider } from "@/shared/ui/legacy-antd/AntdThemeProvider";
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
            <AntdRegistry>
              <AntdThemeProvider>
                <AntdApp>
                  <ToastProvider>
                    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                      <Header />
                      <main style={{ flex: 1 }}>{children}</main>
                    </div>
                  </ToastProvider>
                </AntdApp>
              </AntdThemeProvider>
            </AntdRegistry>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
