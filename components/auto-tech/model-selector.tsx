'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Zap, Sparkles, DollarSign, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface OpenRouterModel {
  id: string
  name: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
  }
}

interface Model {
  id: string
  name: string
  displayName: string
  contextWindow: string
  isFree: boolean
  category: 'popular' | 'free' | 'fast'
}

// Fallback модели на случай ошибки загрузки
const FALLBACK_MODELS: Model[] = [
  {
    id: 'deepseek/deepseek-r1',
    name: 'deepseek-r1',
    displayName: 'DeepSeek R1',
    contextWindow: '128K',
    isFree: true,
    category: 'popular'
  },
  {
    id: 'meta-llama/llama-3.2-90b-vision-instruct',
    name: 'llama-3.2-90b',
    displayName: 'Llama 3.2 90B',
    contextWindow: '128K',
    isFree: false,
    category: 'popular'
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct',
    name: 'qwen-coder',
    displayName: 'Qwen Coder 32B',
    contextWindow: '32K',
    isFree: true,
    category: 'popular'
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'mistral-7b',
    displayName: 'Mistral 7B',
    contextWindow: '32K',
    isFree: true,
    category: 'free'
  },
  {
    id: 'google/gemma-2-9b-it',
    name: 'gemma-2-9b',
    displayName: 'Gemma 2 9B',
    contextWindow: '8K',
    isFree: true,
    category: 'free'
  },
  {
    id: 'microsoft/phi-3-medium-128k-instruct',
    name: 'phi-3-medium',
    displayName: 'Phi-3 Medium',
    contextWindow: '128K',
    isFree: true,
    category: 'free'
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct',
    name: 'llama-3.1-8b',
    displayName: 'Llama 3.1 8B',
    contextWindow: '128K',
    isFree: true,
    category: 'fast'
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'claude-haiku',
    displayName: 'Claude 3.5 Haiku',
    contextWindow: '200K',
    isFree: false,
    category: 'fast'
  },
]

const MODELS: Model[] = FALLBACK_MODELS; // Declare the MODELS variable

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

function formatContextWindow(contextLength: number): string {
  if (contextLength >= 1000000) {
    return `${(contextLength / 1000000).toFixed(1)}M`
  }
  if (contextLength >= 1000) {
    return `${Math.round(contextLength / 1000)}K`
  }
  return `${contextLength}`
}

function formatModelName(name: string): string {
  // Извлекаем имя модели из полного ID
  const parts = name.split('/')
  const modelName = parts[parts.length - 1]
  
  // Упрощаем название
  return modelName
    .replace(/-instruct/gi, '')
    .replace(/-v0\.\d+/gi, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .substring(0, 30)
}

function convertToModel(apiModel: OpenRouterModel, category: 'popular' | 'free' | 'fast'): Model {
  return {
    id: apiModel.id,
    name: apiModel.name,
    displayName: formatModelName(apiModel.name),
    contextWindow: formatContextWindow(apiModel.context_length),
    isFree: apiModel.pricing?.prompt === '0' || apiModel.pricing?.prompt === 0,
    category
  }
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>(FALLBACK_MODELS)
  const [isLoading, setIsLoading] = useState(true)
  const [popularModels, setPopularModels] = useState<Model[]>([])
  const [freeModels, setFreeModels] = useState<Model[]>([])
  const [fastModels, setFastModels] = useState<Model[]>([])

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/models')
        
        if (!response.ok) {
          throw new Error('Failed to fetch models')
        }
        
        const data = await response.json()
        
        // Конвертируем API модели в наш формат
        const popular = data.popularModels?.map((m: OpenRouterModel) => convertToModel(m, 'popular')) || []
        const free = data.freeModels?.map((m: OpenRouterModel) => convertToModel(m, 'free')) || []
        const fast = data.fastModels?.map((m: OpenRouterModel) => convertToModel(m, 'fast')) || []
        
        setPopularModels(popular)
        setFreeModels(free)
        setFastModels(fast)
        setModels([...popular, ...free, ...fast])
        
      } catch (error) {
        console.error('[v0] Error loading models:', error)
        // Используем fallback модели
        const popular = FALLBACK_MODELS.filter(m => m.category === 'popular')
        const free = FALLBACK_MODELS.filter(m => m.category === 'free')
        const fast = FALLBACK_MODELS.filter(m => m.category === 'fast')
        
        setPopularModels(popular)
        setFreeModels(free)
        setFastModels(fast)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchModels()
  }, [])

  const currentModel = models.find(m => m.id === selectedModel) || models[0] || FALLBACK_MODELS[0]

  if (isLoading) {
    return (
      <div className="w-full h-10 bg-background border border-border rounded-md flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-full bg-background border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{currentModel.displayName}</span>
            {currentModel.isFree && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                Free
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{currentModel.contextWindow}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        <SelectGroup>
          <SelectLabel className="flex items-center gap-2 text-xs">
            <Sparkles className="w-3 h-3" />
            Популярные
          </SelectLabel>
          {popularModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.displayName}</span>
                  {model.isFree ? (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      Free
                    </Badge>
                  ) : (
                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{model.contextWindow}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel className="flex items-center gap-2 text-xs mt-2">
            <DollarSign className="w-3 h-3" />
            Бесплатные
          </SelectLabel>
          {freeModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.displayName}</span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    Free
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{model.contextWindow}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel className="flex items-center gap-2 text-xs mt-2">
            <Zap className="w-3 h-3" />
            Быстрые
          </SelectLabel>
          {fastModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.displayName}</span>
                  {model.isFree ? (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      Free
                    </Badge>
                  ) : (
                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{model.contextWindow}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
