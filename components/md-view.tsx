'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';

interface MDViewProps {
  /** Строка в формате Markdown */
  content: string
  /** Дополнительные классы для обёртки */
  className?: string
}

/**
 * Компонент для отображения контента в формате Markdown.
 * Использует react-markdown для корректного рендеринга заголовков, списков, кода и т.д.
 */
export function MDView({ content, className = '' }: MDViewProps) {
  if (!content?.trim()) {
    return null
  }

  return (
    <div className={`prose prose-sm max-w-none text-card-foreground dark:prose-invert prose-headings:font-semibold prose-p:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:leading-relaxed prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-muted prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:rounded-lg ${className}`}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </div>
  )
}
