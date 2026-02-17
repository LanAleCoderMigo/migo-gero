"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Fish,
  HeartPulse,
  BrainCircuit,
  Radar,
  ShieldAlert,
  FileWarning,
  Settings,
  Menu,
  X,
  Shield,
} from "lucide-react"

const mainNavItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Whale Watch", icon: Fish },
  { label: "Processor Integrity", icon: HeartPulse },
  { label: "AI Security Brief", icon: BrainCircuit },
  { label: "Onboarding Radar", icon: Radar },
]

const securityNavItems = [
  { label: "Security Audit", icon: ShieldAlert },
  { label: "Incident Logs", icon: FileWarning },
]

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("Dashboard")

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              MG
            </div>
            <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
              Migo Gero
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-2 py-4" role="navigation" aria-label="Main navigation">
          <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Operations
          </span>
          {mainNavItems.map((item) => {
            const isActive = active === item.label
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActive(item.label)
                  setOpen(false)
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}

          <span className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Security
          </span>
          {securityNavItems.map((item) => {
            const isActive = active === item.label
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActive(item.label)
                  setOpen(false)
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Security badge */}
        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-primary font-medium">PCI DSS L1 Active</span>
          </div>
        </div>
      </div>
    </>
  )
}
