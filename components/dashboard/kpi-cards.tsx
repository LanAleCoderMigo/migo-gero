import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, Zap, AlertTriangle, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { CLIENTS_DATA, TX_DATA, getMerchantHealth } from "@/lib/data/merchants"

// ─── Computed KPIs from real data ────────────────────────────────────────────

const totalMerchants = CLIENTS_DATA.length

const txEntries = Object.values(TX_DATA)
const activeMerchants = txEntries.filter((tx) => tx.days_since_last_tx < 30).length

const healthResults = CLIENTS_DATA.map((c) => getMerchantHealth(c.id))
const atRiskCount = healthResults.filter(
  (h) => h.level === "risk" || h.level === "critical"
).length
const criticalCount = healthResults.filter((h) => h.level === "critical").length

const totalVolumeUsd = txEntries.reduce((sum, tx) => sum + tx.total_usd, 0)

function formatVolume(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`
  return `$${usd.toFixed(0)}`
}

const kpis = [
  {
    title: "Total Merchants",
    value: totalMerchants.toLocaleString(),
    change: `${CLIENTS_DATA.filter((c) => c.onPlatform).length} on platform`,
    trend: "up" as const,
    icon: Users,
    description: "Registered across all countries",
  },
  {
    title: "Active Merchants",
    value: activeMerchants.toLocaleString(),
    change: `${((activeMerchants / Math.max(txEntries.length, 1)) * 100).toFixed(0)}% of tracked`,
    trend: activeMerchants > 5 ? ("up" as const) : ("down" as const),
    icon: Zap,
    description: "Transaction in last 30 days",
  },
  {
    title: "At Risk",
    value: atRiskCount.toLocaleString(),
    change: `${criticalCount} critical`,
    trend: "down" as const,
    icon: AlertTriangle,
    description: "Risk + critical health merchants",
  },
  {
    title: "Total Volume",
    value: formatVolume(totalVolumeUsd),
    change: `${txEntries.length} merchants w/ tx`,
    trend: "up" as const,
    icon: DollarSign,
    description: "USD across all merchants",
  },
]

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-border/60 bg-card">
          <CardContent className="pt-0">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold tracking-tight text-card-foreground">
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    kpi.title === "At Risk"
                      ? "bg-destructive/15 border border-destructive/25"
                      : "bg-primary/10"
                  )}
                >
                  <kpi.icon
                    className={cn(
                      "h-5 w-5",
                      kpi.title === "At Risk" ? "text-destructive" : "text-primary"
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    kpi.trend === "up" ? "text-primary" : "text-destructive"
                  )}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {kpi.change}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
