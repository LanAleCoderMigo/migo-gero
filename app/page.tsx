"use client"

import { useState, useCallback } from "react"
import { LoginScreen } from "@/components/dashboard/login-screen"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { SessionTimer } from "@/components/dashboard/session-timer"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { WhaleWatch } from "@/components/dashboard/whale-watch"
import { ProcessorHealth } from "@/components/dashboard/processor-health"
import { AiBrief } from "@/components/dashboard/ai-brief"
import { MerchantChat } from "@/components/dashboard/merchant-chat"
import { MerchantTable } from "@/components/dashboard/merchant-table"
import { OnboardingRadar } from "@/components/dashboard/onboarding-radar"
import { ComplianceFooter } from "@/components/dashboard/compliance-footer"
import { Bell, ShieldCheck } from "lucide-react"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSessionExpired = useCallback(() => {
    setIsAuthenticated(false)
  }, [])

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <SidebarNav />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Command Center
                </h1>
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Secure Payment Intelligence - Feb 16, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Session timer */}
            <SessionTimer
              initialMinutes={10}
              onSessionExpired={handleSessionExpired}
            />

            {/* Notifications */}
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                2
              </span>
            </button>

            {/* User avatar */}
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
              aria-label="User avatar"
            >
              AG
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-4 lg:p-6">
            {/* KPI Cards */}
            <section aria-label="Key performance indicators">
              <KpiCards />
            </section>

            {/* Whale Watch + AI Security Brief */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
              <section className="xl:col-span-3" aria-label="Whale Watch - Top merchants">
                <WhaleWatch />
              </section>
              <section className="xl:col-span-2" aria-label="AI Security Brief">
                <AiBrief />
              </section>
            </div>

            {/* Merchant Directory */}
            <section aria-label="Merchant directory with search and filters">
              <MerchantTable />
            </section>

            {/* Processor Health + Merchant Chat */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <section aria-label="Portfolio success rate">
                <ProcessorHealth />
              </section>
              <section aria-label="Merchant chat assistant">
                <MerchantChat />
              </section>
            </div>

            {/* Onboarding Radar */}
            <section aria-label="Onboarding radar - fraud prevention">
              <OnboardingRadar />
            </section>
          </div>
        </main>

        {/* Compliance Footer */}
        <ComplianceFooter />
      </div>
    </div>
  )
}
