'use client'

import { useState, useEffect } from 'react'
import { Settings, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

interface SettingsModalProps {
  apiKey: string
  onApiKeyChange: (key: string) => void
  temperature: number
  onTemperatureChange: (temp: number) => void
  maxTokens: number
  onMaxTokensChange: (tokens: number) => void
  streamEnabled: boolean
  onStreamEnabledChange: (enabled: boolean) => void
  cacheEnabled: boolean
  onCacheEnabledChange: (enabled: boolean) => void
  autoSelect: boolean
  onAutoSelectChange: (enabled: boolean) => void
}

export function SettingsModal({
  apiKey,
  onApiKeyChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  streamEnabled,
  onStreamEnabledChange,
  cacheEnabled,
  onCacheEnabledChange,
  autoSelect,
  onAutoSelectChange,
}: SettingsModalProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalApiKey(apiKey)
  }, [apiKey])

  const handleSave = () => {
    onApiKeyChange(localApiKey)
    setIsOpen(false)
  }

  const hasApiKey = apiKey.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Настройки API и параметров модели</DialogTitle>
          <DialogDescription>
            Настройте параметры подключения к OpenRouter и поведение модели
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api">API Ключ</TabsTrigger>
            <TabsTrigger value="parameters">Параметры</TabsTrigger>
            <TabsTrigger value="auto">Авто-настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                {hasApiKey ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Ключ сохранен</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">Требуется ключ для платных моделей</span>
                  </div>
                )}
                <Badge variant={hasApiKey ? "default" : "secondary"}>
                  {hasApiKey ? "Активен" : "Не установлен"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenRouter API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Ваш ключ хранится локально в браузере и используется только для запросов к OpenRouter
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Получить API ключ</p>
                  <p className="text-xs text-muted-foreground">
                    Создайте бесплатный аккаунт на OpenRouter
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2 bg-transparent"
                  >
                    Открыть
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>

              <Button onClick={handleSave} className="w-full">
                Сохранить ключ
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Температура</Label>
                  <span className="text-sm text-muted-foreground font-mono">{temperature.toFixed(1)}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={([value]) => onTemperatureChange(value)}
                />
                <p className="text-xs text-muted-foreground">
                  Низкая температура (0.1-0.5) - более точные и детерминированные ответы. 
                  Высокая (1.0-2.0) - более креативные и разнообразные.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maxTokens">Макс. токенов</Label>
                  <span className="text-sm text-muted-foreground font-mono">{maxTokens}</span>
                </div>
                <Slider
                  id="maxTokens"
                  min={256}
                  max={8192}
                  step={256}
                  value={[maxTokens]}
                  onValueChange={([value]) => onMaxTokensChange(value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ограничивает длину ответа. Больше токенов = более детальные ответы, но дольше и дороже.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label htmlFor="stream" className="cursor-pointer">Stream ответы</Label>
                    <p className="text-xs text-muted-foreground">
                      Получать ответ частями для более быстрой реакции
                    </p>
                  </div>
                  <Switch
                    id="stream"
                    checked={streamEnabled}
                    onCheckedChange={onStreamEnabledChange}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label htmlFor="cache" className="cursor-pointer">Кэшировать ответы</Label>
                    <p className="text-xs text-muted-foreground">
                      Сохранять ответы для повторного использования
                    </p>
                  </div>
                  <Switch
                    id="cache"
                    checked={cacheEnabled}
                    onCheckedChange={onCacheEnabledChange}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auto" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label htmlFor="autoSelect" className="cursor-pointer">
                    Автоматический выбор модели
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Система выберет оптимальную модель для каждого запроса
                  </p>
                </div>
                <Switch
                  id="autoSelect"
                  checked={autoSelect}
                  onCheckedChange={onAutoSelectChange}
                />
              </div>

              {autoSelect && (
                <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">Диагностика кодов</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">
                      DeepSeek R1 - специализирован на технических задачах и анализе
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Поиск запчастей</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">
                      Qwen Coder - оптимален для структурированного поиска данных
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-medium">Инструкции по ремонту</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">
                      Llama 3.2 - лучший выбор для пошаговых инструкций
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm font-medium">Как работает авто-выбор?</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Анализирует содержание вашего запроса</li>
                  <li>Определяет тип задачи (диагностика, инструкция, поиск)</li>
                  <li>Выбирает модель с лучшей производительностью для этой задачи</li>
                  <li>Автоматически переключается между моделями по необходимости</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
