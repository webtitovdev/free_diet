/**
 * Form Component
 * Wrapper вокруг Ant Design Form для консистентности UI
 */

import React from "react";
import { Form as AntForm, FormProps as AntFormProps, FormItemProps } from "antd";

// Расширяем типы Ant Design Form
export interface CustomFormProps extends AntFormProps {
  /**
   * Layout формы
   */
  layout?: "horizontal" | "vertical" | "inline";
}

/**
 * Кастомный Form компонент
 */
export const Form: React.FC<CustomFormProps> = ({ layout = "vertical", children, ...props }) => {
  return (
    <AntForm layout={layout} {...props}>
      {children}
    </AntForm>
  );
};

/**
 * Form.Item компонент с расширенными типами
 */
export interface CustomFormItemProps extends FormItemProps {
  /**
   * Обязательное поле (добавляет красную звездочку)
   */
  isRequired?: boolean;
}

export const FormItem: React.FC<CustomFormItemProps> = ({
  isRequired = false,
  required,
  children,
  ...props
}) => {
  return (
    <AntForm.Item required={required || isRequired} {...props}>
      {children}
    </AntForm.Item>
  );
};

// Привязываем FormItem к Form
Form.Item = FormItem;

// Named exports для других компонентов формы
export const { List, ErrorList, Provider, useForm, useFormInstance, useWatch } = AntForm;

export default Form;
