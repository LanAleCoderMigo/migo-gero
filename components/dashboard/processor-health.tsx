"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeartPulse } from "lucide-react"
import { cn } from "@/lib/utils"
import { TX_DATA } from "@/lib/data/merchants"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

// ─── Build success rate distribution buckets ─────────────────────────────────

interface Bucket {
  range: string
  count: number
  color: string
  status: "critical" | "warning" | "healthy"
}

function buildDistribution(): Bucket[] {
  const buckets: Bucket[] = [
    { range: "0%", count: 0, color: "oklch(0.60 0.20 25)", status: "critical" },
    { range: "1–30%", count: 0, color: "oklch(0.65 0.18 30)", status: "critical" },
    { range: "30–50%", count: 0, color: "oklch(0.75 0.15 80)", status: "warning" },
    { range: "50–70%", count: 0, color: "oklch(0.75 0.14 85)", status: "warning" },
    { range: "70–90%", count: 0, color: "oklch(0.70 0.16 150)", status: "healthy" },
    { range: "90–100%", count: 0, color: "oklch(0.72 0.17 160)", status: "healthy" },
  ]

  for (const tx of Object.values(TX_DATA)) {
    const r = tx.success_rate
    if (r === 0) buckets[0].count++
    else if (r < 30) buckets[1].count++
    else if (r < 50) buckets[2].count++
    else if (r < 70) buckets[3].count++
    else if (r < 90) buckets[4].count++
    else buckets[5].count++
  }

  return buckets
}

const distribution = buildDistribution()

const totalWithTx = Object.keys(TX_DATA).length
const avgRate =
  totalWithTx > 0
    ? (
        Object.values(TX_DATA).reduce((s, tx) => s + tx.success_rate, 0) /
        totalWithTx
      ).toFixed(1)
    : "0"

const criticalPct = (
  ((distribution[0].count + distribution[1].count) / Math.max(totalWithTx, 1)) *
  100
).toFixed(0)

function getStatusConfig(status: "healthy" | "warning" | "critical") {
  switch (status) {
    case "healthy":
      return { className: "bg-primary/15 text-primary border-primary/30", label: "Healthy" }
    case "warning":
      return { className: "bg-chart-3/15 text-chart-3 border-chart-3/30", label: "Warning" }
    case "critical":
      return { className: "bg-destructive/15 text-destructive border-destructive/30", label: "Critical" }
  }
}

export function ProcessorHealth() {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          <CardTitle className="text-card-foreground">Portfolio Success Rate</CardTitle>
        </div>
        <CardDescription>
          Success rate distribution across {totalWithTx} merchants with transaction data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "Avg Success Rate",
              value: `${avgRate}%`,
              status: Number(avgRate) >= 70 ? "healthy" as const : Number(avgRate) >= 30 ? "warning" as const : "critical" as const,
            },
            {
              label: "Critical (<30%)",
              value: `${distribution[0].count + distribution[1].count}`,
              status: "critical" as const,
            },
            {
              label: "Healthy (>70%)",
              value: `${distribution[4].count + distribution[5].count}`,
              status: "healthy" as const,
            },
          ].map((item) => {
            const cfg = getStatusConfig(item.status)
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/40 px-4 py-3"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-lg font-bold text-card-foreground">{item.value}</span>
                </div>
                <Badge className={cn("border text-xs", cfg.className)}>{cfg.label}</Badge>
              </div>
            )
          })}
        </div>

        {/* Bar chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.5 0 0 / 0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 12, fill: "oklch(0.55 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "oklch(0.55 0 0)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.2 0 0)",
                  border: "1px solid oklch(0.3 0 0)",
                  borderRadius: "8px",
                  color: "oklch(0.9 0 0)",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value} merchants`, "Count"]}
                labelFormatter={(label: string) => `Success rate: ${label}`}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {distribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer note */}
        <p className="mt-3 text-xs text-muted-foreground text-center">
          {criticalPct}% of merchants have a success rate below 30% — consider review
        </p>
      </CardContent>
    </Card>
  )
}
