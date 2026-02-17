"use client"

import { useState, useMemo } from "react"
import { RoutingSimulator } from "@/components/dashboard/routing-simulator"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Cpu,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Activity,
  Users,
  Globe,
  Calendar,
  TrendingUp,
  ArrowUpDown,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getProcessorPerformance,
  getProcessorCostAnalysis,
} from "@/lib/data/processors"
import type {
  ProcessorPerformance,
  ProcessorStatus,
  ProcessorType,
} from "@/lib/data/processors"
import { generateProcessorInsights } from "@/lib/data/insights-engine"

// ─── Precomputed data ───────────────────────────────────────────────────────

const allProcessors = getProcessorPerformance()
const costAnalysis = getProcessorCostAnalysis()

const activeCount = allProcessors.filter((p) => p.status === "active").length
const unusedCount = allProcessors.filter((p) => p.status === "unused").length
const totalVolume = allProcessors.reduce((s, p) => s + p.totalVolume, 0)

// ─── Insights (from engine) ─────────────────────────────────────────────────

const engineInsights = generateProcessorInsights()

const INSIGHT_ICON_MAP: Record<string, typeof AlertTriangle> = {
  risk: AlertTriangle,
  opportunity: Lightbulb,
  optimization: DollarSign,
}

const INSIGHT_COLOR_MAP: Record<string, string> = {
  risk: "text-chart-3",
  opportunity: "text-primary",
  optimization: "text-chart-3",
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_TABS: { value: ProcessorStatus | "all"; label: string }[] = [
  { value: "all", label: `Todos (${allProcessors.length})` },
  { value: "active", label: `Activos (${activeCount})` },
  { value: "unused", label: `Sin uso (${unusedCount})` },
]

type SortKey = "volume" | "rate" | "cost" | "transactions"

const TYPE_BADGE_STYLES: Record<ProcessorType, string> = {
  card: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  wallet: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  digital: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  cash: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  local: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
}

function statusDot(status: ProcessorStatus) {
  const color = {
    active: "bg-primary",
    "low-volume": "bg-chart-3",
    unused: "bg-muted-foreground/40",
  }[status]
  return <span className={cn("inline-block h-2 w-2 rounded-full shrink-0", color)} />
}

function formatUsd(v: number): string {
  if (v === 0) return "---"
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v.toFixed(0)}`
}

function rateColor(rate: number, hasVolume: boolean): string {
  if (!hasVolume) return "text-muted-foreground/40"
  if (rate >= 85) return "text-primary"
  if (rate >= 70) return "text-chart-3"
  return "text-destructive"
}

// ─── Simulated monthly trend (6 months) ─────────────────────────────────────

function getMonthlyTrend(p: ProcessorPerformance) {
  if (p.status === "unused") return []
  const base = p.totalVolume / 6
  const months = ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb"]
  const factors = [0.82, 0.88, 0.95, 1.05, 1.1, 1.2]
  return months.map((m, i) => ({
    month: m,
    volume: Math.round(base * factors[i]),
    rate: Math.min(99, Math.max(60, p.successRate + (i - 3) * 1.2)),
  }))
}

// ─── Sheet detail ───────────────────────────────────────────────────────────

function ProcessorDetail({ proc }: { proc: ProcessorPerformance }) {
  const trend = getMonthlyTrend(proc)
  const maxVol = Math.max(...trend.map((t) => t.volume), 1)

  return (
    <div className="flex flex-col gap-5 px-4 pb-4 overflow-y-auto">
      {/* Type + region badges */}
      <div className="flex items-center gap-2">
        <Badge className={cn("border text-xs capitalize", TYPE_BADGE_STYLES[proc.type])}>
          {proc.type}
        </Badge>
        <Badge variant="outline" className="text-xs capitalize border-border text-muted-foreground">
          {proc.region}
        </Badge>
        <Badge
          className={cn(
            "border text-xs capitalize",
            proc.status === "active"
              ? "bg-primary/15 text-primary border-primary/30"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          {proc.status}
        </Badge>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={DollarSign} label="Volumen" value={formatUsd(proc.totalVolume)} />
        <StatCard icon={Activity} label="Transacciones" value={proc.totalTransactions > 0 ? proc.totalTransactions.toLocaleString() : "---"} />
        <StatCard
          icon={TrendingUp}
          label="Tasa de éxito"
          value={proc.status === "active" ? `${proc.successRate}%` : "---"}
          className={rateColor(proc.successRate, proc.status === "active")}
        />
        <StatCard
          icon={DollarSign}
          label="Costo por tx"
          value={proc.status === "active" ? `${proc.avgCost}%` : "---"}
        />
        <StatCard icon={Users} label="Merchants" value={proc.merchantCount > 0 ? String(proc.merchantCount) : "---"} />
        <StatCard icon={Calendar} label="Integrado" value={proc.createdAt} />
      </div>

      {/* Countries */}
      {proc.countries.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            Países
          </div>
          <div className="flex flex-wrap gap-1.5">
            {proc.countries.map((c) => (
              <Badge key={c} variant="outline" className="text-xs border-border">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Monthly trend (bar chart) */}
      {trend.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tendencia mensual (6 meses)
          </p>
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
            <div className="flex items-end gap-2 h-24">
              {trend.map((t) => (
                <div key={t.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatUsd(t.volume)}
                  </span>
                  <div
                    className="w-full rounded-t bg-primary/60"
                    style={{ height: `${(t.volume / maxVol) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{t.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-end gap-2 h-16">
              {trend.map((t) => (
                <div key={t.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className={cn("text-[10px] font-mono", rateColor(t.rate, true))}>
                    {t.rate.toFixed(0)}%
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t",
                      t.rate >= 85
                        ? "bg-primary/40"
                        : t.rate >= 70
                          ? "bg-chart-3/40"
                          : "bg-destructive/40"
                    )}
                    style={{ height: `${((t.rate - 50) / 50) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-muted-foreground">Rate</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cost impact */}
      {proc.status === "active" && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Impacto financiero
          </p>
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Costo anual estimado</span>
              <span className="font-semibold text-card-foreground">
                ${(proc.totalVolume * (proc.avgCost / 100)).toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">% del volumen total</span>
              <span className="font-semibold text-card-foreground">
                {((proc.totalVolume / totalVolume) * 100).toFixed(1)}%
              </span>
            </div>
            {proc.avgCost > 3.0 && (
              <p className="text-xs text-chart-3 mt-1">
                Costo superior al promedio. Evaluar redireccionamiento a procesador con menor comisión.
              </p>
            )}
            {proc.successRate < 85 && proc.successRate > 0 && (
              <p className="text-xs text-chart-3 mt-1">
                Tasa {proc.successRate}% bajo benchmark de 85%. Potencial de mejora: +${(
                  proc.totalVolume * ((85 - proc.successRate) / 100) * 0.018
                ).toLocaleString("en-US", { minimumFractionDigits: 0 })} en comisiones recuperadas.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Unused processor note */}
      {proc.status === "unused" && (
        <div className="rounded-lg border border-border/50 bg-secondary/20 px-4 py-5 text-center">
          <p className="text-sm text-muted-foreground">
            Procesador integrado sin transacciones registradas.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Evaluar activación o deprecación para reducir overhead operativo.
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-border/50 bg-secondary/40 px-3 py-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
          {label}
        </p>
        <p className={cn("text-sm font-semibold text-card-foreground", className)}>
          {value}
        </p>
      </div>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export function ProcessorHealthMatrix() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProcessorStatus | "all">("all")
  const [sortKey, setSortKey] = useState<SortKey>("volume")
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedProc, setSelectedProc] = useState<ProcessorPerformance | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [simulatorOpen, setSimulatorOpen] = useState(false)

  const filtered = useMemo(() => {
    let rows = allProcessors

    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.includes(q) ||
          String(p.id).includes(q)
      )
    }

    if (statusFilter !== "all") {
      rows = rows.filter((p) => p.status === statusFilter)
    }

    const dir = sortAsc ? 1 : -1
    rows = [...rows].sort((a, b) => {
      switch (sortKey) {
        case "volume":
          return (a.totalVolume - b.totalVolume) * dir
        case "rate":
          return (a.successRate - b.successRate) * dir
        case "cost":
          return (a.avgCost - b.avgCost) * dir
        case "transactions":
          return (a.totalTransactions - b.totalTransactions) * dir
        default:
          return 0
      }
    })

    return rows
  }, [search, statusFilter, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const sortIcon = (key: SortKey) =>
    sortKey === key ? (
      <ArrowUpDown className="h-3 w-3 text-primary" />
    ) : (
      <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />
    )

  return (
    <>
      <Card className="border-border/60 bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <CardTitle className="text-card-foreground">
                Processor Health Matrix
              </CardTitle>
            </div>
            <Button
              size="sm"
              onClick={() => setSimulatorOpen(true)}
              className="gap-1.5"
            >
              <Zap className="h-3.5 w-3.5" />
              Simular Routing
            </Button>
          </div>
          <CardDescription>
            {allProcessors.length} procesadores configurados, {activeCount} activos
            {" "}· Volumen total: {formatUsd(totalVolume)}
          </CardDescription>

          {/* Insights */}
          {engineInsights.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2">
              {engineInsights.slice(0, 3).map((ins) => {
                const Icon = INSIGHT_ICON_MAP[ins.type] ?? AlertTriangle
                const color = INSIGHT_COLOR_MAP[ins.type] ?? "text-muted-foreground"
                return (
                  <div key={ins.id} className="flex items-start gap-2 rounded-md bg-secondary/40 px-3 py-2">
                    <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", color)} />
                    <span className="text-xs text-muted-foreground">
                      <span className="font-medium text-card-foreground">{ins.title}:</span>{" "}
                      {ins.description}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Status tabs */}
            <div className="flex gap-1 rounded-lg bg-secondary/60 p-0.5">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    statusFilter === tab.value
                      ? "bg-card text-card-foreground shadow-sm"
                      : "text-muted-foreground hover:text-card-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar procesador..."
                className="h-9 w-full rounded-lg border border-input bg-secondary pl-9 pr-3 text-sm text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[520px]">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-8 text-muted-foreground" />
                  <TableHead className="text-muted-foreground">Procesador</TableHead>
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => handleSort("volume")}
                      className="inline-flex items-center gap-1 hover:text-card-foreground transition-colors"
                    >
                      Volumen {sortIcon("volume")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => handleSort("transactions")}
                      className="inline-flex items-center gap-1 hover:text-card-foreground transition-colors"
                    >
                      Tx {sortIcon("transactions")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => handleSort("rate")}
                      className="inline-flex items-center gap-1 hover:text-card-foreground transition-colors"
                    >
                      Rate {sortIcon("rate")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => handleSort("cost")}
                      className="inline-flex items-center gap-1 hover:text-card-foreground transition-colors"
                    >
                      Costo {sortIcon("cost")}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">Merchants</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No se encontraron procesadores
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((proc) => (
                    <TableRow
                      key={proc.id}
                      onClick={() => {
                        setSelectedProc(proc)
                        setSheetOpen(true)
                      }}
                      className="border-border/30 cursor-pointer hover:bg-secondary/60 transition-colors"
                    >
                      <TableCell className="w-8">
                        {statusDot(proc.status)}
                      </TableCell>
                      <TableCell className="font-medium text-card-foreground">
                        <div className="flex flex-col">
                          <span>{proc.name}</span>
                          <span className="text-[10px] text-muted-foreground/60 font-mono">
                            ID: {proc.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "border text-[10px] capitalize",
                            TYPE_BADGE_STYLES[proc.type]
                          )}
                        >
                          {proc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-card-foreground">
                        {proc.totalVolume > 0 ? (
                          formatUsd(proc.totalVolume)
                        ) : (
                          <span className="text-muted-foreground/40">---</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-card-foreground">
                        {proc.totalTransactions > 0 ? (
                          proc.totalTransactions.toLocaleString()
                        ) : (
                          <span className="text-muted-foreground/40">---</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {proc.status === "active" ? (
                          <span
                            className={cn(
                              "font-mono text-sm",
                              rateColor(proc.successRate, true)
                            )}
                          >
                            {proc.successRate}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">---</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {proc.status === "active" ? (
                          <span className="font-mono text-sm text-card-foreground">
                            {proc.avgCost}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">---</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-card-foreground">
                        {proc.merchantCount > 0 ? (
                          proc.merchantCount
                        ) : (
                          <span className="text-muted-foreground/40">---</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Summary bar */}
          <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-3">
            <p className="text-xs text-muted-foreground">
              {filtered.length} de {allProcessors.length} procesadores
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {statusDot("active")} Activo
              </span>
              <span className="flex items-center gap-1.5">
                {statusDot("unused")} Sin uso
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedProc && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedProc.name}
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground font-mono text-xs"
                  >
                    #{selectedProc.id}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  Integrado: {selectedProc.createdAt} · Región: {selectedProc.region}
                </SheetDescription>
              </SheetHeader>
              <ProcessorDetail proc={selectedProc} />
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Routing Simulator */}
      <RoutingSimulator open={simulatorOpen} onOpenChange={setSimulatorOpen} />
    </>
  )
}
