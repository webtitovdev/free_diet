import { Spin } from "antd";

/**
 * Глобальный компонент загрузки
 *
 * Показывается автоматически при переходах между роутами
 * или при Suspense boundaries
 */
export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Spin size="large" tip="Загрузка..." />
    </div>
  );
}
