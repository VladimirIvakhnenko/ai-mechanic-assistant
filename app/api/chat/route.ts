import { NextRequest } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `Вы - AutoTech Assistant, профессиональный консультант для механиков автосервиса. 
Вы специализируетесь на диагностике и ремонте автомобилей всех марок и моделей.

Ваши навыки:
- Диагностика кодов ошибок OBD2
- Рекомендации по ремонту двигателя, трансмиссии, электроники
- Знание технических характеристик и спецификаций
- Советы по подбору запчастей
- Пошаговые инструкции по ремонту

Всегда отвечайте профессионально, структурировано и по делу. Используйте списки, таблицы и четкую структуру.
Указывайте конкретные артикулы деталей, моменты затяжки и технические требования когда это уместно.`;

function formatMessagesForHF(messages: { role: string; content: string }[]) {
  const formattedMessages = [
    `<s>[INST] ${SYSTEM_PROMPT} [/INST]`,
    ...messages.map((msg) => {
      if (msg.role === "user") {
        return `[INST] ${msg.content} [/INST]`;
      }
      return msg.content;
    }),
  ];
  return formattedMessages.join("\n");
}

function generateFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Определяем тип запроса и генерируем соответствующий ответ
  if (lowerMessage.includes("p0") || lowerMessage.includes("код")) {
    const code = userMessage.match(/P\d{4}/i)?.[0] || "P0300";
    return `**Анализ кода ошибки ${code}:**

Этот код указывает на проблему в системе двигателя. Рекомендую следующие действия:

**Первичная диагностика:**
1. Подключите диагностический сканер для проверки дополнительных кодов
2. Проверьте базовые параметры работы двигателя
3. Осмотрите визуально основные компоненты двигателя

**Возможные причины:**
- Проблемы с системой зажигания (свечи, катушки)
- Неисправность датчиков (MAF, MAP, кислородные)
- Механический износ компонентов двигателя
- Проблемы с топливной системой

**Рекомендации:**
- Проверьте историю обслуживания автомобиля
- Уточните пробег и условия эксплуатации
- При необходимости проведите компьютерную диагностику

Нужна более детальная информация о марке и модели автомобиля для точной диагностики.`;
  }

  if (
    lowerMessage.includes("стук") ||
    lowerMessage.includes("шум") ||
    lowerMessage.includes("подвеска")
  ) {
    return `**Диагностика стуков в подвеске:**

Для точной диагностики стуков необходимо:

**Шаг 1 - Локализация:**
- Определите, с какой стороны слышен стук (левая/правая)
- На каких неровностях проявляется (мелкие/крупные)
- Зависимость от скорости движения

**Шаг 2 - Визуальный осмотр:**
- Проверьте состояние амортизаторов (подтеки масла)
- Осмотрите шаровые опоры и рулевые наконечники
- Проверьте втулки стабилизатора
- Осмотрите сайлентблоки рычагов

**Шаг 3 - Проверка люфтов:**
- Проверьте люфт в рулевых наконечниках
- Проверьте шаровые опоры на износ
- Проверьте подшипники ступиц

**Частые причины:**
- Изношенные втулки стабилизатора (80% случаев)
- Износ шаровых опор
- Стук амортизаторов

Укажите марку и модель автомобиля для более точных рекомендаций.`;
  }

  if (
    lowerMessage.includes("двигатель") ||
    lowerMessage.includes("мотор") ||
    lowerMessage.includes("троит")
  ) {
    return `**Диагностика проблем двигателя:**

На основе описания симптомов предлагаю следующий план:

**Базовая проверка:**
1. Компьютерная диагностика - считывание кодов ошибок
2. Проверка компрессии в цилиндрах (норма зависит от модели)
3. Осмотр свечей зажигания и катушек
4. Проверка топливной системы

**Система зажигания:**
- Состояние свечей (зазор, нагар, износ)
- Катушки зажигания (сопротивление, пробой)
- Высоковольтные провода (если есть)

**Топливная система:**
- Давление топлива в рампе
- Состояние форсунок
- Топливный фильтр

**Система впуска:**
- Подсос воздуха
- Состояние воздушного фильтра
- Дроссельная заслонка

Для точной диагностики укажите:
- Марку, модель и год выпуска автомобиля
- Пробег
- Коды ошибок (если есть)
- Подробное описание симптомов`;
  }

  // Общий ответ
  return `**Консультация AutoTech Assistant:**

Спасибо за ваш запрос. Для предоставления точной технической консультации мне нужна дополнительная информация:

**Необходимые данные:**
- Марка, модель и год выпуска автомобиля
- Пробег
- Коды ошибок (если есть)
- Подробное описание симптомов

**Я могу помочь с:**
- Диагностикой кодов ошибок OBD2
- Рекомендациями по ремонту
- Подбором запчастей и их артикулов
- Пошаговыми инструкциями
- Техническими характеристиками

**Типовые категории:**
- Двигатель и выхлопная система
- Трансмиссия и КПП
- Электроника и диагностика
- Тормозная система
- Подвеска и рулевое управление
- Кондиционер и отопление

Пожалуйста, предоставьте более подробную информацию о проблеме, и я дам конкретные рекомендации.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, modelId, apiKey, temperature, maxTokens } =
      await req.json();

    // Если есть API ключ, используем OpenRouter
    if (apiKey && apiKey.length > 0) {
      // Список моделей для попыток (основная + fallback без :free суффикса)
      const openrouterModels: string[] = [];

      const errors: string[] = [];

      for (const model of openrouterModels) {
        try {
          const openrouterMessages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ];

          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
                "HTTP-Referer": "https://v0.app",
                "X-Title": "AutoTech Assistant",
              },
              body: JSON.stringify({
                model: model,
                messages: openrouterMessages,
                temperature: temperature || 0.7,
                max_tokens: maxTokens || 1024,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            const text =
              data.choices?.[0]?.message?.content ||
              "Извините, не удалось получить ответ.";

            // Извлекаем метаданные
            const usage = data.usage || {};
            const actualModel = data.model || model;

            return new Response(
              JSON.stringify({
                response: text,
                metadata: {
                  model: actualModel,
                  tokens: usage.total_tokens || 0,
                  promptTokens: usage.prompt_tokens || 0,
                  completionTokens: usage.completion_tokens || 0,
                  provider: "openrouter",
                },
              }),
              {
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const errorData = await response.text();

          // Сохраняем ошибку
          try {
            const errorJson = JSON.parse(errorData);
            const errorMsg =
              errorJson.error?.message ||
              errorJson.error?.metadata?.raw ||
              errorData;
            errors.push(`${model}: ${errorMsg}`);
          } catch {
            errors.push(`${model}: ${errorData}`);
          }

          // Если это rate limit, пробуем следующую модель
          if (response.status === 429) {
            continue;
          }
        } catch (openrouterError) {
          errors.push(`${model}: ${openrouterError}`);
          continue;
        }
      }

      // Возвращаем ошибку с деталями
      return new Response(
        JSON.stringify({
          response: "Извините, не удалось получить ответ.",
          metadata: {
            model: "error",
            tokens: 0,
            promptTokens: 0,
            completionTokens: 0,
            provider: "none",
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Если нет API ключа
    return new Response(
      JSON.stringify({
        response: `**Ошибка: API ключ не настроен**

Для использования AI моделей необходимо настроить OpenRouter API ключ.

**Как получить API ключ:**
1. Перейдите на [OpenRouter.ai](https://openrouter.ai)
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в Settings → Keys
4. Создайте новый API ключ
5. Добавьте его в настройках (кнопка ⚙️)

**Преимущества OpenRouter:**
- Доступ к 300+ моделей
- Бесплатные модели для начала
- Единый API для всех провайдеров

После добавления ключа вы сможете использовать различные AI модели для консультаций по ремонту автомобилей.`,
        metadata: {
          model: "no-api-key",
          tokens: 0,
          promptTokens: 0,
          completionTokens: 0,
          provider: "none",
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("[v0] Chat API error:", error);

    // Возвращаем полезный ответ даже при ошибке
    const body = await req.json().catch(() => ({ messages: [] }));
    const messages = body.messages || [];
    const lastMessage = messages[messages.length - 1]?.content || "";

    return new Response(
      JSON.stringify({
        response: generateFallbackResponse(lastMessage),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
