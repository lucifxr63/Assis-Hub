"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  actions?: { label: string; variant: "default" | "outline" }[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Buenos días, Carlos. ¿En qué puedo ayudarte hoy?"
  },
  {
    id: "2",
    role: "user",
    content: "¿Qué reuniones tengo hoy?"
  },
  {
    id: "3",
    role: "assistant",
    content: "Hoy tienes 3 reuniones programadas:\n\n• 10:00 AM - Standup diario con el equipo\n• 2:00 PM - Revisión de proyecto con María\n• 4:30 PM - Llamada con cliente (Inversiones ABC)",
    actions: [
      { label: "Ver detalles", variant: "outline" },
      { label: "Reprogramar", variant: "outline" }
    ]
  },
  {
    id: "4",
    role: "user",
    content: "Responde el último correo de Juan diciendo que nos vemos mañana a las 10"
  },
  {
    id: "5",
    role: "assistant",
    content: "He preparado esta respuesta para Juan:\n\n\"Hola Juan, perfecto, nos vemos mañana a las 10. Saludos.\"\n\n¿Quieres que lo envíe?",
    actions: [
      { label: "Confirmar", variant: "default" },
      { label: "Cancelar", variant: "outline" }
    ]
  }
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    }
    
    setMessages([...messages, newMessage])
    setInput("")
    
    // Simulate assistant response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Entendido. Estoy procesando tu solicitud...",
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-11rem)] max-w-2xl mx-auto px-4">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className={cn(
              "h-8 w-8 shrink-0",
              message.role === "assistant" ? "bg-primary" : "bg-secondary"
            )}>
              <AvatarFallback className={cn(
                message.role === "assistant" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              )}>
                {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            
            <div className={cn(
              "max-w-[80%] space-y-2",
              message.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                message.role === "assistant" 
                  ? "bg-card border border-border text-card-foreground rounded-tl-sm" 
                  : "bg-primary text-primary-foreground rounded-tr-sm"
              )}>
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
              
              {message.actions && (
                <div className="flex gap-2 flex-wrap">
                  {message.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={action.variant}
                      size="sm"
                      className="rounded-full text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="py-4 border-t border-border">
        <div className="flex gap-2 items-center bg-card rounded-full border border-border p-2 shadow-sm">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full shrink-0 transition-colors",
              isRecording && "bg-destructive text-destructive-foreground"
            )}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="rounded-full shrink-0"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
