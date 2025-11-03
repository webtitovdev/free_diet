// OpenRouter API client для анализа фотографий еды
// T061 + T062: OpenRouter API client с vision model (Claude Haiku)

import axios from "axios";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";

const openRouterClient = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
    "X-Title": "Free Diet",
  },
});

/**
 * Анализирует фотографию еды с помощью OpenRouter API (Claude Haiku)
 * @param imageUrl URL фотографии в Vercel Blob
 * @returns Массив распознанных продуктов
 */
export async function analyzeFoodPhoto(imageUrl: string): Promise<RecognizedFoodItem[]> {
  try {
    const response = await openRouterClient.post("/chat/completions", {
      model: "anthropic/claude-3-haiku", // Быстрая и cost-effective модель
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
            {
              type: "text",
              text: `Проанализируй это изображение еды и определи все продукты питания.
Для каждого продукта оцени:
- Название (на русском языке)
- Вес в граммах (оценка из визуального размера порции - точность ±20-30%, пользователь сможет скорректировать позже)
- Питательная ценность на 100г (calories, protein, fats, carbs)
- Уверенность распознавания (0-1)

Верни JSON массив продуктов в формате:
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

Если на изображении нет еды или качество слишком низкое, верни пустой массив.`,
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return parsed.foodItems || [];
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw new Error("Ошибка при анализе фотографии");
  }
}
