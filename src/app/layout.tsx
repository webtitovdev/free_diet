import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { theme } from "@/shared/config/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Diet - Трекер Калорий по Фотографии",
  description: "Отслеживайте калории, загружая фотографии еды",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <ConfigProvider locale={ruRU} theme={theme}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
