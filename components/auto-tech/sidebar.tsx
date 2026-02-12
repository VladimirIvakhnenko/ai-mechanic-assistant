"use client";

import {
  Plus,
  Clock,
  Star,
  Wrench,
  Database,
  FileText,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ onNewChat, isOpen, onToggle }: SidebarProps) {
  const categories = [
    {
      title: "Двигатель и выхлопная система",
      items: [
        "Диагностика двигателя",
        "Система впрыска",
        "Турбонаддув",
        "Выхлопная система",
      ],
    },
    {
      title: "Трансмиссия и КПП",
      items: ["Механическая КПП", "Автоматическая КПП", "Сцепление", "Привод"],
    },
    {
      title: "Электроника и диагностика",
      items: ["Коды ошибок OBD2", "Датчики", "ЭБУ и прошивки", "Проводка"],
    },
    {
      title: "Тормозная система",
      items: [
        "Дисковые тормоза",
        "ABS/ESP",
        "Тормозная жидкость",
        "Ручной тормоз",
      ],
    },
    {
      title: "Подвеска и рулевое управление",
      items: [
        "Амортизаторы",
        "Рулевая рейка",
        "Шаровые опоры",
        "Развал-схождение",
      ],
    },
    {
      title: "Кондиционер и отопление",
      items: [
        "Заправка кондиционера",
        "Радиатор печки",
        "Компрессор",
        "Салонный фильтр",
      ],
    },
  ];

  const resources = [
    { icon: Database, label: "База TSB", color: "text-primary" },
    { icon: FileText, label: "Схемы подключения", color: "text-accent" },
    { icon: Clock, label: "Нормы времени работ", color: "text-secondary" },
    { icon: AlertCircle, label: "Коды ошибок OBD2", color: "text-destructive" },
  ];

  return (
    <div
      className={`h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0"
      } ${!isOpen && "border-0"}`}
      style={{ overflow: isOpen ? "visible" : "hidden" }}
    >
      {isOpen && (
        <>
          {/* Logo и кнопка закрытия */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                AutoTech
              </h1>
              <p className="text-xs text-sidebar-foreground/70">Assistant</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 shrink-0 rounded-full bg-sidebar border border-sidebar-border shadow-lg hover:bg-sidebar-accent"
            >
              <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
            </Button>
          </div>

          <Separator className="bg-sidebar-border" />

          <ScrollArea className="flex-1 px-4">
            {/* Quick Actions */}
            <div className="py-4 space-y-2">
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-3">
                Быстрые действия
              </h2>
              <Button
                variant="default"
                className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onNewChat}
              >
                <Plus className="w-4 h-4" />
                Новый диалог
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Clock className="w-4 h-4" />
                История запросов
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Star className="w-4 h-4" />
                Избранное
              </Button>
            </div>

            <Separator className="bg-sidebar-border my-4" />

            {/* Categories */}
            <div className="pb-4">
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-3">
                Категории проблем
              </h2>
              <Accordion type="single" collapsible className="space-y-1">
                {categories.map((category, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="py-2 px-2 hover:bg-sidebar-accent rounded-md text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground hover:no-underline">
                      {category.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="pl-4 space-y-1">
                        {category.items.map((item, itemIdx) => (
                          <Button
                            key={itemIdx}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
