/**
 * Card Component
 * Wrapper вокруг Ant Design Card для консистентности UI
 */

import React from "react";
import { Card as AntCard, CardProps as AntCardProps } from "antd";

// Расширяем типы Ant Design Card
export interface CardProps extends AntCardProps {
  /**
   * Вариант отображения карточки
   */
  variant?: "default" | "bordered" | "hoverable";
  /**
   * Полная ширина
   */
  fullWidth?: boolean;
}

/**
 * Кастомный Card компонент
 */
export const Card: React.FC<CardProps> = ({
  variant = "default",
  fullWidth = false,
  bordered = true,
  hoverable = false,
  style,
  children,
  ...props
}) => {
  // Применяем variant настройки
  const applyVariant = () => {
    switch (variant) {
      case "bordered":
        return { bordered: true, hoverable: false };
      case "hoverable":
        return { bordered: true, hoverable: true };
      default:
        return { bordered, hoverable };
    }
  };

  const variantProps = applyVariant();

  return (
    <AntCard
      {...variantProps}
      style={{
        ...style,
        width: fullWidth ? "100%" : style?.width,
      }}
      {...props}
    >
      {children}
    </AntCard>
  );
};

// Named export для Grid
export const { Grid, Meta } = AntCard;

export default Card;
