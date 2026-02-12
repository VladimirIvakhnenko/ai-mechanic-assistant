import { NextRequest } from "next/server";
import { config } from "dotenv";
import { resolve } from "path";
import OpenAI from "openai";

export const runtime = "nodejs";

// Программная загрузка переменных окружения из .env файла
config({ path: resolve(process.cwd(), ".env") });

const getYandexClient = () => {
  // Переменные окружения загружаются программно через dotenv
  const apiKey = process.env.YANDEX_CLOUD_API_KEY;
  const project = process.env.YANDEX_CLOUD_PROJECT || "b1g6c12ig0irbtk6og6n";

  if (!apiKey) {
    const errorMsg = 
      "YANDEX_CLOUD_API_KEY не установлен в переменных окружения. " +
      "Убедитесь, что файл .env существует в корне проекта и содержит YANDEX_CLOUD_API_KEY. " +
      "После изменения .env файла перезапустите сервер разработки.";
    console.error("[Yandex Config Error]:", errorMsg);
    throw new Error(errorMsg);
  }

  // Создаем клиент OpenAI с кастомным base_url для Yandex Cloud
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://rest-assistant.api.cloud.yandex.net/v1",
    defaultQuery: { project: project },
  });
};

export async function POST(req: NextRequest) {
  try {
    // Проверяем конфигурацию и создаем клиент перед обработкой запроса
    let client: OpenAI;
    try {
      client = getYandexClient();
    } catch (configError: any) {
      return new Response(
        JSON.stringify({
          error: configError.message || "Ошибка конфигурации Yandex Cloud API",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { promptId, input } = await req.json();

    if (!promptId) {
      return new Response(
        JSON.stringify({
          error: "promptId обязателен",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!input) {
      return new Response(
        JSON.stringify({
          error: "input обязателен",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Используем OpenAI SDK для создания ответа через Yandex Cloud API
    const response = await client.responses.create({
      prompt: {
        id: promptId,
      },
      input: input,
    });

    return new Response(
      JSON.stringify({
        output_text: response.output_text,
        metadata: {
          prompt_id: promptId,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[Yandex] API error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Произошла ошибка при обращении к Yandex Cloud API",
      }),
      {
        status: error.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
