import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Lock, Shield } from "lucide-react"

export function ComplianceFooter() {
  return (
    <footer className="border-t border-border bg-card/50 px-4 py-4 lg:px-6" role="contentinfo">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 text-primary text-[10px] gap-1 font-medium"
          >
            <ShieldCheck className="h-3 w-3" />
            PCI DSS Level 1 Certified
          </Badge>
          <Badge
            variant="outline"
            className="border-border bg-secondary/50 text-muted-foreground text-[10px] gap-1"
          >
            <Lock className="h-3 w-3" />
            AES-256 Encryption
          </Badge>
          <Badge
            variant="outline"
            className="border-border bg-secondary/50 text-muted-foreground text-[10px] gap-1"
          >
            <Shield className="h-3 w-3" />
            SSL/TLS Active
          </Badge>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Migo Gero v2.4.0 - Secure Payment Intelligence Platform
        </p>
      </div>
    </footer>
  )
}
