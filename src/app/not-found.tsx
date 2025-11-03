import { Button, Result } from "antd";
import Link from "next/link";

/**
 * Страница 404 - не найдено
 *
 * Показывается автоматически когда пользователь переходит
 * на несуществующий роут
 */
export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="К сожалению, запрашиваемая страница не найдена."
        extra={
          <Link href="/">
            <Button type="primary">На главную</Button>
          </Link>
        }
      />
    </div>
  );
}
