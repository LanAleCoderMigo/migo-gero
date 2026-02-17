// ─── Types ───────────────────────────────────────────────────────────────────

export type ProcessorType = 'card' | 'wallet' | 'digital' | 'cash' | 'local' | 'other';
export type ProcessorRegion = 'international' | 'latam' | 'local';
export type ProcessorStatus = 'active' | 'low-volume' | 'unused';

export interface Processor {
  id: number;
  name: string;
  type: ProcessorType;
  region: ProcessorRegion;
  createdAt: string;
}

export interface ProcessorPerformance extends Processor {
  totalVolume: number;
  totalTransactions: number;
  successRate: number;
  avgCost: number;
  merchantCount: number;
  status: ProcessorStatus;
  countries: string[];
}

export interface CostAnalysis {
  totalAnnualCost: number;
  potentialSavings: number;
  recommendations: string[];
}

export interface RoutingSimulation {
  currentCost: number;
  newCost: number;
  impactUSD: number;
  successRateChange: number;
}

// ─── Raw processor data (from ProcesadoresSB.csv) ────────────────────────────

const PROCESSORS_RAW: { id: number; name: string; createdAt: string }[] = [
  { id: 11, name: 'fac', createdAt: '2022-03-07' },
  { id: 12, name: 'fri', createdAt: '2022-03-07' },
  { id: 13, name: 'epay', createdAt: '2022-03-07' },
  { id: 14, name: 'openpay', createdAt: '2022-03-16' },
  { id: 15, name: 'ridivi', createdAt: '2022-03-16' },
  { id: 16, name: 'serfinsa', createdAt: '2022-03-17' },
  { id: 17, name: 'globalPay-PSE', createdAt: '2022-03-24' },
  { id: 18, name: 'globalPay', createdAt: '2022-03-31' },
  { id: 19, name: 'fac-2', createdAt: '2022-05-18' },
  { id: 20, name: 'visa-cybersource', createdAt: '2022-05-20' },
  { id: 21, name: 'paypal', createdAt: '2022-05-25' },
  { id: 22, name: 'mercadoPago', createdAt: '2022-08-12' },
  { id: 23, name: 'adyen', createdAt: '2022-09-12' },
  { id: 24, name: 'paymentez', createdAt: '2022-09-28' },
  { id: 25, name: 'ge', createdAt: '2022-10-27' },
  { id: 26, name: 'pronet', createdAt: '2023-03-23' },
  { id: 27, name: 'osmo', createdAt: '2023-06-07' },
  { id: 28, name: 'visa-epay', createdAt: '2023-07-05' },
  { id: 29, name: 'bam', createdAt: '2023-08-22' },
  { id: 159, name: 'zigi', createdAt: '2023-10-13' },
  { id: 160, name: 'visa', createdAt: '2023-11-07' },
  { id: 161, name: 't1-pagos', createdAt: '2024-02-13' },
  { id: 162, name: 't1pagos', createdAt: '2024-02-13' },
  { id: 163, name: 'ridivi-v2', createdAt: '2024-02-13' },
  { id: 164, name: 'ebanx', createdAt: '2024-02-14' },
  { id: 165, name: '{{processorSlug}}', createdAt: '2024-03-06' },
  { id: 166, name: 'mo', createdAt: '2024-03-27' },
  { id: 167, name: 'tc/td', createdAt: '2024-04-09' },
  { id: 168, name: 'transfer', createdAt: '2024-04-10' },
  { id: 170, name: 'azul', createdAt: '2024-07-17' },
  { id: 171, name: 'globalPay-ApplePay', createdAt: '2024-09-06' },
  { id: 172, name: 'akisi', createdAt: '2024-10-17' },
  { id: 173, name: 'cash', createdAt: '2024-10-17' },
  { id: 174, name: 'oky', createdAt: '2025-01-20' },
  { id: 175, name: 'migoCredit', createdAt: '2025-02-02' },
  { id: 176, name: 'davivienda', createdAt: '2025-02-21' },
  { id: 177, name: 'ebanxTest', createdAt: '2025-03-19' },
  { id: 178, name: 'akisiQR', createdAt: '2025-04-07' },
  { id: 179, name: 'bancoIndustrial', createdAt: '2025-05-29' },
  { id: 180, name: 'applePayFac', createdAt: '2025-06-05' },
  { id: 181, name: 'nequi', createdAt: '2025-07-04' },
  { id: 182, name: 'bbva', createdAt: '2025-07-18' },
  { id: 183, name: 'push-payment-neonet', createdAt: '2025-07-21' },
  { id: 184, name: 'push-payment-gateway', createdAt: '2025-07-21' },
  { id: 185, name: 'bbvaQR', createdAt: '2025-07-30' },
  { id: 186, name: 'applePayT1', createdAt: '2025-08-26' },
  { id: 187, name: 'applePayCyber', createdAt: '2025-09-05' },
  { id: 188, name: 'bamButton', createdAt: '2025-11-06' },
  { id: 189, name: 'bamPaymentButton', createdAt: '2025-11-23' },
  { id: 190, name: 'googlepay', createdAt: '2025-12-10' },
  { id: 191, name: 'googlePayCyber', createdAt: '2025-12-22' },
  { id: 192, name: 'quickPayQR', createdAt: '2026-01-08' },
];

