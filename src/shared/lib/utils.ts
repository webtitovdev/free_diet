import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility функция для объединения Tailwind CSS классов
 * Использует clsx для условной логики и tailwind-merge для разрешения конфликтов
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-red-500')
 * cn('px-2', 'px-4') // => 'px-4' (последний класс побеждает)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
