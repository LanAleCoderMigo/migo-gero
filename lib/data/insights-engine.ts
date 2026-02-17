import {
  getProcessorPerformance,
  getProcessorCostAnalysis,
  simulateRouting,
} from '@/lib/data/processors'
import { CLIENTS_DATA, TX_DATA, getMerchantHealth } from '@/lib/data/merchants'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Insight {
  id: string
  title: string
  description: string
  type: 'risk' | 'opportunity' | 'optimization'
  priority: 'high' | 'medium' | 'low'
  ebitdaImpact: number // USD monthly
  category: 'processor' | 'merchant' | 'geographic' | 'operational'
  actions: string[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatUsd(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

// ─── Insight generators ─────────────────────────────────────────────────────

function detectConcentrationRisk(): Insight | null {
  const all = getProcessorPerformance()
  const active = all.filter((p) => p.status === 'active')
  const totalVolume = active.reduce((s, p) => s + p.totalVolume, 0)
  if (totalVolume === 0) return null

  const sorted = [...active].sort((a, b) => b.totalVolume - a.totalVolume)
  const top = sorted[0]
  const pct = (top.totalVolume / totalVolume) * 100

  if (pct <= 35) return null

  // Monthly revenue at risk if top processor goes down
  const monthlyRevenueAtRisk = (top.totalVolume * 0.018) / 12

  const isHigh = pct > 50

  // Find best backup processor
  const backup = sorted.find(
    (p) => p.id !== top.id && p.successRate >= 85
  )
  const backupAction = backup
    ? `Distribuir 30% a ${backup.name} (${backup.successRate}% rate)`
    : 'Activar procesador backup con rate >= 85%'

  // Find unused processor to activate as contingency
  const unused = all.filter((p) => p.status === 'unused')
  const unusedCard = unused.find((p) => p.type === 'card')
  const activateAction = unusedCard
    ? `Activar ${unusedCard.name} como contingencia`
    : 'Evaluar procesador adicional para redundancia'

  return {
    id: 'concentration-risk',
    title: 'Riesgo de concentración crítico',
    description: `${pct.toFixed(0)}% del volumen (${formatUsd(top.totalVolume)}) depende de ${top.name}. Si este procesador falla, ${formatUsd(monthlyRevenueAtRisk)}/mes en comisiones está en riesgo.`,
    type: 'risk',
    priority: isHigh ? 'high' : 'medium',
    ebitdaImpact: -monthlyRevenueAtRisk,
    category: 'processor',
    actions: [backupAction, activateAction],
  }
}

function detectCostOptimization(): Insight | null {
  const all = getProcessorPerformance()
  const active = all.filter((p) => p.status === 'active')
  if (active.length < 2) return null

  // Find the most expensive active processor with significant volume
  const byExpensive = [...active].sort((a, b) => b.avgCost - a.avgCost)
  const byCheap = [...active].sort((a, b) => a.avgCost - b.avgCost)

  const expensive = byExpensive[0]
  const cheap = byCheap[0]
  if (!expensive || !cheap || expensive.id === cheap.id) return null

  const costDiff = expensive.avgCost - cheap.avgCost
  if (costDiff <= 0.2) return null // Not worth optimizing if diff < 0.2pp

  const sim = simulateRouting(expensive.id, cheap.id, 40)
  const monthlySavings = sim.impactUSD / 12

  if (monthlySavings <= 0) return null

  return {
    id: 'cost-optimization',
    title: 'Oportunidad de reducción de costos',
    description: `${expensive.name} cuesta ${expensive.avgCost}% vs ${cheap.name} ${cheap.avgCost}% para procesamiento similar. Migrar 40% del volumen genera ${formatUsd(monthlySavings)}/mes en ahorro.`,
    type: 'opportunity',
    priority: monthlySavings > 1000 ? 'high' : 'medium',
    ebitdaImpact: monthlySavings,
    category: 'processor',
    actions: [`Migrar 40% de ${expensive.name} a ${cheap.name}`, `Rate change estimado: ${sim.successRateChange >= 0 ? '+' : ''}${sim.successRateChange}pp`],
  }
}

function detectUnusedResources(): Insight | null {
  const all = getProcessorPerformance()
  const unused = all.filter((p) => p.status === 'unused')
  if (unused.length <= 5) return null

  // Estimate maintenance cost: ~$15/month per unused integration
  const estimatedMonthlyCost = unused.length * 15

  // Find which have been unused the longest (oldest creation date)
  const sorted = [...unused].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  const oldest = sorted.slice(0, 5)
  const oldestNames = oldest.map((p) => p.name).join(', ')

  return {
    id: 'unused-resources',
    title: `${unused.length} procesadores sin uso`,
    description: `Overhead operativo sin beneficio. Procesadores más antiguos sin actividad: ${oldestNames}. Costo estimado de mantenimiento: ${formatUsd(estimatedMonthlyCost)}/mes.`,
    type: 'optimization',
    priority: unused.length > 30 ? 'medium' : 'low',
    ebitdaImpact: estimatedMonthlyCost,
    category: 'operational',
    actions: [
      'Deprecar procesadores inactivos >12 meses',
      'Consolidar configuraciones duplicadas',
      `Evaluar activación de ${unused.filter((p) => p.type === 'wallet').length} wallets sin uso`,
    ],
  }
}

function detectSuccessRateOpportunity(): Insight | null {
  const all = getProcessorPerformance()
  const active = all.filter((p) => p.status === 'active')
  if (active.length < 2) return null

  // Find processor with best success rate
  const bestRate = [...active].sort((a, b) => b.successRate - a.successRate)[0]

  // Find whales (top merchants by volume) using a suboptimal processor
  // Simulate: find merchants with high volume but low success rate
  const merchantSnapshots: {
    name: string
    volume: number
    successRate: number
  }[] = []

  for (const client of CLIENTS_DATA) {
    const tx = TX_DATA[String(client.id)]
    if (!tx || tx.total_usd < 50_000) continue
    const health = getMerchantHealth(client.id)
    if (health.level !== 'healthy' || tx.success_rate >= bestRate.successRate)
      continue
    merchantSnapshots.push({
      name: client.name,
      volume: tx.total_usd,
      successRate: tx.success_rate,
    })
  }

  if (merchantSnapshots.length === 0) return null

  // Take the highest volume merchant with suboptimal rate
  merchantSnapshots.sort((a, b) => b.volume - a.volume)
  const whale = merchantSnapshots[0]

  // Calculate improvement potential
  const rateGap = bestRate.successRate - whale.successRate
  const additionalVolume = whale.volume * (rateGap / 100)
  const monthlyImpact = (additionalVolume * 0.018) / 12

  if (monthlyImpact <= 0) return null

  return {
    id: 'success-rate-opportunity',
    title: `${whale.name} con procesador subóptimo`,
    description: `Merchant whale con ${whale.successRate}% success rate cuando ${bestRate.name} ofrece ${bestRate.successRate}%. Mejora de ${rateGap}pp puede generar ${formatUsd(monthlyImpact)}/mes adicional.`,
    type: 'opportunity',
    priority: monthlyImpact > 500 ? 'high' : 'medium',
    ebitdaImpact: monthlyImpact,
    category: 'merchant',
    actions: [
      `Migrar ${whale.name} a ${bestRate.name} en piloto 30 días`,
      `Potencial: +${rateGap}pp approval rate sobre ${formatUsd(whale.volume)} volumen`,
    ],
  }
}

function detectDigitalGrowth(): Insight | null {
  const all = getProcessorPerformance()
  const active = all.filter((p) => p.status === 'active')
  const totalVolume = active.reduce((s, p) => s + p.totalVolume, 0)
  if (totalVolume === 0) return null

  const digital = active.filter((p) => p.type === 'digital')
  const digitalVolume = digital.reduce((s, p) => s + p.totalVolume, 0)
  const digitalPct = (digitalVolume / totalVolume) * 100

  if (digitalPct >= 15) return null // Already well-adopted

  // Target: grow digital to 15% of total
  const targetVolume = totalVolume * 0.15
  const additionalVolume = targetVolume - digitalVolume
  const monthlyImpact = (additionalVolume * 0.018) / 12

  // Average digital success rate
  const avgDigitalRate =
    digital.length > 0
      ? digital.reduce((s, p) => s + p.successRate, 0) / digital.length
      : 0

  const digitalNames = digital.map((p) => `${p.name} (${p.successRate}%)`).join(', ')

  return {
    id: 'digital-growth',
    title: 'Digital payments sin adopción plena',
    description: `${digitalNames} representan solo ${digitalPct.toFixed(0)}% del volumen (${formatUsd(digitalVolume)}). Con ${avgDigitalRate.toFixed(0)}% success rate promedio, expandir a 15% genera ${formatUsd(monthlyImpact)}/mes adicional.`,
    type: 'opportunity',
    priority: 'medium',
    ebitdaImpact: monthlyImpact,
    category: 'processor',
    actions: [
      'Campaña de adopción de digital wallets con merchants activos',
      'Incentivos para merchants que activen Apple Pay / Google Pay',
      `Potencial adicional: ${formatUsd(additionalVolume)} en volumen anual`,
    ],
  }
}

function detectGeographicConcentration(): Insight | null {
  const all = getProcessorPerformance()
  const active = all.filter((p) => p.status === 'active')

  // Count processors per country
  const countryVolume: Record<string, number> = {}
  for (const p of active) {
    for (const c of p.countries) {
      countryVolume[c] = (countryVolume[c] ?? 0) + p.totalVolume / p.countries.length
    }
  }

  const entries = Object.entries(countryVolume).sort(
    ([, a], [, b]) => b - a
  )
  if (entries.length < 2) return null

  const totalVol = entries.reduce((s, [, v]) => s + v, 0)
  const topCountry = entries[0]
  const topPct = (topCountry[1] / totalVol) * 100

  if (topPct <= 60) return null

  const lowCountries = entries
    .filter(([, v]) => (v / totalVol) * 100 < 10)
    .map(([c]) => c)

  if (lowCountries.length === 0) return null

  const expansionVolume = totalVol * 0.1 // Target 10% growth from underserved
  const monthlyImpact = (expansionVolume * 0.018) / 12

  return {
    id: 'geographic-concentration',
    title: `Oportunidad de expansión regional`,
    description: `${topPct.toFixed(0)}% del volumen concentrado en ${topCountry[0]}. Mercados subatendidos: ${lowCountries.join(', ')}. Expandir procesamiento local puede capturar ${formatUsd(monthlyImpact)}/mes.`,
    type: 'opportunity',
    priority: 'medium',
    ebitdaImpact: monthlyImpact,
    category: 'geographic',
    actions: [
      `Activar procesadores locales en ${lowCountries.join(', ')}`,
      `Meta: reducir concentración en ${topCountry[0]} a < 50%`,
      'Evaluar regulaciones locales para procesamiento doméstico',
    ],
  }
}

function detectLowRateProcessor(): Insight | null {
  const all = getProcessorPerformance()
  const active = all.filter((p) => p.status === 'active')
  if (active.length < 2) return null

  // Find active processor with lowest rate and significant volume
  const lowRate = [...active]
    .filter((p) => p.totalVolume > 50_000)
    .sort((a, b) => a.successRate - b.successRate)

  if (lowRate.length === 0) return null

  const worst = lowRate[0]
  const benchmark = 85

  if (worst.successRate >= benchmark) return null

  const gap = benchmark - worst.successRate
  const recoveredVolume = worst.totalVolume * (gap / 100)
  const monthlyImpact = (recoveredVolume * 0.018) / 12

  // Find better alternative
  const better = active
    .filter((p) => p.id !== worst.id && p.successRate > worst.successRate)
    .sort((a, b) => b.successRate - a.successRate)[0]

  const actions = better
    ? [
        `Migrar volumen de ${worst.name} (${worst.successRate}%) a ${better.name} (${better.successRate}%)`,
        `Volumen recuperable: ${formatUsd(recoveredVolume)}/año`,
      ]
    : [
        `Investigar causas de rechazo en ${worst.name}`,
        `Benchmark objetivo: ${benchmark}% success rate`,
      ]

  return {
    id: 'low-rate-processor',
    title: `${worst.name} bajo benchmark de aprobación`,
    description: `${worst.name} tiene ${worst.successRate}% success rate (benchmark: ${benchmark}%). Con ${formatUsd(worst.totalVolume)} en volumen, cada punto de mejora recupera ${formatUsd((worst.totalVolume * 0.01 * 0.018) / 12)}/mes.`,
    type: 'risk',
    priority: gap > 10 ? 'high' : 'medium',
    ebitdaImpact: monthlyImpact,
    category: 'processor',
    actions,
  }
}

// ─── Main export ────────────────────────────────────────────────────────────

export function generateProcessorInsights(): Insight[] {
  const detectors = [
    detectConcentrationRisk,
    detectCostOptimization,
    detectSuccessRateOpportunity,
    detectLowRateProcessor,
    detectDigitalGrowth,
    detectGeographicConcentration,
    detectUnusedResources,
  ]

  const insights: Insight[] = []

  for (const detect of detectors) {
    const insight = detect()
    if (insight) insights.push(insight)
  }

  // Sort: high priority first, then by absolute ebitda impact
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  insights.sort(
    (a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      Math.abs(b.ebitdaImpact) - Math.abs(a.ebitdaImpact)
  )

  return insights
}
