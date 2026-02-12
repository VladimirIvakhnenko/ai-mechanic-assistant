'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/auto-tech/sidebar'
import { ChatArea } from '@/components/auto-tech/chat-area'
import { DiagnosticPanel } from '@/components/auto-tech/diagnostic-panel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MDView } from '@/components/md-view'

interface Message {
  role: string
  content: string
  timestamp: string
  metadata?: {
    model: string
    tokens: number
    promptTokens: number
    completionTokens: number
    provider: string
  }
}

export default function AutoTechPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentChat, setCurrentChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  


  const handleSendMessage = async (content: string) => {
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMessage])

    try {
      // Используем новый Yandex Cloud API
      const response = await fetch('/api/yandex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: 'fvtc79b7h6mojv1a0h9d', // ID промпта из примера
          input: content
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      console.log(data);
      // Добавляем ответ ассистента
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.output_text || data.error || 'Не удалось получить ответ',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        metadata: data.metadata
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('[Yandex] Error sending message:', error)
      // Добавляем сообщение об ошибке
      const errorMessage: Message = {
        role: 'assistant',
        content: `Ошибка: ${error.message || 'Не удалось отправить запрос'}`,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentChat(null)
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  // Автопрокрутка при новых сообщениях
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Кнопка открытия меню (видна только когда сайдбар закрыт) */}
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-4 top-4 z-10 h-9 w-9 rounded-full border-border bg-card shadow-md hover:bg-accent"
            title="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6">
            <div className="max-w-4xl mx-auto space-y-6 pb-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">AT</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    AutoTech Assistant готов помочь
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Опишите проблему с автомобилем, укажите код ошибки или задайте вопрос по ремонту и диагностике
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' ? (
                    <Card className="max-w-3xl bg-card border-border p-6 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary-foreground">AT</span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <MDView content={msg.content} />
                          <div className="text-xs text-muted-foreground">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="max-w-2xl bg-primary/5 border-primary/20 p-4">
                      <p className="text-sm text-foreground">{msg.content}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">{msg.timestamp}</span>
                    </Card>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <ChatArea 
          onSendMessage={handleSendMessage}
          isTyping={false}
        />
      </div>
      <DiagnosticPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}
