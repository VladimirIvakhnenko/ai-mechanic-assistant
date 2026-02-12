'use client'

import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatAreaProps {
  onSendMessage: (content: string) => Promise<void>
  isTyping?: boolean
}

export function ChatArea({ 
  onSendMessage,
  isTyping = false,
}: ChatAreaProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    if (!message.trim() || isTyping) return
    
    const messageToSend = message
    setMessage('')
    
    await onSendMessage(messageToSend)
    
    // Возвращаем фокус на поле ввода
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-card p-4 shrink-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите проблему, VIN или код ошибки..."
              className="min-h-[80px] resize-none bg-background"
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
          </div>
          <Button 
            size="icon" 
            className="h-10 w-10 shrink-0" 
            onClick={handleSend}
            disabled={isTyping || !message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
