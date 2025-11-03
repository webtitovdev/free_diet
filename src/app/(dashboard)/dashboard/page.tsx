// Next.js App Router page для главной dashboard страницы
// После успешного логина пользователь попадает сюда

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Typography, Row, Col, Card, Statistic, Space } from "antd";
import {
  CameraOutlined,
  CalendarOutlined,
  UserOutlined,
  PictureOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

// Отключаем статическую генерацию для страницы с аутентификацией
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Проверка аутентификации (дополнительная защита к middleware)
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Приветствие */}
        <div>
          <Title level={2}>Добро пожаловать, {session.user.email}!</Title>
          <Paragraph type="secondary">Выберите действие для работы с приложением</Paragraph>
        </div>

        {/* Карточки действий */}
        <Row gutter={[16, 16]}>
          {/* Карточка: Загрузить фото еды */}
          <Col xs={24} md={12} lg={8}>
            <Link href="/photos/upload" style={{ textDecoration: "none" }}>
              <Card hoverable style={{ height: "100%" }}>
                <Space direction="vertical" size="middle">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#f0f5ff",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CameraOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      Загрузить фото еды
                    </Title>
                    <Paragraph type="secondary" style={{ margin: "8px 0 0 0" }}>
                      Сфотографируйте вашу еду для анализа калорий
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Link>
          </Col>

          {/* Карточка: Календарь прогресса */}
          <Col xs={24} md={12} lg={8}>
            <Link href="/calendar" style={{ textDecoration: "none" }}>
              <Card hoverable style={{ height: "100%" }}>
                <Space direction="vertical" size="middle">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#f6ffed",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CalendarOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      Календарь прогресса
                    </Title>
                    <Paragraph type="secondary" style={{ margin: "8px 0 0 0" }}>
                      Просматривайте историю питания и отслеживайте прогресс
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Link>
          </Col>

          {/* Карточка: Профиль */}
          <Col xs={24} md={12} lg={8}>
            <Link href="/profile" style={{ textDecoration: "none" }}>
              <Card hoverable style={{ height: "100%" }}>
                <Space direction="vertical" size="middle">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#f9f0ff",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      Профиль
                    </Title>
                    <Paragraph type="secondary" style={{ margin: "8px 0 0 0" }}>
                      Настройте свои цели и параметры
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* Быстрая статистика */}
        <Card title="Быстрая статистика">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Загруженных фото"
                  value={0}
                  prefix={<PictureOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Дней отслеживания"
                  value={0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Ккал сегодня"
                  value={0}
                  prefix={<FireOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
}
