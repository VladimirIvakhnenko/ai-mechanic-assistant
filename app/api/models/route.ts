import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Фильтруем и группируем модели
    const models = data.data || []
    
    // Бесплатные модели (где prompt pricing = "0")
    const freeModels = models.filter((model: any) => 
      model.pricing?.prompt === "0" || model.pricing?.prompt === 0
    )
    
    // Популярные модели (хардкод для стабильности)
    const popularModels = [
      'deepseek/deepseek-r1',
      'meta-llama/llama-3.2-90b-vision-instruct',
      'qwen/qwen-2.5-coder-32b-instruct',
      'anthropic/claude-4.5-sonnet',
    ]
    
    // Быстрые модели (небольшой context и размер)
    const fastModels = models.filter((model: any) => 
      model.context_length && 
      model.context_length <= 32768 &&
      (model.id.includes('7b') || model.id.includes('8b') || model.id.includes('mini'))
    ).slice(0, 10)
    
    return new Response(
      JSON.stringify({
        allModels: models,
        freeModels: freeModels.slice(0, 20), // Ограничиваем до 20 для производительности
        popularModels: models.filter((m: any) => popularModels.includes(m.id)),
        fastModels: fastModels,
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600' // Кэш на 1 час
        },
      }
    )
  } catch (error) {
    console.error('[v0] Error fetching models:', error)
    
    // Возвращаем fallback модели при ошибке
    return new Response(
      JSON.stringify({
        allModels: [],
        freeModels: [
          {
            id: 'deepseek/deepseek-r1',
            name: 'DeepSeek R1',
            context_length: 128000,
            pricing: { prompt: '0', completion: '0' }
          },
          {
            id: 'meta-llama/llama-3.2-90b-vision-instruct',
            name: 'Llama 3.2 90B Vision',
            context_length: 128000,
            pricing: { prompt: '0', completion: '0' }
          }
        ],
        popularModels: [
          {
            id: 'deepseek/deepseek-r1',
            name: 'DeepSeek R1',
            context_length: 128000,
            pricing: { prompt: '0', completion: '0' }
          }
        ],
        fastModels: [],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
