"use client"

import { useState, useMemo } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts"
import {
  Cpu,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Zap,
  Download,
  Grid3X3,
  DollarSign,
  ShieldAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { RoutingSimulator } from "@/components/dashboard/routing-simulator"
import {
  getProcessorPerformance,
  getProcessorsByType,
  getProcessorCostAnalysis,
} from "@/lib/data/processors"
import type {
  ProcessorPerformance,
  ProcessorType,
} from "@/lib/data/processors"
import { generateProcessorInsights } from "@/lib/data/insights-engine"
import type { Insight } from "@/lib/data/insights-engine"

// ─── Precomputed data ───────────────────────────────────────────────────────

const allProcessors = getProcessorPerformance()
const byType = getProcessorsByType()
const costAnalysis = getProcessorCostAnalysis()

const activeProcs = allProcessors.filter((p) => p.status === "active")
const unusedProcs = allProcessors.filter((p) => p.status === "unused")
const totalVolume = activeProcs.reduce((s, p) => s + p.totalVolume, 0)

const topProc = activeProcs.reduce((max, p) =>
  p.totalVolume > max.totalVolume ? p : max
)
const concentrationPct = totalVolume > 0
  ? (topProc.totalVolume / totalVolume) * 100
  : 0

// Chart data for active processors
const chartData = activeProcs
  .sort((a, b) => b.totalVolume - a.totalVolume)
  .map((p) => ({
    name: p.name.length > 12 ? p.name.slice(0, 11) + "..." : p.name,
    fullName: p.name,
    successRate: p.successRate,
    volume: p.totalVolume,
    cost: p.avgCost,
    merchants: p.merchantCount,
    transactions: p.totalTransactions,
  }))

// Tab config
type TabKey = "all" | ProcessorType | "unused"

interface TabConfig {
  key: TabKey
  label: string
  count: number
  volume: number
  avgRate: number
}

function buildTabs(): TabConfig[] {
  const tabs: TabConfig[] = [
    {
      key: "all",
      label: "Todos",
      count: allProcessors.length,
      volume: totalVolume,
      avgRate:
        activeProcs.length > 0
          ? activeProcs.reduce((s, p) => s + p.successRate, 0) / activeProcs.length
          : 0,
    },
  ]

  const typeLabels: Record<ProcessorType, string> = {
    card: "Cards",
    wallet: "Wallets",
    digital: "Digital",
    cash: "Cash",
    local: "Local",
    other: "Other",
  }

  for (const type of ["card", "wallet", "digital", "local", "cash", "other"] as ProcessorType[]) {
    const procs = byType[type]
    if (procs.length === 0) continue
    const active = procs.filter((p) => p.status === "active")
    tabs.push({
      key: type,
      label: typeLabels[type],
      count: procs.length,
      volume: active.reduce((s, p) => s + p.totalVolume, 0),
      avgRate:
        active.length > 0
          ? active.reduce((s, p) => s + p.successRate, 0) / active.length
          : 0,
    })
  }

  tabs.push({
    key: "unused",
    label: "Sin uso",
    count: unusedProcs.length,
    volume: 0,
    avgRate: 0,
  })

  return tabs
}

const tabs = buildTabs()

// ─── Insights (from engine) ────────────────────────────────────────────────

const engineInsights = generateProcessorInsights()

const INSIGHT_ICON: Record<Insight['type'], typeof AlertTriangle> = {
  risk: AlertTriangle,
  opportunity: Lightbulb,
  optimization: TrendingUp,
}

const INSIGHT_BORDER: Record<Insight['type'], string> = {
  risk: "border-chart-3/30 bg-chart-3/5",
  opportunity: "border-primary/30 bg-primary/5",
  optimization: "border-border/50 bg-secondary/30",
}

const INSIGHT_ICON_COLOR: Record<Insight['type'], string> = {
  risk: "text-chart-3",
  opportunity: "text-primary",
  optimization: "text-muted-foreground",
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatUsd(v: number): string {
  if (v === 0) return "---"
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v.toFixed(0)}`
}

function rateColor(rate: number): string {
  if (rate >= 85) return "text-primary"
  if (rate >= 70) return "text-chart-3"
  if (rate > 0) return "text-destructive"
  return "text-muted-foreground/40"
}

const TYPE_BADGE: Record<ProcessorType, string> = {
  card: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  wallet: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  digital: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  cash: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  local: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
}

function handleExportCsv() {
  const header = "ID,Name,Type,Region,Status,Volume,Transactions,SuccessRate,Cost,Merchants"
  const rows = allProcessors.map(
    (p) =>
      `${p.id},${p.name},${p.type},${p.region},${p.status},${p.totalVolume},${p.totalTransactions},${p.successRate},${p.avgCost},${p.merchantCount}`
  )
  const csv = [header, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "processor-report.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Custom tooltip ─────────────────────────────────────────────────────────

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-card-foreground">{d.fullName}</p>
      <p className="text-muted-foreground">Volumen: <span className="font-mono text-card-foreground">{formatUsd(d.volume)}</span></p>
      <p className="text-muted-foreground">Tasa: <span className={cn("font-mono", rateColor(d.successRate))}>{d.successRate}%</span></p>
      <p className="text-muted-foreground">Costo: <span className="font-mono text-card-foreground">{d.cost}%</span></p>
      <p className="text-muted-foreground">Tx: <span className="font-mono text-card-foreground">{d.transactions.toLocaleString()}</span></p>
      <p className="text-muted-foreground">Merchants: <span className="font-mono text-card-foreground">{d.merchants}</span></p>
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ProcessingOptimization() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [simulatorOpen, setSimulatorOpen] = useState(false)

  const tabProcessors = useMemo((): ProcessorPerformance[] => {
    if (activeTab === "all") return allProcessors
    if (activeTab === "unused") return unusedProcs
    return byType[activeTab as ProcessorType] ?? []
  }, [activeTab])

  const currentTabConfig = tabs.find((t) => t.key === activeTab)

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* SECTION 1 — Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Processors */}
          <Card className="border-border/60 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Procesadores</p>
                  <p className="text-3xl font-bold text-card-foreground">{allProcessors.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeProcs.length} activos, {unusedProcs.length} sin uso
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Concentration Risk */}
          <Card className="border-border/60 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Riesgo de Concentración</p>
                  <p className={cn(
                    "text-3xl font-bold",
                    concentrationPct > 50
                      ? "text-destructive"
                      : concentrationPct > 30
                        ? "text-chart-3"
                        : "text-primary"
                  )}>
                    {concentrationPct.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Volumen en {topProc.name}
                  </p>
                </div>
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  concentrationPct > 50 ? "bg-destructive/10" : "bg-chart-3/10"
                )}>
                  <ShieldAlert className={cn(
                    "h-5 w-5",
                    concentrationPct > 50 ? "text-destructive" : "text-chart-3"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Annual Processing Cost */}
          <Card className="border-border/60 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Costo Anual de Procesamiento</p>
                  <p className="text-3xl font-bold text-card-foreground">
                    ${costAnalysis.totalAnnualCost.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basado en volumen x costo promedio
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                  <DollarSign className="h-5 w-5 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights from engine */}
        {engineInsights.length > 0 && (
          <div className="flex flex-col gap-2">
            {engineInsights.slice(0, 4).map((ins) => {
              const Icon = INSIGHT_ICON[ins.type]
              return (
                <div
                  key={ins.id}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-4 py-3",
                    INSIGHT_BORDER[ins.type]
                  )}
                >
                  <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", INSIGHT_ICON_COLOR[ins.type])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-card-foreground">{ins.title}</span>
                      {" — "}
                      {ins.description}
                    </p>
                    {ins.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {ins.actions.map((action, i) => (
                          <span
                            key={i}
                            className="inline-block rounded bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {ins.ebitdaImpact !== 0 && (
                    <span className={cn(
                      "text-xs font-mono font-semibold whitespace-nowrap",
                      ins.type === 'risk' ? "text-destructive" : "text-primary"
                    )}>
                      {ins.ebitdaImpact > 0 ? '+' : ''}{ins.ebitdaImpact >= 1000 || ins.ebitdaImpact <= -1000
                        ? `$${(ins.ebitdaImpact / 1000).toFixed(1)}K`
                        : `$${ins.ebitdaImpact.toFixed(0)}`}/mo
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* SECTION 2 — Active Processors Chart */}
        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Rendimiento de Procesadores Activos
            </CardTitle>
            <CardDescription>
              Success rate y volumen de los {activeProcs.length} procesadores con transacciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.5 0 0 / 0.15)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "oklch(0.55 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="rate"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "oklch(0.55 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "oklch(0.55 0 0)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                      v >= 1_000_000
                        ? `$${(v / 1_000_000).toFixed(1)}M`
                        : `$${(v / 1_000).toFixed(0)}K`
                    }
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    yAxisId="rate"
                    dataKey="successRate"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                    fill="oklch(0.72 0.17 160 / 0.7)"
                    name="Success Rate"
                  />
                  <Line
                    yAxisId="volume"
                    dataKey="volume"
                    type="monotone"
                    stroke="oklch(0.7 0.15 250)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "oklch(0.7 0.15 250)" }}
                    name="Volume"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "oklch(0.72 0.17 160 / 0.7)" }} />
                Success Rate (%)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: "oklch(0.7 0.15 250)" }} />
                Volumen (USD)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3 — Processor Groups (Tabs) */}
        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Procesadores por Categoría
            </CardTitle>
            <CardDescription>
              {currentTabConfig
                ? `${currentTabConfig.count} procesadores · ${formatUsd(currentTabConfig.volume)} volumen${currentTabConfig.avgRate > 0 ? ` · ${currentTabConfig.avgRate.toFixed(0)}% rate promedio` : ""}`
                : ""}
            </CardDescription>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 pt-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-card-foreground hover:bg-secondary"
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Procesador</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Región</TableHead>
                    <TableHead className="text-right text-muted-foreground">Volumen</TableHead>
                    <TableHead className="text-right text-muted-foreground">Rate</TableHead>
                    <TableHead className="text-right text-muted-foreground">Costo</TableHead>
                    <TableHead className="text-right text-muted-foreground">Integrado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabProcessors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-20 text-center text-muted-foreground">
                        No hay procesadores en esta categoría
                      </TableCell>
                    </TableRow>
                  ) : (
                    tabProcessors.map((p) => (
                      <TableRow key={p.id} className="border-border/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full shrink-0",
                                p.status === "active"
                                  ? "bg-primary"
                                  : "bg-muted-foreground/40"
                              )}
                            />
                            <div>
                              <p className="font-medium text-card-foreground text-sm">{p.name}</p>
                              <p className="text-[10px] text-muted-foreground/60 font-mono">ID: {p.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border text-[10px] capitalize", TYPE_BADGE[p.type])}>
                            {p.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground capitalize">
                          {p.region}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-card-foreground">
                          {p.totalVolume > 0 ? formatUsd(p.totalVolume) : <span className="text-muted-foreground/40">---</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          {p.status === "active" ? (
                            <span className={cn("font-mono text-sm", rateColor(p.successRate))}>
                              {p.successRate}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">---</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-card-foreground">
                          {p.status === "active" ? `${p.avgCost}%` : <span className="text-muted-foreground/40">---</span>}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {p.createdAt}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* SECTION 4 — Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" onClick={() => {
            const el = document.getElementById("processor-health-matrix")
            if (el) el.scrollIntoView({ behavior: "smooth" })
          }}>
            <Grid3X3 className="h-4 w-4" />
            Ver Full Matrix
          </Button>
          <Button className="gap-2" onClick={() => setSimulatorOpen(true)}>
            <Zap className="h-4 w-4" />
            Simular Routing
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportCsv}>
            <Download className="h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      <RoutingSimulator open={simulatorOpen} onOpenChange={setSimulatorOpen} />
    </>
  )
}
