"use client"

import { useState, useMemo, useCallback } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Store,
  Sparkles,
  Activity,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CLIENTS_DATA,
  TX_DATA,
  getMerchantHealth,
} from "@/lib/data/merchants"
import type { HealthLevel, ClientData, MerchantTxStats } from "@/lib/data/merchants"

// ─── Derived data ────────────────────────────────────────────────────────────

interface MerchantRow {
  client: ClientData
  tx: MerchantTxStats | null
  health: { score: number; level: HealthLevel; reasons: string[] }
}

const allRows: MerchantRow[] = CLIENTS_DATA.map((c) => ({
  client: c,
  tx: TX_DATA[String(c.id)] ?? null,
  health: getMerchantHealth(c.id),
}))

const countries = [...new Set(CLIENTS_DATA.map((c) => c.country))].sort()

const HEALTH_OPTIONS: { value: HealthLevel | "all"; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "healthy", label: "Healthy" },
  { value: "risk", label: "Risk" },
  { value: "critical", label: "Critical" },
]

const PAGE_SIZE = 15

// ─── Helpers ─────────────────────────────────────────────────────────────────

function healthBadge(level: HealthLevel, score: number) {
  const cfg = {
    healthy: "bg-primary/15 text-primary border-primary/30",
    risk: "bg-chart-3/15 text-chart-3 border-chart-3/30",
    critical: "bg-destructive/15 text-destructive border-destructive/30",
  }[level]
  return (
    <Badge className={cn("border text-xs font-medium capitalize", cfg)}>
      {score} · {level}
    </Badge>
  )
}

