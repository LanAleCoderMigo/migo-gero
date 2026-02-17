"use client"

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Sparkles, User } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AiText } from "@/components/ui/ai-text"
import { CLIENTS_DATA } from "@/lib/data/merchants"

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface MerchantOption {
  id: number
  name: string
  country: string
}

// ─── Unique merchant list for autocomplete ───────────────────────────────────

const merchantOptions: MerchantOption[] = (() => {
  const seen = new Set<string>()
  const opts: MerchantOption[] = []
  for (const c of CLIENTS_DATA) {
    const key = `${c.name}-${c.id}`
    if (!seen.has(key)) {
      seen.add(key)
      opts.push({ id: c.id, name: c.name, country: c.country })
    }
  }
  return opts.sort((a, b) => a.name.localeCompare(b.name))
})()

const EXAMPLE_QUERIES = [
  "¿Cómo está ClientId 391?",
  "¿Quiénes están en riesgo de churn?",
  "Top 5 merchants por volumen",
  "Merchants con success rate < 30%",
]

// ─── Component ───────────────────────────────────────────────────────────────

export function MerchantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(
    null
  )
  const [suggestions, setSuggestions] = useState<MerchantOption[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Autocomplete logic ──────────────────────────────────────────────────

  const updateSuggestions = useCallback((value: string) => {
    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Extract last word after space or at start
    const words = value.split(/\s+/)
    const lastWord = words[words.length - 1].toLowerCase()

    if (lastWord.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const matches = merchantOptions.filter(
      (m) =>
        m.name.toLowerCase().includes(lastWord) ||
        String(m.id).includes(lastWord)
    ).slice(0, 6)

    setSuggestions(matches)
    setShowSuggestions(matches.length > 0)
    setHighlightedIndex(-1)
  }, [])

  const selectSuggestion = useCallback(
    (merchant: MerchantOption) => {
      // Replace last word with merchant name
      const words = input.split(/\s+/)
      words[words.length - 1] = merchant.name
      const newInput = words.join(" ") + " "

      setInput(newInput)
      setSelectedMerchantId(String(merchant.id))
      setShowSuggestions(false)
      setSuggestions([])
      inputRef.current?.focus()
    },
    [input]
  )

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // ── Handle input changes ────────────────────────────────────────────────

  const handleInputChange = (value: string) => {
    setInput(value)
    updateSuggestions(value)

    // Try to detect a merchant ID or name in the full text
    const idMatch = value.match(/(?:client\s*id|id)\s*(\d+)/i)
    if (idMatch) {
      const found = CLIENTS_DATA.find((c) => c.id === Number(idMatch[1]))
      if (found) setSelectedMerchantId(String(found.id))
    }
  }

  // ── Keyboard navigation for suggestions ─────────────────────────────────

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[highlightedIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  // ── Submit handler with streaming ───────────────────────────────────────

  const handleSubmit = async (e?: FormEvent, overrideMessage?: string) => {
    e?.preventDefault()

    const messageText = overrideMessage ?? input.trim()
    if (!messageText || loading) return

    const userMessage: ChatMessage = { role: "user", content: messageText }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setShowSuggestions(false)
    setLoading(true)

    // Build history for API (exclude the current user message)
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          message: messageText,
          merchantId: selectedMerchantId ?? undefined,
          history,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response stream")

      const decoder = new TextDecoder()
      let accumulated = ""

      // Add placeholder assistant message
      setMessages([...newMessages, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages([
          ...newMessages,
          { role: "assistant", content: accumulated },
        ])
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error desconocido"
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `⚠️ Error: ${errorMsg}. Intenta de nuevo.`,
        },
      ])
    } finally {
      setLoading(false)
      setSelectedMerchantId(null)
    }
  }

  // ── Example query click ─────────────────────────────────────────────────

  const handleExampleClick = (query: string) => {
    setInput(query)
    // Detect merchantId from example query
    const idMatch = query.match(/(?:client\s*id|id)\s*(\d+)/i)
    if (idMatch) {
      const found = CLIENTS_DATA.find((c) => c.id === Number(idMatch[1]))
      if (found) setSelectedMerchantId(String(found.id))
    }
    handleSubmit(undefined, query)
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <Card className="border-border/60 bg-card flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Image src="/lume-logo.jpg" alt="LUME" width={80} height={32} className="rounded" />
          <CardTitle className="text-card-foreground">Merchant Chat</CardTitle>
        </div>
        <CardDescription>
          Pregunta sobre cualquier merchant del portafolio — respuestas con IA
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Messages area */}
        <ScrollArea className="h-[380px] rounded-lg border border-border/40 bg-secondary/20">
          <div className="flex flex-col gap-3 p-4">
            {messages.length === 0 ? (
              /* Empty state with examples */
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-card-foreground">
                    ¿Sobre qué merchant quieres saber?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prueba con una de estas preguntas:
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {EXAMPLE_QUERIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleExampleClick(q)}
                      className="rounded-lg border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-card-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation */
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  {msg.role === "user" ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e2a3a] border border-border/40 overflow-hidden p-1">
                      <Image src="/lume-logo.jpg" alt="LUME" width={24} height={10} className="object-contain" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2.5",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/60 border border-border/40 text-card-foreground"
                    )}
                  >
                    {msg.role === "assistant" &&
                    msg.content === "" &&
                    loading ? (
                      <div className="flex flex-col gap-2 py-1">
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-3 w-36" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    ) : (
                      <div>
                        {msg.role === "assistant" ? (
                          <AiText>{msg.content}</AiText>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        )}
                        {msg.role === "assistant" &&
                          loading &&
                          i === messages.length - 1 && (
                            <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/60 animate-pulse align-text-bottom" />
                          )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Selected merchant context indicator */}
        {selectedMerchantId && (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/5 text-primary text-xs gap-1"
            >
              Contexto: ID {selectedMerchantId} —{" "}
              {CLIENTS_DATA.find((c) => c.id === Number(selectedMerchantId))
                ?.name ?? ""}
            </Badge>
            <button
              type="button"
              onClick={() => setSelectedMerchantId(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input area */}
        <form onSubmit={handleSubmit} className="relative flex gap-2">
          <div className="relative flex-1" ref={suggestionsRef}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta sobre un merchant..."
              disabled={loading}
              className={cn(
                "h-10 w-full rounded-lg border border-input bg-secondary pl-3 pr-3 text-sm text-secondary-foreground",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />

            {/* Autocomplete dropdown */}
            {showSuggestions && (
              <div className="absolute bottom-full left-0 mb-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50">
                {suggestions.map((m, i) => (
                  <button
                    key={`${m.id}-${m.name}`}
                    type="button"
                    onClick={() => selectSuggestion(m)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                      i === highlightedIndex
                        ? "bg-primary/10 text-card-foreground"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-card-foreground"
                    )}
                  >
                    <span className="font-medium">{m.name}</span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground font-mono text-[10px] px-1.5 py-0"
                      >
                        {m.country}
                      </Badge>
                      <span className="font-mono text-muted-foreground/60">
                        #{m.id}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            aria-label="Enviar mensaje"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
