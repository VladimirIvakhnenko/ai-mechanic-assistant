'use client'

import { X, Search, FileText, AlertTriangle, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DiagnosticPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function DiagnosticPanel({ isOpen, onClose }: DiagnosticPanelProps) {
  if (!isOpen) return null

  const relatedTSBs = [
    { code: 'TSB-15-088', title: 'Пропуски зажигания - катушки', severity: 'high' },
    { code: 'TSB-16-022', title: 'Обновление ПО ЭБУ', severity: 'medium' },
    { code: 'TSB-14-156', title: 'Свечи зажигания - замена', severity: 'low' }
  ]

  const procedures = [
    'Проверка компрессии двигателя',
    'Диагностика системы зажигания',
    'Проверка форсунок',
    'Тест на герметичность впускного тракта'
  ]

  return (
    <div className="w-96 h-full bg-card border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Диагностические данные</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Vehicle Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              Данные автомобиля
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="vin" className="text-xs">VIN номер</Label>
                <Input 
                  id="vin" 
                  placeholder="JMZGH12F661123456"
                  className="bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mileage" className="text-xs">Пробег (км)</Label>
                <Input 
                  id="mileage" 
                  type="number"
                  placeholder="125000"
                  className="bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="service-history" className="text-xs">История обслуживания</Label>
                <Textarea 
                  id="service-history" 
                  placeholder="Последнее ТО: 120000 км&#10;Замена масла: 123000 км"
                  className="min-h-[80px] bg-background resize-none"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Related TSBs */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Связанные TSB
            </h3>
            
            <div className="space-y-2">
              {relatedTSBs.map((tsb, idx) => (
                <Card 
                  key={idx}
                  className="p-3 hover:bg-accent/5 cursor-pointer transition-colors border-border"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-primary">
                          {tsb.code}
                        </span>
                        <Badge 
                          variant={tsb.severity === 'high' ? 'destructive' : tsb.severity === 'medium' ? 'default' : 'secondary'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tsb.severity === 'high' ? 'Важно' : tsb.severity === 'medium' ? 'Средне' : 'Низко'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tsb.title}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full gap-2 text-xs bg-transparent">
              <Search className="w-3 h-3" />
              Искать в базе TSB
            </Button>
          </div>

          <Separator />

          {/* Recommended Procedures */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Рекомендованные процедуры
            </h3>
            
            <div className="space-y-2">
              {procedures.map((procedure, idx) => (
                <Card 
                  key={idx}
                  className="p-3 hover:bg-accent/5 cursor-pointer transition-colors border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                    </div>
                    <span className="text-xs text-foreground">{procedure}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Parts Order */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Заказ запчастей</h3>
            
            <div className="space-y-2">
              <Card className="p-3 bg-muted/50 border-border">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Свечи зажигания x4</span>
                    <span className="font-semibold text-foreground">$120</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Артикул: MZ690150
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-muted/50 border-border">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Катушка зажигания x1</span>
                    <span className="font-semibold text-foreground">$85</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Артикул: MN195567
                  </div>
                </div>
              </Card>

              <Button variant="default" size="sm" className="w-full mt-2">
                Сформировать заказ
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
