"use client";

import { Button, Card, Row, Col, Typography, Space } from "antd";
import {
  CameraOutlined,
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const { Title, Paragraph, Text } = Typography;

/**
 * Landing Page - главная страница приложения
 *
 * Функции:
 * - Обзор основных возможностей приложения
 * - Призыв к действию (регистрация/вход)
 * - Навигация к основным функциям для аутентифицированных пользователей
 */
export function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const features = [
    {
      icon: <CameraOutlined style={{ fontSize: "48px", color: "#1890ff" }} />,
      title: "Анализ по Фото",
      description:
        "Загрузите фото вашего блюда, и система автоматически определит продукты, вес и калорийность",
    },
    {
      icon: <EditOutlined style={{ fontSize: "48px", color: "#52c41a" }} />,
      title: "Редактирование Порций",
      description:
        "Уточните вес продуктов, добавьте недостающие - система пересчитает калории в реальном времени",
    },
    {
      icon: <UserOutlined style={{ fontSize: "48px", color: "#722ed1" }} />,
      title: "Персональные Цели",
      description:
        "Укажите параметры (вес, рост, возраст, пол) и цель - получите рекомендуемую калорийность",
    },
    {
      icon: <CalendarOutlined style={{ fontSize: "48px", color: "#fa8c16" }} />,
      title: "Календарь Прогресса",
      description:
        "Отслеживайте прогресс в календаре - зеленые дни показывают достижение целевой калорийности",
    },
  ];

  const benefits = [
    "Автоматическое распознавание продуктов на фотографии",
    "Точный расчет калорий и БЖУ (белки, жиры, углеводы)",
    "Персонализированные рекомендации по калорийности",
    "Визуализация прогресса в календаре",
    "Поддержка Google OAuth и email регистрации",
    "Безопасное хранение данных",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <CameraOutlined style={{ fontSize: "72px" }} />
          <Title level={1} style={{ color: "white", margin: 0 }}>
            Трекер Калорий по Фотографии
          </Title>
          <Paragraph
            style={{
              fontSize: "20px",
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Отслеживайте калории легко - просто сфотографируйте вашу еду
          </Paragraph>
          <Space size="middle" style={{ marginTop: "24px" }}>
            {!session ? (
              <>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push("/register")}
                  style={{
                    background: "#52c41a",
                    borderColor: "#52c41a",
                    height: "48px",
                    fontSize: "16px",
                  }}
                >
                  Начать бесплатно
                </Button>
                <Button
                  size="large"
                  onClick={() => router.push("/login")}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    borderColor: "white",
                    color: "white",
                    height: "48px",
                    fontSize: "16px",
                  }}
                >
                  Войти
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={() => router.push("/photo")}
                style={{
                  background: "#52c41a",
                  borderColor: "#52c41a",
                  height: "48px",
                  fontSize: "16px",
                }}
              >
                Перейти к загрузке фото
              </Button>
            )}
          </Space>
        </Space>
      </div>

      {/* Features Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "48px" }}>
          Возможности приложения
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  height: "100%",
                  borderRadius: "8px",
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {feature.icon}
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph style={{ margin: 0 }}>{feature.description}</Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Benefits Section */}
      <div
        style={{
          background: "white",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: "48px" }}>
            Почему выбирают нас
          </Title>
          <Row gutter={[16, 16]}>
            {benefits.map((benefit, index) => (
              <Col xs={24} sm={12} key={index}>
                <Space>
                  <CheckCircleOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
                  <Text style={{ fontSize: "16px" }}>{benefit}</Text>
                </Space>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      {!session && (
        <div
          style={{
            background: "#f0f2f5",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Title level={2}>Готовы начать?</Title>
            <Paragraph style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
              Присоединяйтесь к тысячам пользователей, которые уже отслеживают свои калории с
              помощью нашего приложения
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/register")}
              style={{
                background: "#1890ff",
                borderColor: "#1890ff",
                height: "48px",
                fontSize: "16px",
                paddingLeft: "48px",
                paddingRight: "48px",
              }}
            >
              Создать аккаунт бесплатно
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}