function formatUsd(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

// ─── Sheet detail panel ──────────────────────────────────────────────────────

function MerchantDetail({ row }: { row: MerchantRow }) {
  const [brief, setBrief] = useState("")
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefError, setBriefError] = useState<string | null>(null)

  const generateBrief = useCallback(async () => {
    setBrief("")
    setBriefError(null)
    setBriefLoading(true)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "brief",
          merchantId: String(row.client.id),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response stream")

      const decoder = new TextDecoder()
      let acc = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setBrief(acc)
      }
    } catch (err) {
      setBriefError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setBriefLoading(false)
    }
  }, [row.client.id])

  const { client: c, tx, health } = row

  return (
    <div className="flex flex-col gap-5 px-4 pb-4 overflow-y-auto">
      {/* Health banner */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-4 py-3",
          health.level === "healthy"
            ? "border-primary/30 bg-primary/5"
            : health.level === "risk"
              ? "border-chart-3/30 bg-chart-3/5"
              : "border-destructive/30 bg-destructive/5"
        )}
      >
        <div>
          <p className="text-xs text-muted-foreground">Health Score</p>
          <p className="text-2xl font-bold text-card-foreground">
            {health.score}
            <span className="text-sm font-normal text-muted-foreground">
              /100
            </span>
          </p>
        </div>
        {healthBadge(health.level, health.score)}
      </div>

      {/* Reasons */}
      {health.reasons.length > 0 && (
        <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
          {health.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">•</span>
              {r}
            </li>
          ))}
        </ul>
      )}

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "País", value: c.country },
          { label: "Counter", value: c.counter.toLocaleString() },
          { label: "Creado", value: c.createdAt.split(" ")[0] },
          { label: "Actualizado", value: c.updatedAt.split(" ")[0] },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-md border border-border/50 bg-secondary/40 px-3 py-2"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            <p className="text-sm font-semibold text-card-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* TX Stats */}
      {tx ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transacciones
          </p>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Activity}
              label="Total"
              value={tx.total_transactions.toLocaleString()}
            />
            <StatCard
              icon={CheckCircle2}
              label="Exitosas"
              value={tx.successful.toLocaleString()}
              className="text-primary"
            />
            <StatCard
              icon={XCircle}
              label="Fallidas"
              value={tx.failed.toLocaleString()}
              className="text-destructive"
            />
            <StatCard
              icon={Activity}
              label="Tasa de éxito"
              value={`${tx.success_rate}%`}
              className={
                tx.success_rate >= 70
                  ? "text-primary"
                  : tx.success_rate >= 30
                    ? "text-chart-3"
                    : "text-destructive"
              }
            />
            <StatCard
              icon={DollarSign}
              label="Volumen USD"
              value={formatUsd(tx.total_usd)}
            />
            <StatCard
              icon={DollarSign}
              label="Ticket promedio"
              value={`$${tx.avg_ticket_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            />
            <StatCard
              icon={Clock}
              label="Última tx"
              value={tx.last_transaction ?? "N/A"}
            />
            <StatCard
              icon={Clock}
              label="Días sin tx"
              value={tx.days_since_last_tx >= 999 ? "N/A" : String(tx.days_since_last_tx)}
            />
          </div>

          {/* Channels & payment types */}
          {tx.channels.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Radio className="h-3 w-3" />
                Canales
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tx.channels.map((ch) => (
                  <Badge
                    key={ch}
                    variant="outline"
                    className="text-xs border-border"
                  >
                    {ch}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {tx.payment_types.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CreditCard className="h-3 w-3" />
                Tipos de pago
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tx.payment_types.map((pt) => (
                  <Badge
                    key={pt}
                    variant="outline"
                    className="text-xs border-border"
                  >
                    {pt}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-md border border-border/50 bg-secondary/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Sin datos de transacciones en el período
        </div>
      )}

      {/* AI Brief section */}
      <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-secondary/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-card-foreground">
              AI Executive Brief
            </span>
          </div>
          <Button
            size="sm"
            variant={brief ? "outline" : "default"}
            onClick={generateBrief}
            disabled={briefLoading}
          >
            {briefLoading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generando...
              </>
            ) : brief ? (
              "Regenerar"
            ) : (
              "Generar Brief"
            )}
          </Button>
        </div>

        {briefError && (
          <p className="text-xs text-destructive">{briefError}</p>
        )}

        {briefLoading && !brief && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-[92%]" />
            <Skeleton className="h-3.5 w-[88%]" />
            <Skeleton className="h-3.5 w-[75%]" />
          </div>
        )}

        {brief && (
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {brief}
            {briefLoading && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/60 animate-pulse align-text-bottom" />
            )}
          </p>
        )}
      </div>
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

// ─── Main table component ────────────────────────────────────────────────────

export function MerchantTable() {
  const [search, setSearch] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [healthFilter, setHealthFilter] = useState<HealthLevel | "all">("all")
  const [page, setPage] = useState(0)
  const [selectedRow, setSelectedRow] = useState<MerchantRow | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Filter
  const filtered = useMemo(() => {
    let rows = allRows

    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.client.name.toLowerCase().includes(q) ||
          String(r.client.id).includes(q)
      )
    }

    if (countryFilter !== "all") {
      rows = rows.filter((r) => r.client.country === countryFilter)
    }

    if (healthFilter !== "all") {
      rows = rows.filter((r) => r.health.level === healthFilter)
    }

    return rows
  }, [search, countryFilter, healthFilter])

  // Reset page when filters change
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(totalPages - 1, 0))
  const pageRows = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  const handleRowClick = (row: MerchantRow) => {
    setSelectedRow(row)
    setSheetOpen(true)
  }

  return (
    <>
      <Card className="border-border/60 bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">
              Merchant Directory
            </CardTitle>
          </div>
          <CardDescription>
            {filtered.length} of {allRows.length} merchants — click a row for
            details
          </CardDescription>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(0)
                }}
                placeholder="Search by name or ID..."
                className="h-9 w-full rounded-lg border border-input bg-secondary pl-9 pr-3 text-sm text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Country filter */}
            <Select
              value={countryFilter}
              onValueChange={(v) => {
                setCountryFilter(v)
                setPage(0)
              }}
            >
              <SelectTrigger size="sm" className="w-[130px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Health filter */}
            <Select
              value={healthFilter}
              onValueChange={(v) => {
                setHealthFilter(v as HealthLevel | "all")
                setPage(0)
              }}
            >
              <SelectTrigger size="sm" className="w-[130px]">
                <SelectValue placeholder="Health" />
              </SelectTrigger>
              <SelectContent>
                {HEALTH_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[480px]">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Country</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Counter
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Success %
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Volume
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Last Tx
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Health
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No merchants match current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((row) => {
                    const { client: c, tx, health } = row
                    return (
                      <TableRow
                        key={c.id}
                        onClick={() => handleRowClick(row)}
                        className="border-border/30 cursor-pointer hover:bg-secondary/60 transition-colors"
                      >
                        <TableCell className="font-medium text-card-foreground max-w-[160px] truncate">
                          {c.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {c.id}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-border text-muted-foreground font-mono text-xs"
                          >
                            {c.country}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-card-foreground">
                          {c.counter.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {tx ? (
                            <span
                              className={cn(
                                "font-mono text-sm",
                                tx.success_rate >= 70
                                  ? "text-primary"
                                  : tx.success_rate >= 30
                                    ? "text-chart-3"
                                    : "text-destructive"
                              )}
                            >
                              {tx.success_rate}%
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono text-card-foreground">
                          {tx ? formatUsd(tx.total_usd) : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {tx
                            ? tx.days_since_last_tx >= 999
                              ? "N/A"
                              : `${tx.days_since_last_tx}d`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {healthBadge(health.level, health.score)}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-3">
              <p className="text-xs text-muted-foreground">
                Page {safePage + 1} of {totalPages}
              </p>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage === 0}
                  onClick={() => setPage(safePage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages - 1}
                  onClick={() => setPage(safePage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Detail Sheet ─────────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto"
        >
          {selectedRow && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedRow.client.name}
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground font-mono text-xs"
                  >
                    #{selectedRow.client.id}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  {selectedRow.client.country} · Created{" "}
                  {selectedRow.client.createdAt.split(" ")[0]}
                </SheetDescription>
              </SheetHeader>
              <MerchantDetail row={selectedRow} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
