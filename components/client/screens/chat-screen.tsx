"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Bot, User, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  actions?: { label: string; variant: "default" | "outline" }[]
  time: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Buenos dias, Carlos. En que puedo ayudarte hoy?",
    time: "9:30"
  },
  {
    id: "2",
    role: "user",
    content: "Que reuniones tengo hoy?",
    time: "9:31"
  },
  {
    id: "3",
    role: "assistant",
    content: "Hoy tienes 3 reuniones:\n\n10:00 - Standup diario\n14:00 - Revision con Maria\n16:30 - Llamada cliente ABC",
    actions: [
      { label: "Ver detalles", variant: "outline" },
      { label: "Reprogramar", variant: "outline" }
    ],
    time: "9:31"
  },
  {
    id: "4",
    role: "user",
    content: "Responde el correo de Juan diciendo que nos vemos manana",
    time: "9:35"
  },
  {
    id: "5",
    role: "assistant",
    content: "He preparado esta respuesta:\n\n\"Hola Juan, perfecto, nos vemos manana. Saludos.\"\n\nQuieres que lo envie?",
    actions: [
      { label: "Enviar", variant: "default" },
      { label: "Editar", variant: "outline" }
    ],
    time: "9:35"
  }
]

export function ClientChatScreen() {
  const [messages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm text-foreground">AsistenteAI</p>
          <p className="text-xs text-muted-foreground">En linea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {message.role === "assistant" && (
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
            
            <div className={cn(
              "max-w-[75%] space-y-2",
              message.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-2xl px-3 py-2 text-sm",
                message.role === "assistant" 
                  ? "bg-card border border-border text-card-foreground rounded-tl-sm" 
                  : "bg-primary text-primary-foreground rounded-tr-sm"
              )}>
                <p className="whitespace-pre-line text-[13px]">{message.content}</p>
              </div>
              
              {message.actions && (
                <div className="flex gap-1.5 flex-wrap">
                  {message.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={action.variant}
                      size="sm"
                      className="rounded-full text-[11px] h-7 px-3"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              
              <p className={cn(
                "text-[10px] text-muted-foreground px-1",
                message.role === "user" && "text-right"
              )}>
                {message.time}
              </p>
            </div>

            {message.role === "user" && (
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex gap-2 items-center bg-secondary rounded-full p-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 border-0 bg-transparent h-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-3"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full shrink-0",
              isRecording && "bg-destructive text-destructive-foreground"
            )}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8 rounded-full shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
