import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Radar, Clock, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const newMerchants = [
  {
    name: "sugoiGT",
    id: 445,
    maskedId: "MIG-****-0445",
    createdAt: "2026-01-12",
    status: "pending" as const,
    country: "GT",
    daysActive: 35,
    riskLevel: "low" as const,
  },
  {
    name: "stereoPubCR",
    id: 448,
    maskedId: "MIG-****-0448",
    createdAt: "2026-01-18",
    status: "active" as const,
    country: "CR",
    daysActive: 29,
    riskLevel: "low" as const,
  },
  {
    name: "farmaciasHN",
    id: 452,
    maskedId: "MIG-****-0452",
    createdAt: "2026-01-25",
    status: "pending" as const,
    country: "HN",
    daysActive: 22,
    riskLevel: "medium" as const,
  },
  {
    name: "techStoreSV",
    id: 460,
    maskedId: "MIG-****-0460",
    createdAt: "2026-02-03",
    status: "inactive" as const,
    country: "SV",
    daysActive: 13,
    riskLevel: "high" as const,
  },
]

function getStatusConfig(status: "pending" | "active" | "inactive") {
  switch (status) {
    case "active":
      return {
        icon: CheckCircle2,
        className: "bg-primary/15 text-primary border-primary/30",
        label: "Activated",
      }
    case "pending":
      return {
        icon: Clock,
        className: "bg-chart-3/15 text-chart-3 border-chart-3/30",
        label: "Pending",
      }
    case "inactive":
      return {
        icon: AlertCircle,
        className: "bg-destructive/15 text-destructive border-destructive/30",
        label: "Inactive",
      }
  }
}

function getRiskBadge(level: "low" | "medium" | "high") {
  switch (level) {
    case "low":
      return (
        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[10px]">
          Low Risk
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="border-chart-3/30 bg-chart-3/5 text-chart-3 text-[10px]">
          Med Risk
        </Badge>
      )
    case "high":
      return (
        <Badge variant="outline" className="border-destructive/30 bg-destructive/5 text-destructive text-[10px]">
          High Risk
        </Badge>
      )
  }
}

export function OnboardingRadar() {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Onboarding Radar</CardTitle>
          </div>
          <Badge variant="outline" className="border-chart-3/30 bg-chart-3/5 text-chart-3 text-[10px] gap-1">
            <ShieldAlert className="h-3 w-3" />
            Fraud Screening Active
          </Badge>
        </div>
        <CardDescription>
          New 2026 merchants - onboarding tracking with fraud prevention scoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {newMerchants.map((merchant) => {
            const statusConfig = getStatusConfig(merchant.status)
            const StatusIcon = statusConfig.icon
            return (
              <div
                key={merchant.id}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/30 px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <StatusIcon
                    className={cn(
                      "h-4 w-4",
                      merchant.status === "active"
                        ? "text-primary"
                        : merchant.status === "pending"
                          ? "text-chart-3"
                          : "text-destructive"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {merchant.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {merchant.maskedId} - {merchant.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">
                      {merchant.daysActive}d since creation
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {merchant.createdAt}
                    </p>
                  </div>
                  {getRiskBadge(merchant.riskLevel)}
                  <Badge
                    className={cn(
                      "border text-xs",
                      statusConfig.className
                    )}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
