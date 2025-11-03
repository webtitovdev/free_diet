// OpenRouter API client для анализа фотографий еды
// T061 + T062: OpenRouter API client с vision model (Qwen2.5 VL 32B Instruct - free)

import axios from "axios";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";
import { readFile } from "fs/promises";
import { join } from "path";

const openRouterClient = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
    "X-Title": "Free Diet",
  },
});

/**
 * Загружает изображение и конвертирует в base64 data URL
 * @param imageUrl URL изображения (локальный путь или внешний URL)
 * @returns base64 data URL для передачи в API
 */
async function imageUrlToBase64DataUrl(imageUrl: string): Promise<string> {
  let buffer: Buffer;

  // Проверяем, это локальный файл или внешний URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    // Загружаем из интернета (Vercel Blob в production)
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Не удалось загрузить изображение: ${response.statusText}`);
    }
    buffer = Buffer.from(await response.arrayBuffer());
  } else {
    // Читаем локальный файл (development)
    const filePath = join(process.cwd(), "public", imageUrl);
    buffer = await readFile(filePath);
  }

  // Конвертируем в base64 data URL
  const base64 = buffer.toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Анализирует фотографию еды с помощью OpenRouter API (Qwen2.5 VL 32B Instruct)
 * @param imageUrl URL фотографии в Vercel Blob или локальный путь
 * @returns Массив распознанных продуктов
 */
export async function analyzeFoodPhoto(imageUrl: string): Promise<RecognizedFoodItem[]> {
  try {
    // Конвертируем изображение в base64 data URL
    const base64DataUrl = await imageUrlToBase64DataUrl(imageUrl);

    const response = await openRouterClient.post("/chat/completions", {
      model: "openai/gpt-5", // Бесплатная vision модель
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: base64DataUrl },
            },
            {
              type: "text",
              text: `Проанализируй это изображение еды и определи все продукты питания.
Для каждого продукта оцени:
- Название (на русском языке)
- Вес в граммах (оценка из визуального размера порции - точность ±20-30%, пользователь сможет скорректировать позже)
- Питательная ценность на 100г (calories, protein, fats, carbs)
- Уверенность распознавания (0-1)

ВАЖНО: Верни ТОЛЬКО валидный JSON без дополнительного текста в формате:
{
  "foodItems": [
    {
      "name": "Название продукта",
      "weight_grams": 200,
      "calories_per_100g": 165,
      "protein_per_100g": 31,
      "fats_per_100g": 3.6,
      "carbs_per_100g": 0,
      "confidence": 0.9
    }
  ]
}

Если на изображении нет еды или качество слишком низкое, верни: {"foodItems": []}`,
            },
          ],
        },
      ],
    });

    let content = response.data.choices[0].message.content;

    // Убираем markdown форматирование если есть (```json ... ```)
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    // Проверяем, что ответ является валидным JSON
    let parsed;
    try {
      parsed = JSON.parse(content.trim());
    } catch (parseError) {
      console.error("OpenRouter API вернул невалидный JSON:", content);
      throw new Error(
        "API вернул невалидный ответ. Возможно, модель не смогла распознать продукты на изображении."
      );
    }

    return parsed.foodItems || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("OpenRouter API error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Обработка специфических ошибок API
      if (error.response?.status === 400) {
        throw new Error("Неверный формат запроса к API");
      } else if (error.response?.status === 401) {
        throw new Error("Ошибка авторизации API");
      } else if (error.response?.status === 429) {
        throw new Error("Превышен лимит запросов к API");
      }
    }

    console.error("OpenRouter API error:", error);
    throw new Error("Ошибка при анализе фотографии");
  }
}
