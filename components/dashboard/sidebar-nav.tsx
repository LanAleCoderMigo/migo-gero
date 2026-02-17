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
  Settings,
  ChevronLeft,
  ChevronRight,
  FileWarning,
  Clock,
} from "lucide-react"

const mainNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { label: "Whale Watch", icon: Fish, href: "#whale-watch" },
  { label: "Processor Integrity", icon: HeartPulse, href: "#processor-integrity" },
  { label: "AI Security Brief", icon: BrainCircuit, href: "#ai-brief" },
  { label: "Onboarding Radar", icon: Radar, href: "#onboarding-radar" },
]

const securityNavItems = [
  { label: "Security Audit", icon: ShieldAlert, href: "#security-audit" },
  { label: "Incident Logs", icon: FileWarning, href: "#incident-logs" },
]

const auditEntries = [
  { user: "admin@migo.dev", action: "Viewed Whale Watch", time: "08:42 UTC" },
  { user: "ops@migo.dev", action: "Exported processor report", time: "08:15 UTC" },
  { user: "admin@migo.dev", action: "Accessed audit logs", time: "07:58 UTC" },
]

export function SidebarNav() {
  const [active, setActive] = useState("Dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [showAudit, setShowAudit] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          MG
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Migo Gero
          </span>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 px-2 py-4" role="navigation" aria-label="Main navigation">
        {!collapsed && (
          <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Operations
          </span>
        )}
        {mainNavItems.map((item) => {
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Security Section */}
      <nav className="flex flex-col gap-1 px-2 pb-4" role="navigation" aria-label="Security navigation">
        {!collapsed && (
          <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Security
          </span>
        )}
        {securityNavItems.map((item) => {
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.label)
                if (item.label === "Security Audit") setShowAudit(!showAudit)
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}

        {/* Inline Audit Log preview */}
        {showAudit && !collapsed && (
          <div className="mx-2 mt-2 flex flex-col gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Recent Activity
            </span>
            {auditEntries.map((entry, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-xs text-sidebar-foreground truncate">
                  {entry.action}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {entry.user} - {entry.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="flex-1" />

      {/* Settings */}
      <div className="flex flex-col gap-1 px-2 pb-2">
        <button
          onClick={() => setActive("Settings")}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            active === "Settings"
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
