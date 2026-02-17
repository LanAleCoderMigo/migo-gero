"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  getProcessorPerformance,
  simulateRouting,
} from "@/lib/data/processors"
import type { ProcessorPerformance } from "@/lib/data/processors"

// ─── Precompute active processors ───────────────────────────────────────────

const allProcessors = getProcessorPerformance()
const activeProcessors = allProcessors.filter((p) => p.status === "active")

function formatUsd(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

function formatUsdFull(v: number): string {
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// ─── Component ──────────────────────────────────────────────────────────────

export function RoutingSimulator({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [fromId, setFromId] = useState<string>("")
  const [toId, setToId] = useState<string>("")
  const [percent, setPercent] = useState(30)

  const fromProc = useMemo(
    () => activeProcessors.find((p) => String(p.id) === fromId) ?? null,
    [fromId]
  )
  const toProc = useMemo(
    () => allProcessors.find((p) => String(p.id) === toId) ?? null,
    [toId]
  )

  const isSame = fromId === toId && fromId !== ""
  const isValid = fromProc && toProc && !isSame && percent > 0

  // ── Computed simulation ────────────────────────────────────────────────

  const simulation = useMemo(() => {
    if (!fromProc || !toProc || isSame) return null

    const result = simulateRouting(fromProc.id, toProc.id, percent)
    const volumeToMove = fromProc.totalVolume * (percent / 100)
    const remainingFrom = fromProc.totalVolume - volumeToMove
    const monthlyCostFrom = fromProc.totalVolume * (fromProc.avgCost / 100) / 12
    const newMonthlyCostFrom = remainingFrom * (fromProc.avgCost / 100) / 12
    const newMonthlyCostTo = volumeToMove * (toProc.avgCost / 100) / 12
    const totalNewMonthlyCost = newMonthlyCostFrom + newMonthlyCostTo
    const costSavingsMonthly = monthlyCostFrom - totalNewMonthlyCost + (toProc.status === "active" ? toProc.totalVolume * (toProc.avgCost / 100) / 12 : 0) - (toProc.status === "active" ? toProc.totalVolume * (toProc.avgCost / 100) / 12 : 0)
    const netCostSavings = result.impactUSD / 12

    // Success rate improvement revenue
    const rateImprovement = result.successRateChange
    const additionalRevenue =
      rateImprovement > 0
        ? volumeToMove * (rateImprovement / 100) * 0.018
        : 0

    const totalMonthlyImpact = netCostSavings + additionalRevenue / 12

    return {
      volumeToMove,
      remainingFrom,
      monthlyCostFrom,
      newMonthlyCostFrom,
      newMonthlyCostTo,
      netCostSavings,
      rateImprovement,
      additionalRevenue: additionalRevenue / 12,
      totalMonthlyImpact,
    }
  }, [fromProc, toProc, percent, isSame])

  const handleApply = () => {
    toast.success("Simulación de routing aplicada", {
      description:
        "Esto es un demo — no se realizaron cambios reales en el enrutamiento.",
    })
    onOpenChange(false)
    setFromId("")
    setToId("")
    setPercent(30)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFromId("")
    setToId("")
    setPercent(30)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Simulador de Routing
          </DialogTitle>
          <DialogDescription>
            Simula el impacto financiero de redirigir volumen entre
            procesadores.
          </DialogDescription>
        </DialogHeader>

        {/* SECTION 1 — Configuration */}
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-secondary/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Configuración
            </p>

            {/* FROM / TO selects */}
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Mover volumen desde
                </label>
                <Select value={fromId} onValueChange={setFromId}>
                  <SelectTrigger size="default" className="w-full">
                    <SelectValue placeholder="Origen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProcessors.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}{" "}
                        <span className="text-muted-foreground">
                          ({formatUsd(p.totalVolume)})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground mt-5 shrink-0" />

              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-muted-foreground">Hacia</label>
                <Select value={toId} onValueChange={setToId}>
                  <SelectTrigger size="default" className="w-full">
                    <SelectValue placeholder="Destino..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allProcessors
                      .filter((p) => String(p.id) !== fromId)
                      .map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                          {p.status === "active" && (
                            <span className="text-muted-foreground">
                              {" "}
                              ({p.avgCost}%)
                            </span>
                          )}
                          {p.status === "unused" && (
                            <span className="text-muted-foreground/50">
                              {" "}
                              (sin uso)
                            </span>
                          )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isSame && (
              <p className="text-xs text-destructive">
                Origen y destino no pueden ser el mismo procesador.
              </p>
            )}

            {/* Volume slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">
                  Porcentaje de volumen a mover
                </label>
                <span className="text-sm font-semibold text-card-foreground">
                  {percent}%
                </span>
              </div>
              <Slider
                value={[percent]}
                onValueChange={([v]) => setPercent(v)}
                min={5}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>5%</span>
                <span className="font-medium text-card-foreground">
                  {fromProc
                    ? formatUsdFull(
                        fromProc.totalVolume * (percent / 100)
                      ) + " USD a mover"
                    : "Selecciona un origen"}
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Impact Preview */}
          {isValid && simulation && (
            <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-secondary/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vista previa de impacto
              </p>

              {/* Current vs Projected */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current state */}
                <div className="rounded-md border border-border/50 bg-card p-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Estado actual
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Procesador</span>
                      <span className="font-medium text-card-foreground">
                        {fromProc.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Volumen</span>
                      <span className="font-mono text-card-foreground">
                        {formatUsd(fromProc.totalVolume)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-mono text-card-foreground">
                        {fromProc.successRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Costo mensual</span>
                      <span className="font-mono text-card-foreground">
                        {formatUsd(simulation.monthlyCostFrom)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Projected state */}
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-primary">
                    Proyectado
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        En {fromProc.name}
                      </span>
                      <span className="font-mono text-card-foreground">
                        {formatUsd(simulation.remainingFrom)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        En {toProc.name}
                      </span>
                      <span className="font-mono text-primary">
                        +{formatUsd(simulation.volumeToMove)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Rate change
                      </span>
                      <span
                        className={cn(
                          "font-mono flex items-center gap-0.5",
                          simulation.rateImprovement > 0
                            ? "text-primary"
                            : simulation.rateImprovement < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                        )}
                      >
                        {simulation.rateImprovement > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : simulation.rateImprovement < 0 ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : null}
                        {simulation.rateImprovement > 0 ? "+" : ""}
                        {simulation.rateImprovement}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Costo mensual
                      </span>
                      <span
                        className={cn(
                          "font-mono",
                          simulation.netCostSavings > 0
                            ? "text-primary"
                            : "text-destructive"
                        )}
                      >
                        {simulation.netCostSavings > 0 ? "-" : "+"}
                        {formatUsd(Math.abs(simulation.netCostSavings))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net impact */}
              <div
                className={cn(
                  "rounded-md border p-4",
                  simulation.totalMonthlyImpact >= 0
                    ? "border-primary/30 bg-primary/5"
                    : "border-destructive/30 bg-destructive/5"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-card-foreground" />
                    <span className="text-xs font-semibold text-card-foreground">
                      Impacto neto mensual
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      simulation.totalMonthlyImpact >= 0
                        ? "text-primary"
                        : "text-destructive"
                    )}
                  >
                    {simulation.totalMonthlyImpact >= 0 ? "+" : ""}
                    {formatUsd(simulation.totalMonthlyImpact)}
                  </span>
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/40 pt-3">
                  <div className="flex justify-between">
                    <span>
                      Ahorro en comisiones ({fromProc.avgCost}% →{" "}
                      {toProc.avgCost}%)
                    </span>
                    <span
                      className={cn(
                        "font-mono",
                        simulation.netCostSavings >= 0
                          ? "text-primary"
                          : "text-destructive"
                      )}
                    >
                      {simulation.netCostSavings >= 0 ? "+" : ""}
                      {formatUsd(simulation.netCostSavings)}
                    </span>
                  </div>
                  {simulation.rateImprovement > 0 && (
                    <div className="flex justify-between">
                      <span>
                        Mejora en aprobación (+{simulation.rateImprovement}% ×{" "}
                        {formatUsd(simulation.volumeToMove)} × 1.8%)
                      </span>
                      <span className="font-mono text-primary">
                        +{formatUsd(simulation.additionalRevenue)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-card-foreground pt-1 border-t border-border/30">
                    <span>Total mensual</span>
                    <span
                      className={cn(
                        "font-mono",
                        simulation.totalMonthlyImpact >= 0
                          ? "text-primary"
                          : "text-destructive"
                      )}
                    >
                      {simulation.totalMonthlyImpact >= 0 ? "+" : ""}
                      {formatUsd(simulation.totalMonthlyImpact)}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 pt-1">
                    EBITDA anual proyectado:{" "}
                    {formatUsd(simulation.totalMonthlyImpact * 12)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isValid && (
            <div className="rounded-lg border border-border/50 bg-secondary/20 px-4 py-8 text-center">
              <Activity className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Selecciona origen, destino y porcentaje para ver el impacto
                proyectado.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 3 — Actions */}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleApply} disabled={!isValid}>
            Aplicar simulación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
