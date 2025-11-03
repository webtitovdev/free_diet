/**
 * Animation Specifications - Design Token System
 *
 * Конфигурация анимаций, transitions и easing функций.
 * FR-006: 200-300ms длительность
 * FR-007: визуальная обратная связь < 100ms
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface AnimationConfig {
  /** Длительности анимаций (в миллисекундах) */
  duration: {
    /** 150ms - быстрые micro-interactions (hover) */
    fast: number;
    /** 200ms - стандартные transitions (FR-006) */
    normal: number;
    /** 300ms - медленные анимации (modals, slide-ins) */
    slow: number;
  };

  /** Easing функции */
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    /** Рекомендуемая по умолчанию */
    easeInOut: string;
    linear: string;
  };

  /** Готовые transition определения */
  transitions: {
    default: string;
    color: string;
    transform: string;
    opacity: string;
    shadow: string;
  };

  /** Готовые animation presets */
  presets: {
    /** Button press - FR-007: <100ms feedback */
    buttonPress: AnimationPreset;
    /** Modal slide-up */
    modalSlideUp: AnimationPreset;
    /** Fade in */
    fadeIn: AnimationPreset;
    /** Skeleton pulse */
    skeletonPulse: AnimationPreset;
  };

  /** Accessibility */
  respectReducedMotion: boolean;
}

export interface AnimationPreset {
  /** Длительность в миллисекундах */
  duration: number;
  /** CSS property для анимации */
  property: string;
  /** Начальное состояние */
  from: string;
  /** Конечное состояние */
  to: string;
  /** Keyframes для сложных анимаций (опционально) */
  keyframes?: string;
  /** Количество повторений (опционально) */
  iteration?: string;
}

/**
 * Animation Configuration
 *
 * Performance Guidelines:
 * ✅ Используйте transform и opacity (GPU-accelerated)
 * ❌ Избегайте width, height, top, left (CPU-heavy, вызывают layout)
 */
export const animationConfig: AnimationConfig = {
  // Duration (FR-006: 200-300ms)
  duration: {
    fast: 150, // Micro-interactions
    normal: 200, // Стандарт
    slow: 300, // Modal, slide-in
  },

  // Easing functions
  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out", // Рекомендуемая
    linear: "linear",
  },

  // Transition definitions
  transitions: {
    default: "all 200ms ease-in-out",
    color: "color 200ms ease-in-out",
    transform: "transform 200ms ease-in-out",
    opacity: "opacity 200ms ease-in-out",
    shadow: "box-shadow 200ms ease-in-out",
  },

  // Animation presets
  presets: {
    // Button press (FR-007: <100ms feedback)
    buttonPress: {
      duration: 100,
      property: "transform",
      from: "scale(1)",
      to: "scale(0.98)",
    },

    // Modal slide-up
    modalSlideUp: {
      duration: 300,
      property: "transform, opacity",
      from: "translateY(100%) opacity(0)",
      to: "translateY(0) opacity(1)",
    },

    // Fade in
    fadeIn: {
      duration: 200,
      property: "opacity",
      from: "opacity(0)",
      to: "opacity(1)",
    },

    // Skeleton pulse
    skeletonPulse: {
      duration: 1500,
      property: "opacity",
      from: "opacity(1)",
      to: "opacity(0.5)",
      keyframes: "0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; }",
      iteration: "infinite",
    },
  },

  // Accessibility
  respectReducedMotion: true, // Проверять prefers-reduced-motion
} as const;

/**
 * Утилита для получения transition с учетом reduced motion
 */
export const getTransition = (
  property: keyof AnimationConfig["transitions"],
  respectReducedMotion = true
): string => {
  if (respectReducedMotion && typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return "none";
    }
  }
  return animationConfig.transitions[property];
};

/**
 * Утилита для получения animation preset
 */
export const getAnimationPreset = (preset: keyof AnimationConfig["presets"]): AnimationPreset => {
  return animationConfig.presets[preset];
};
