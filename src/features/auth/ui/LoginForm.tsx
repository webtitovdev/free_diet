// LoginForm component с Ant Design
// T045: LoginForm с валидацией

"use client";

import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../model/auth-store";

export function LoginForm() {
  const router = useRouter();
  const { setLoading, setError, error } = useAuthStore();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      // NextAuth signIn с credentials provider
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Успешный логин - перенаправление на dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Произошла ошибка при входе. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Вход в систему</h1>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Form form={form} name="login" onFinish={onFinish} layout="vertical" size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Неверный формат email" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" type="email" autoComplete="email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "Введите пароль" }]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Пароль"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
