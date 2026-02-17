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
import { Fish, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { CLIENTS_DATA, TX_DATA, getMerchantHealth } from "@/lib/data/merchants"
import type { HealthLevel } from "@/lib/data/merchants"

// ─── Build top 10 whales by total_usd ────────────────────────────────────────

interface Whale {
  id: number
  name: string
  maskedId: string
  country: string
  totalUsd: number
  successRate: number
  daysSinceLastTx: number
  healthScore: number
  healthLevel: HealthLevel
}

const whales: Whale[] = Object.entries(TX_DATA)
  .map(([clientId, tx]) => {
    const client = CLIENTS_DATA.find((c) => c.id === Number(clientId))
    if (!client) return null
    const health = getMerchantHealth(client.id)
    return {
      id: client.id,
      name: client.name,
      maskedId: `MIG-****-${String(client.id).padStart(4, "0")}`,
      country: client.country,
      totalUsd: tx.total_usd,
      successRate: tx.success_rate,
      daysSinceLastTx: tx.days_since_last_tx,
      healthScore: health.score,
      healthLevel: health.level,
    }
  })
  .filter((w): w is Whale => w !== null)
  .sort((a, b) => b.totalUsd - a.totalUsd)
  .slice(0, 10)

function getHealthBadge(level: HealthLevel, score: number) {
  const config = {
    healthy: {
      className: "bg-primary/15 text-primary border-primary/30",
      label: "Healthy",
    },
    risk: {
      className: "bg-chart-3/15 text-chart-3 border-chart-3/30",
      label: "Risk",
    },
    critical: {
      className: "bg-destructive/15 text-destructive border-destructive/30",
      label: "Critical",
    },
  }[level]

  return (
    <Badge className={cn("border text-xs font-medium", config.className)}>
      {score} - {config.label}
    </Badge>
  )
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

export function WhaleWatch() {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Whale Watch</CardTitle>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[10px] gap-1">
            <Lock className="h-3 w-3" />
            Data Masked
          </Badge>
        </div>
        <CardDescription>
          Top 10 merchants by USD volume - IDs masked per PCI DSS minimum privilege
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Client ID</TableHead>
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Country</TableHead>
              <TableHead className="text-right text-muted-foreground">Volume USD</TableHead>
              <TableHead className="text-right text-muted-foreground">Success %</TableHead>
              <TableHead className="text-right text-muted-foreground">Last Tx</TableHead>
              <TableHead className="text-right text-muted-foreground">Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {whales.map((whale) => (
              <TableRow
                key={whale.id}
                className="border-border/30 hover:bg-secondary/60 transition-colors"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-muted-foreground/60" />
                    {whale.maskedId}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-card-foreground">
                  {whale.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                    {whale.country}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-card-foreground">
                  {formatUsd(whale.totalUsd)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-mono text-sm",
                      whale.successRate >= 70
                        ? "text-primary"
                        : whale.successRate >= 30
                          ? "text-chart-3"
                          : "text-destructive"
                    )}
                  >
                    {whale.successRate}%
                  </span>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {whale.daysSinceLastTx >= 999
                    ? "N/A"
                    : whale.daysSinceLastTx === 0
                      ? "Today"
                      : `${whale.daysSinceLastTx}d ago`}
                </TableCell>
                <TableCell className="text-right">
                  {getHealthBadge(whale.healthLevel, whale.healthScore)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
