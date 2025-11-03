/**
 * Card Component
 * Wrapper вокруг Ant Design Card для консистентности UI
 */

import React from "react";
import { Card as AntCard, CardProps as AntCardProps } from "antd";

// Расширяем типы Ant Design Card
export interface CardProps extends AntCardProps {
  /**
   * Полная ширина
   */
  fullWidth?: boolean;
}

/**
 * Кастомный Card компонент
 */
export const Card: React.FC<CardProps> = ({ fullWidth = false, style, children, ...props }) => {
  return (
    <AntCard
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
