import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import ruRU from "antd/locale/ru_RU";
import { theme } from "@/shared/config/theme";
import { SessionProvider } from "@/shared/providers/SessionProvider";
import { ToastProvider } from "@/shared/providers";
import { Header } from "@/widgets/header/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Diet - Трекер Калорий по Фотографии",
  description: "Отслеживайте калории, загружая фотографии еды",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <SessionProvider>
          <AntdRegistry>
            <ConfigProvider locale={ruRU} theme={theme}>
              <App>
                <ToastProvider>
                  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                    <Header />
                    <main style={{ flex: 1 }}>{children}</main>
                  </div>
                </ToastProvider>
              </App>
            </ConfigProvider>
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
