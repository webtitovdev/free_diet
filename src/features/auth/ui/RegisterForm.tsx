// RegisterForm component с валидацией пароля (FR-002b)
// T046: RegisterForm с client-side validation

"use client";

import { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { register } from "../api/auth-api";
import { useAuthStore } from "../model/auth-store";

export function RegisterForm() {
  const { setLoading, setError, error } = useAuthStore();
  const [form] = Form.useForm();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Валидация пароля (FR-002b)
  const validatePassword = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject("Введите пароль");
    }

    if (value.length < 8) {
      return Promise.reject("Пароль должен содержать минимум 8 символов");
    }

    if (!/\d/.test(value)) {
      return Promise.reject("Пароль должен содержать хотя бы одну цифру");
    }

    if (!/[a-zA-Z]/.test(value)) {
      return Promise.reject("Пароль должен содержать хотя бы одну букву");
    }

    return Promise.resolve();
  };

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Регистрация через API
      const result = await register({
        email: values.email,
        password: values.password,
      });

      setSuccessMessage(result.message);
      form.resetFields();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error?.response?.data?.error || "Произошла ошибка при регистрации";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Регистрация</h1>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {successMessage && (
        <Alert message={successMessage} type="success" showIcon style={{ marginBottom: 16 }} />
      )}

      <Form form={form} name="register" onFinish={onFinish} layout="vertical" size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Неверный формат email" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" type="email" autoComplete="email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ validator: validatePassword }]}
          help="Минимум 8 символов, хотя бы одна цифра и одна буква"
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Пароль"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Пароли не совпадают");
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Подтвердите пароль"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