// ─── Classification maps ────────────────────────────────────────────────────

const TYPE_MAP: Record<string, ProcessorType> = {
  // Cards
  'visa': 'card',
  'visa-cybersource': 'card',
  'visa-epay': 'card',
  'adyen': 'card',
  'serfinsa': 'card',
  'globalPay': 'card',
  'globalPay-PSE': 'card',
  'globalPay-ApplePay': 'card',
  'paymentez': 'card',
  'azul': 'card',
  'tc/td': 'card',
  // Wallets
  'paypal': 'wallet',
  'mercadoPago': 'wallet',
  'openpay': 'wallet',
  'ebanx': 'wallet',
  'ebanxTest': 'wallet',
  'nequi': 'wallet',
  'oky': 'wallet',
  // Digital
  'googlepay': 'digital',
  'googlePayCyber': 'digital',
  'applePayFac': 'digital',
  'applePayT1': 'digital',
  'applePayCyber': 'digital',
  // Cash
  'cash': 'cash',
  'transfer': 'cash',
  // Local
  'bancoIndustrial': 'local',
  'davivienda': 'local',
  'bbva': 'local',
  'bbvaQR': 'local',
  'ridivi': 'local',
  'ridivi-v2': 'local',
  'fac': 'local',
  'fac-2': 'local',
  'fri': 'local',
  'bam': 'local',
  'bamButton': 'local',
  'bamPaymentButton': 'local',
  'quickPayQR': 'local',
};

const REGION_MAP: Record<string, ProcessorRegion> = {
  'adyen': 'international',
  'paypal': 'international',
  'visa-cybersource': 'international',
  'visa': 'international',
  'visa-epay': 'international',
  'googlepay': 'international',
  'googlePayCyber': 'international',
  'applePayFac': 'international',
  'applePayT1': 'international',
  'applePayCyber': 'international',
  'globalPay': 'international',
  'globalPay-PSE': 'international',
  'globalPay-ApplePay': 'international',
  'ebanx': 'latam',
  'ebanxTest': 'latam',
  'mercadoPago': 'latam',
  'openpay': 'latam',
  'paymentez': 'latam',
  'azul': 'latam',
  't1-pagos': 'latam',
  't1pagos': 'latam',
};

// ─── Simulated performance data (based on $2.06M portfolio) ──────────────────

interface PerformanceData {
  totalVolume: number;
  totalTransactions: number;
  successRate: number;
  avgCost: number;
  merchantCount: number;
  countries: string[];
}

const PERFORMANCE_MAP: Record<string, PerformanceData> = {
  'visa-cybersource': {
    totalVolume: 1_339_000,
    totalTransactions: 8_500,
    successRate: 82,
    avgCost: 2.9,
    merchantCount: 45,
    countries: ['GT', 'MX', 'SV', 'HN', 'CR'],
  },
  'paypal': {
    totalVolume: 247_000,
    totalTransactions: 890,
    successRate: 91,
    avgCost: 3.4,
    merchantCount: 18,
    countries: ['GT', 'MX', 'CR'],
  },
  'mercadoPago': {
    totalVolume: 165_000,
    totalTransactions: 650,
    successRate: 88,
    avgCost: 3.2,
    merchantCount: 12,
    countries: ['MX'],
  },
  'bancoIndustrial': {
    totalVolume: 124_000,
    totalTransactions: 480,
    successRate: 79,
    avgCost: 2.8,
    merchantCount: 15,
    countries: ['GT'],
  },
  'googlepay': {
    totalVolume: 82_000,
    totalTransactions: 320,
    successRate: 94,
    avgCost: 3.0,
    merchantCount: 8,
    countries: ['GT', 'MX'],
  },
  'applePayFac': {
    totalVolume: 62_000,
    totalTransactions: 240,
    successRate: 95,
    avgCost: 3.0,
    merchantCount: 6,
    countries: ['GT', 'MX'],
  },
  'cash': {
    totalVolume: 41_000,
    totalTransactions: 180,
    successRate: 99,
    avgCost: 1.5,
    merchantCount: 10,
    countries: ['GT', 'SV'],
  },
};

