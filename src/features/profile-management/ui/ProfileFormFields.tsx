// Поля формы профиля (вес, возраст, пол, рост)
// T105: Create ProfileFormFields component (weight, age, gender, height inputs)
// Spec: §FR-015

"use client";

import { Form, InputNumber, Radio } from "antd";
import { Gender } from "@/entities/profile/model/types";
import { PROFILE_VALIDATION_RULES } from "@/entities/profile/lib/validate-profile";

interface ProfileFormFieldsProps {
  disabled?: boolean;
}

export function ProfileFormFields({ disabled = false }: ProfileFormFieldsProps) {
  return (
    <>
      {/* Вес */}
      <Form.Item
        label="Вес (кг)"
        name="weight"
        rules={[
          { required: true, message: "Введите ваш вес" },
          {
            type: "number",
            min: PROFILE_VALIDATION_RULES.weight.min,
            max: PROFILE_VALIDATION_RULES.weight.max,
            message: `Вес должен быть от ${PROFILE_VALIDATION_RULES.weight.min} до ${PROFILE_VALIDATION_RULES.weight.max} кг`,
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Например, 75"
          min={PROFILE_VALIDATION_RULES.weight.min}
          max={PROFILE_VALIDATION_RULES.weight.max}
          step={0.1}
          disabled={disabled}
        />
      </Form.Item>

      {/* Рост */}
      <Form.Item
        label="Рост (см)"
        name="height"
        rules={[
          { required: true, message: "Введите ваш рост" },
          {
            type: "number",
            min: PROFILE_VALIDATION_RULES.height.min,
            max: PROFILE_VALIDATION_RULES.height.max,
            message: `Рост должен быть от ${PROFILE_VALIDATION_RULES.height.min} до ${PROFILE_VALIDATION_RULES.height.max} см`,
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Например, 180"
          min={PROFILE_VALIDATION_RULES.height.min}
          max={PROFILE_VALIDATION_RULES.height.max}
          disabled={disabled}
        />
      </Form.Item>

      {/* Возраст */}
      <Form.Item
        label="Возраст (лет)"
        name="age"
        rules={[
          { required: true, message: "Введите ваш возраст" },
          {
            type: "number",
            min: PROFILE_VALIDATION_RULES.age.min,
            max: PROFILE_VALIDATION_RULES.age.max,
            message: `Возраст должен быть от ${PROFILE_VALIDATION_RULES.age.min} до ${PROFILE_VALIDATION_RULES.age.max} лет`,
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Например, 30"
          min={PROFILE_VALIDATION_RULES.age.min}
          max={PROFILE_VALIDATION_RULES.age.max}
          disabled={disabled}
        />
      </Form.Item>

      {/* Пол */}
      <Form.Item
        label="Пол"
        name="gender"
        rules={[{ required: true, message: "Выберите ваш пол" }]}
      >
        <Radio.Group disabled={disabled}>
          <Radio value={Gender.MALE}>Мужской</Radio>
          <Radio value={Gender.FEMALE}>Женский</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
}
