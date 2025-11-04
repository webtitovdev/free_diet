// Поля формы профиля (вес, возраст, пол, рост)
// T105: Create ProfileFormFields component (weight, age, gender, height inputs)
// Spec: §FR-015

"use client";

import { Input } from "@/shared/ui/input/Input";
import { Label } from "@/shared/ui/label/Label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group/RadioGroup";
import { Gender } from "@/entities/profile/model/types";
import { PROFILE_VALIDATION_RULES } from "@/entities/profile/lib/validate-profile";

interface ProfileFormFieldsProps {
  weight?: number;
  height?: number;
  age?: number;
  gender?: Gender;
  onWeightChange?: (value: number) => void;
  onHeightChange?: (value: number) => void;
  onAgeChange?: (value: number) => void;
  onGenderChange?: (value: Gender) => void;
  disabled?: boolean;
  errors?: {
    weight?: string;
    height?: string;
    age?: string;
    gender?: string;
  };
}

export function ProfileFormFields({
  weight,
  height,
  age,
  gender,
  onWeightChange,
  onHeightChange,
  onAgeChange,
  onGenderChange,
  disabled = false,
  errors = {},
}: ProfileFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Вес */}
      <div className="space-y-2">
        <Label htmlFor="weight">Вес (кг)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="Например, 75"
          value={weight?.toString() || ""}
          onChange={(e) => onWeightChange?.(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          error={errors.weight}
          min={PROFILE_VALIDATION_RULES.weight.min}
          max={PROFILE_VALIDATION_RULES.weight.max}
          step={0.1}
        />
      </div>

      {/* Рост */}
      <div className="space-y-2">
        <Label htmlFor="height">Рост (см)</Label>
        <Input
          id="height"
          type="number"
          placeholder="Например, 180"
          value={height?.toString() || ""}
          onChange={(e) => onHeightChange?.(parseInt(e.target.value) || 0)}
          disabled={disabled}
          error={errors.height}
          min={PROFILE_VALIDATION_RULES.height.min}
          max={PROFILE_VALIDATION_RULES.height.max}
        />
      </div>

      {/* Возраст */}
      <div className="space-y-2">
        <Label htmlFor="age">Возраст (лет)</Label>
        <Input
          id="age"
          type="number"
          placeholder="Например, 30"
          value={age?.toString() || ""}
          onChange={(e) => onAgeChange?.(parseInt(e.target.value) || 0)}
          disabled={disabled}
          error={errors.age}
          min={PROFILE_VALIDATION_RULES.age.min}
          max={PROFILE_VALIDATION_RULES.age.max}
        />
      </div>

      {/* Пол */}
      <div className="space-y-2">
        <Label>Пол</Label>
        <RadioGroup
          value={gender}
          onValueChange={onGenderChange}
          disabled={disabled}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={Gender.MALE} id="male" />
            <Label htmlFor="male" className="font-normal cursor-pointer">
              Мужской
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={Gender.FEMALE} id="female" />
            <Label htmlFor="female" className="font-normal cursor-pointer">
              Женский
            </Label>
          </div>
        </RadioGroup>
        {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
      </div>
    </div>
  );
}