// ─── Build processors ───────────────────────────────────────────────────────

function classifyType(name: string): ProcessorType {
  return TYPE_MAP[name] ?? 'other';
}

function classifyRegion(name: string): ProcessorRegion {
  return REGION_MAP[name] ?? 'local';
}

export const PROCESSORS_DATA: Processor[] = PROCESSORS_RAW.map((p) => ({
  id: p.id,
  name: p.name,
  type: classifyType(p.name),
  region: classifyRegion(p.name),
  createdAt: p.createdAt,
}));

// ─── Exported functions ─────────────────────────────────────────────────────

export function getProcessorPerformance(): ProcessorPerformance[] {
  return PROCESSORS_DATA.map((p) => {
    const perf = PERFORMANCE_MAP[p.name];
    if (perf) {
      return {
        ...p,
        ...perf,
        status: 'active' as ProcessorStatus,
      };
    }
    return {
      ...p,
      totalVolume: 0,
      totalTransactions: 0,
      successRate: 0,
      avgCost: 0,
      merchantCount: 0,
      status: 'unused' as ProcessorStatus,
      countries: [],
    };
  });
}

export function getProcessorsByType(): Record<ProcessorType, ProcessorPerformance[]> {
  const all = getProcessorPerformance();
  const grouped: Record<ProcessorType, ProcessorPerformance[]> = {
    card: [],
    wallet: [],
    digital: [],
    cash: [],
    local: [],
    other: [],
  };
  for (const p of all) {
    grouped[p.type].push(p);
  }
  // Sort each group by volume desc
  for (const key of Object.keys(grouped) as ProcessorType[]) {
    grouped[key].sort((a, b) => b.totalVolume - a.totalVolume);
  }
  return grouped;
}

export function getUnusedProcessors(): Processor[] {
  return PROCESSORS_DATA.filter((p) => !PERFORMANCE_MAP[p.name]);
}

export function getProcessorCostAnalysis(): CostAnalysis {
  const activeProcessors = getProcessorPerformance().filter(
    (p) => p.status === 'active'
  );

  // Total annual cost = sum(volume × avgCost%)
  const totalAnnualCost = activeProcessors.reduce(
    (sum, p) => sum + p.totalVolume * (p.avgCost / 100),
    0
  );

  // Potential savings: if we route paypal (3.4%) and mercadoPago (3.2%)
  // volume through visa-cybersource (2.9%), savings per dollar moved
  const paypalSavings = 247_000 * ((3.4 - 2.9) / 100); // $1,235
  const mercadoPagoSavings = 165_000 * ((3.2 - 2.9) / 100); // $495
  const potentialSavings = paypalSavings + mercadoPagoSavings;

  const recommendations = [
    `Redirigir 30% del volumen de PayPal ($74K) a visa-cybersource ahorra $370/mes en comisiones (3.4% → 2.9%)`,
    `Banco Industrial tiene 79% success rate vs 82% de visa-cybersource. Evaluar migración de merchants GT para ganar 3 puntos de aprobación`,
    `Google Pay y Apple Pay muestran 94-95% success rate. Priorizar adopción para merchants con success rate < 80%`,
    `Cash tiene el menor costo (1.5%) y 99% success rate. Expandir a más merchants en GT y SV para reducir costo promedio`,
    `36 procesadores sin volumen. Evaluar desactivación para reducir complejidad operativa y costos de mantenimiento`,
  ];

  return { totalAnnualCost, potentialSavings, recommendations };
}

export function simulateRouting(
  fromId: number,
  toId: number,
  percentVolume: number
): RoutingSimulation {
  const all = getProcessorPerformance();
  const from = all.find((p) => p.id === fromId);
  const to = all.find((p) => p.id === toId);

  if (!from || !to) {
    return { currentCost: 0, newCost: 0, impactUSD: 0, successRateChange: 0 };
  }

  const volumeToMove = from.totalVolume * (percentVolume / 100);
  const currentCost = volumeToMove * (from.avgCost / 100);
  const newCost = volumeToMove * (to.avgCost / 100);
  const impactUSD = currentCost - newCost;
  const successRateChange = to.successRate - from.successRate;

  return { currentCost, newCost, impactUSD, successRateChange };
}
