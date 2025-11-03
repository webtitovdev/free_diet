"use client";

import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
  CameraOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";

const { Header: AntHeader } = Layout;

/**
 * Виджет Header с навигацией и меню пользователя
 *
 * Функции:
 * - Навигация между основными страницами (Фото, Календарь, Профиль)
 * - Меню пользователя с выходом
 * - Адаптивный дизайн
 */
export function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  // Элементы меню пользователя
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Профиль",
      onClick: () => router.push("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Выйти",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  // Основные пункты навигации
  const navigationItems: MenuProps["items"] = [
    {
      key: "photo",
      icon: <CameraOutlined />,
      label: "Загрузить фото",
      onClick: () => router.push("/photo"),
    },
    {
      key: "calendar",
      icon: <CalendarOutlined />,
      label: "Календарь",
      onClick: () => router.push("/calendar"),
    },
  ];

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Лого и название */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
        onClick={() => router.push("/")}
      >
        <CameraOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Трекер Калорий</h1>
      </div>

      {/* Навигация и меню пользователя */}
      <Space size="large">
        {session && (
          <>
            <Menu
              mode="horizontal"
              items={navigationItems}
              style={{ border: "none", background: "transparent" }}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
                <span>{session.user?.name || session.user?.email}</span>
              </Space>
            </Dropdown>
          </>
        )}
        {!session && (
          <Space>
            <a onClick={() => router.push("/login")} style={{ cursor: "pointer" }}>
              Войти
            </a>
            <a
              onClick={() => router.push("/register")}
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              <UserAddOutlined /> Регистрация
            </a>
          </Space>
        )}
      </Space>
    </AntHeader>
  );
}
