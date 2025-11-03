/**
 * Modal Component
 * Wrapper вокруг Ant Design Modal для консистентности UI
 */

import React from "react";
import { Modal as AntModal, ModalProps as AntModalProps } from "antd";

// Расширяем типы Ant Design Modal
export interface ModalProps extends AntModalProps {
  /**
   * Размер модального окна
   */
  size?: "small" | "medium" | "large";
}

/**
 * Кастомный Modal компонент
 */
export const Modal: React.FC<ModalProps> = ({ size = "medium", width, children, ...props }) => {
  // Определяем ширину на основе размера
  const getWidth = () => {
    if (width) return width;

    switch (size) {
      case "small":
        return 416;
      case "large":
        return 800;
      case "medium":
      default:
        return 520;
    }
  };

  return (
    <AntModal width={getWidth()} {...props}>
      {children}
    </AntModal>
  );
};

// Named exports для других типов Modal
export const { confirm, info, success, error, warning } = AntModal;

export default Modal;
