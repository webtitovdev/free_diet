/**
 * Input Component
 * Wrapper вокруг Ant Design Input для консистентности UI
 */

import React from "react";
import { Input as AntInput, InputProps as AntInputProps } from "antd";

// Расширяем типы Ant Design Input
export interface InputProps extends AntInputProps {
  /**
   * Лейбл для поля ввода
   */
  label?: string;
  /**
   * Текст ошибки валидации
   */
  error?: string;
  /**
   * Полная ширина
   */
  fullWidth?: boolean;
}

/**
 * Кастомный Input компонент
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  style,
  ...props
}) => {
  return (
    <div style={{ width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <AntInput
        status={error ? "error" : undefined}
        style={{
          ...style,
          width: fullWidth ? "100%" : style?.width,
        }}
        {...props}
      />
      {error && (
        <div
          style={{
            color: "#ff4d4f",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

// Named exports для других типов Input
export const { TextArea, Search, Password, Group } = AntInput;

export default Input;
