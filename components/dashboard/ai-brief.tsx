"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BrainCircuit, RefreshCw } from "lucide-react"

export function AiBrief() {
  const [brief, setBrief] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  const fetchBrief = useCallback(async () => {
    setBrief("")
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "brief", merchantId: "391" }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response stream")

      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setBrief(accumulated)
      }

      setGeneratedAt(
        new Date().toLocaleString("es-GT", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrief()
  }, [fetchBrief])

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">AI Executive Brief</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={fetchBrief}
            disabled={loading}
            aria-label="Regenerar brief"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>
          Resumen ejecutivo generado por IA del merchant principal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* AI status header */}
          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2">
            <div className="flex gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${loading ? "bg-primary animate-pulse" : "bg-primary"}`} />
              <span className={`h-1.5 w-1.5 rounded-full ${loading ? "bg-primary animate-pulse [animation-delay:200ms]" : "bg-primary"}`} />
              <span className={`h-1.5 w-1.5 rounded-full ${loading ? "bg-primary animate-pulse [animation-delay:400ms]" : "bg-primary"}`} />
            </div>
            <span className="text-xs text-muted-foreground">
              {loading
                ? "Migo AI — Generando brief..."
                : generatedAt
                  ? `Migo AI — Generado: ${generatedAt}`
                  : "Migo AI — Listo"}
            </span>
          </div>

          {/* Content area */}
          <div className="rounded-lg border border-border/40 bg-secondary/30 p-4 min-h-[160px]">
            {error ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-destructive font-medium">
                  Error al generar brief
                </p>
                <p className="text-xs text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchBrief}
                  className="mt-2 w-fit"
                >
                  Reintentar
                </Button>
              </div>
            ) : loading && !brief ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {brief}
                {loading && (
                  <span className="inline-block w-2 h-4 ml-0.5 bg-primary/60 animate-pulse align-text-bottom" />
                )}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
