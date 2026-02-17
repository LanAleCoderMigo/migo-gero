"use client"

import { useState, useEffect } from "react"
import { Timer, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionTimerProps {
  initialMinutes?: number
  onSessionExpired: () => void
}

export function SessionTimer({ initialMinutes = 10, onSessionExpired }: SessionTimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60)

  useEffect(() => {
    if (seconds <= 0) {
      onSessionExpired()
      return
    }
    const interval = setInterval(() => {
      setSeconds((s) => s - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [seconds, onSessionExpired])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  const isLow = seconds < 120

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-mono transition-colors",
        isLow
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-border bg-secondary text-muted-foreground"
      )}
      role="timer"
      aria-label={`Session expires in ${display}`}
    >
      {isLow ? (
        <LogOut className="h-3.5 w-3.5" />
      ) : (
        <Timer className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">Inactivity logout:</span>
      <span className={cn("font-semibold", isLow && "animate-pulse")}>
        {display}
      </span>
    </div>
  )
}
