/**
 * Button Component
 * Wrapper вокруг Ant Design Button для консистентности UI
 */

import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";

// Расширяем типы Ant Design Button
export interface ButtonProps extends AntButtonProps {
  /**
   * Полная ширина
   */
  fullWidth?: boolean;
}

/**
 * Кастомный Button компонент
 */
export const Button: React.FC<ButtonProps> = ({ fullWidth = false, children, style, ...props }) => {
  return (
    <AntButton
      style={{
        ...style,
        width: fullWidth ? "100%" : style?.width,
      }}
      {...props}
    >
      {children}
    </AntButton>
  );
};

// Named export для переиспользования
export { AntButton };

export default Button;
