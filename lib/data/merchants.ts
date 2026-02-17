// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClientData {
  id: number;
  name: string;
  country: string;
  counter: number;
  onPlatform: boolean;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantTxStats {
  total_transactions: number;
  successful: number;
  failed: number;
  success_rate: number;
  total_usd: number;
  avg_ticket_usd: number;
  last_transaction: string | null;
  days_since_last_tx: number;
  channels: string[];
  payment_types: string[];
}

export type HealthLevel = 'critical' | 'risk' | 'healthy';

export interface MerchantHealth {
  score: number;
  level: HealthLevel;
  reasons: string[];
}

// ─── CLIENTS_DATA (from ClientesSB.csv) ──────────────────────────────────────

export const CLIENTS_DATA: ClientData[] = [
  { id: 11, name: 'elRoble', country: 'GT', counter: 934, onPlatform: true, isEnabled: true, createdAt: '2022-03-02 01:08:28', updatedAt: '2026-02-12 16:24:58' },
  { id: 12, name: 'papaJohnsGT', country: 'GT', counter: 1492, onPlatform: true, isEnabled: true, createdAt: '2022-03-04 22:50:10', updatedAt: '2025-10-06 21:07:07' },
  { id: 13, name: 'pandoraCR', country: 'CR', counter: 893, onPlatform: true, isEnabled: true, createdAt: '2022-03-07 18:17:11', updatedAt: '2025-02-27 03:37:18' },
  { id: 14, name: 'elektra', country: 'GT', counter: 5939, onPlatform: true, isEnabled: true, createdAt: '2022-03-07 20:26:18', updatedAt: '2026-02-13 13:25:17' },
  { id: 15, name: 'campero', country: 'GT', counter: 845, onPlatform: true, isEnabled: true, createdAt: '2022-03-07 20:28:43', updatedAt: '2023-04-25 20:53:03' },
  { id: 16, name: 'ilgGT', country: 'GT', counter: 169, onPlatform: true, isEnabled: true, createdAt: '2022-03-11 22:15:44', updatedAt: '2024-10-04 17:42:39' },
  { id: 17, name: 'toks1', country: 'MX', counter: 573, onPlatform: true, isEnabled: true, createdAt: '2022-03-16 00:02:44', updatedAt: '2024-09-23 15:49:54' },
  { id: 18, name: 'migoTest', country: 'GT', counter: 403212, onPlatform: true, isEnabled: true, createdAt: '2022-03-16 23:31:11', updatedAt: '2026-02-16 08:05:03' },
  { id: 19, name: 'toks2', country: 'MX', counter: 1495, onPlatform: true, isEnabled: true, createdAt: '2022-03-17 06:18:01', updatedAt: '2024-06-20 13:24:18' },
  { id: 20, name: 'toks3', country: 'MX', counter: 43, onPlatform: true, isEnabled: true, createdAt: '2022-03-17 06:20:22', updatedAt: '2024-03-01 05:54:07' },
  { id: 21, name: 'toks4', country: 'MX', counter: 854, onPlatform: true, isEnabled: true, createdAt: '2022-03-17 06:21:18', updatedAt: '2024-08-12 09:45:31' },
  { id: 22, name: 'toks5', country: 'MX', counter: 37, onPlatform: true, isEnabled: true, createdAt: '2022-03-17 06:21:37', updatedAt: '2023-09-13 21:07:42' },
  { id: 23, name: 'mongeCR', country: 'GT', counter: 1612, onPlatform: true, isEnabled: true, createdAt: '2022-03-22 17:00:46', updatedAt: '2024-04-08 23:46:59' },
  { id: 24, name: 'cwCO', country: 'CO', counter: 2130, onPlatform: false, isEnabled: true, createdAt: '2022-03-30 20:27:48', updatedAt: '2023-04-25 20:53:25' },
  { id: 25, name: 'dominosCO', country: 'CO', counter: 1886, onPlatform: false, isEnabled: true, createdAt: '2022-03-30 23:59:18', updatedAt: '2024-09-30 08:05:51' },
  { id: 26, name: 'krispyKreme', country: 'MX', counter: 1406, onPlatform: true, isEnabled: true, createdAt: '2022-03-31 18:04:21', updatedAt: '2024-03-01 05:53:51' },
  { id: 27, name: 'sanMartin', country: 'GT', counter: 1185, onPlatform: true, isEnabled: true, createdAt: '2022-04-06 19:58:57', updatedAt: '2026-02-13 17:22:54' },
  { id: 28, name: 'papaJohnsCR', country: 'CR', counter: 532, onPlatform: true, isEnabled: true, createdAt: '2022-04-07 21:50:28', updatedAt: '2026-02-03 03:24:38' },
  { id: 29, name: 'papaJohnsPA', country: 'PA', counter: 680, onPlatform: true, isEnabled: true, createdAt: '2022-04-08 18:08:43', updatedAt: '2024-02-16 19:24:00' },
  { id: 30, name: 'ciam', country: 'GT', counter: 1120, onPlatform: true, isEnabled: true, createdAt: '2022-05-09 22:25:50', updatedAt: '2023-04-25 20:53:03' },
  { id: 31, name: 'camperoTesting', country: 'GT', counter: 18616, onPlatform: true, isEnabled: true, createdAt: '2022-05-13 17:48:09', updatedAt: '2026-02-13 20:57:35' },
  { id: 32, name: 'farolitoPolanco', country: 'MX', counter: 65, onPlatform: true, isEnabled: true, createdAt: '2022-05-17 14:33:20', updatedAt: '2024-02-26 14:15:23' },
  { id: 33, name: 'farolitoSalvador', country: 'MX', counter: 35, onPlatform: true, isEnabled: true, createdAt: '2022-05-17 14:57:07', updatedAt: '2024-02-21 17:45:22' },
  { id: 34, name: 'farolitoProlongacion', country: 'MX', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2022-05-17 15:06:46', updatedAt: '2023-04-25 20:53:03' },
  { id: 35, name: 'farolitoInterlomas', country: 'MX', counter: 25, onPlatform: true, isEnabled: true, createdAt: '2022-05-18 14:26:21', updatedAt: '2023-04-25 20:53:03' },
  { id: 36, name: 'esteeLauder', country: 'GT', counter: 25, onPlatform: true, isEnabled: true, createdAt: '2022-05-23 17:19:35', updatedAt: '2023-04-25 20:53:03' },
  { id: 37, name: 'esteeLauder', country: 'MX', counter: 2160, onPlatform: true, isEnabled: true, createdAt: '2022-05-25 17:04:13', updatedAt: '2024-03-25 21:24:52' },
  { id: 38, name: 'clinique', country: 'MX', counter: 240, onPlatform: true, isEnabled: true, createdAt: '2022-05-27 22:21:26', updatedAt: '2023-04-25 20:53:25' },
  { id: 39, name: 'coppel', country: 'MX', counter: 61, onPlatform: true, isEnabled: true, createdAt: '2022-05-31 23:36:13', updatedAt: '2024-04-02 20:49:13' },
  { id: 40, name: 'cbcb2cGT', country: 'GT', counter: 764, onPlatform: true, isEnabled: true, createdAt: '2022-06-03 21:20:08', updatedAt: '2026-02-11 23:06:54' },
  { id: 41, name: 'tillsterGT', country: 'GT', counter: 14488, onPlatform: true, isEnabled: true, createdAt: '2022-06-06 16:39:06', updatedAt: '2026-02-16 09:06:43' },
  { id: 42, name: 'uxTraining', country: 'GT', counter: 41862, onPlatform: true, isEnabled: true, createdAt: '2022-06-10 20:35:32', updatedAt: '2025-09-10 00:46:05' },
  { id: 43, name: 'coppel-3ds', country: 'MX', counter: 9975, onPlatform: true, isEnabled: true, createdAt: '2022-06-16 00:35:34', updatedAt: '2026-01-29 15:46:55' },
  { id: 44, name: 'uxTraining3', country: 'GT', counter: 60, onPlatform: true, isEnabled: true, createdAt: '2022-06-17 08:03:37', updatedAt: '2023-10-03 20:26:07' },
  { id: 45, name: 'uxTraining2', country: 'GT', counter: 127, onPlatform: true, isEnabled: true, createdAt: '2022-06-21 15:27:36', updatedAt: '2024-07-11 17:11:13' },
  { id: 46, name: 'uxTraining4', country: 'GT', counter: 71, onPlatform: true, isEnabled: true, createdAt: '2022-06-21 16:07:51', updatedAt: '2023-09-30 16:33:57' },
  { id: 47, name: 'PenTest', country: 'MX', counter: 10, onPlatform: true, isEnabled: true, createdAt: '2022-06-30 21:24:45', updatedAt: '2023-04-25 20:53:03' },
  { id: 48, name: 'PenTest', country: 'GT', counter: 1310, onPlatform: true, isEnabled: true, createdAt: '2022-06-30 21:31:37', updatedAt: '2023-04-25 20:53:03' },
  { id: 49, name: 'uneteGT', country: 'GT', counter: 1113, onPlatform: true, isEnabled: true, createdAt: '2022-07-01 16:30:47', updatedAt: '2024-06-04 22:19:30' },
  { id: 50, name: 'camperoGT', country: 'GT', counter: 19876, onPlatform: true, isEnabled: true, createdAt: '2022-07-06 21:00:49', updatedAt: '2026-02-13 14:50:18' },
  { id: 51, name: 'camperoSV', country: 'SV', counter: 1462, onPlatform: true, isEnabled: true, createdAt: '2022-07-06 21:06:50', updatedAt: '2026-02-12 14:54:36' },
  { id: 52, name: 'krispyDeliverect', country: 'MX', counter: 225, onPlatform: true, isEnabled: true, createdAt: '2022-07-11 15:58:11', updatedAt: '2023-04-25 20:53:03' },
  { id: 64, name: 'krispyRetencion', country: 'MX', counter: 393, onPlatform: true, isEnabled: true, createdAt: '2022-07-19 16:19:43', updatedAt: '2023-06-26 18:47:57' },
  { id: 65, name: 'mac', country: 'MX', counter: 165, onPlatform: true, isEnabled: true, createdAt: '2022-07-21 18:29:09', updatedAt: '2023-04-25 20:53:03' },
  { id: 66, name: 'cine-test', country: 'GT', counter: 10, onPlatform: true, isEnabled: true, createdAt: '2022-07-28 17:21:46', updatedAt: '2023-04-25 20:53:03' },
  { id: 67, name: 'krispyKremeDeliverectMX', country: 'MX', counter: 505, onPlatform: true, isEnabled: true, createdAt: '2022-07-28 20:45:36', updatedAt: '2023-04-25 20:53:25' },
  { id: 68, name: 'coppelNgMX', country: 'MX', counter: 47, onPlatform: true, isEnabled: true, createdAt: '2022-08-09 20:02:06', updatedAt: '2023-09-19 21:40:12' },
  { id: 69, name: 'macMX', country: 'MX', counter: 220, onPlatform: true, isEnabled: true, createdAt: '2022-08-12 04:47:08', updatedAt: '2023-04-25 20:53:25' },
  { id: 70, name: 'fahorroMX', country: 'MX', counter: 2009, onPlatform: true, isEnabled: true, createdAt: '2022-09-12 17:33:58', updatedAt: '2025-08-28 07:11:11' },
  { id: 71, name: 'migoSB1', country: 'MX', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2022-10-07 16:26:28', updatedAt: '2023-04-25 20:53:03' },
  { id: 72, name: 'lulisGT', country: 'GT', counter: 4284, onPlatform: true, isEnabled: true, createdAt: '2022-10-10 20:38:14', updatedAt: '2025-07-25 18:42:59' },
  { id: 73, name: 'pandoraBO', country: 'BO', counter: 539, onPlatform: true, isEnabled: true, createdAt: '2022-10-14 18:50:59', updatedAt: '2024-09-24 22:50:17' },
  { id: 74, name: 'ebanxTest', country: 'GT', counter: 6470, onPlatform: true, isEnabled: true, createdAt: '2022-10-24 13:26:56', updatedAt: '2026-02-10 18:33:26' },
  { id: 75, name: 'cbcCreditGT', country: 'GT', counter: 4765, onPlatform: true, isEnabled: true, createdAt: '2022-10-27 21:25:22', updatedAt: '2025-06-17 11:20:24' },
  { id: 76, name: 'scentiaGT', country: 'GT', counter: 380, onPlatform: true, isEnabled: true, createdAt: '2022-11-10 20:24:14', updatedAt: '2024-07-30 15:03:34' },
  { id: 77, name: 'tillsterSV', country: 'SV', counter: 7091, onPlatform: true, isEnabled: true, createdAt: '2022-12-02 14:56:56', updatedAt: '2026-02-14 18:15:24' },
  { id: 78, name: 'camperoTestingSV', country: 'GT', counter: 0, onPlatform: true, isEnabled: true, createdAt: '2022-12-14 23:09:34', updatedAt: '2022-12-14 23:09:34' },
  { id: 79, name: 'camperoSVNG', country: 'SV', counter: 80, onPlatform: true, isEnabled: true, createdAt: '2023-01-09 19:54:19', updatedAt: '2023-04-25 20:53:25' },
  { id: 80, name: 'camperoGTNG', country: 'GT', counter: 75, onPlatform: true, isEnabled: true, createdAt: '2023-01-13 15:42:50', updatedAt: '2023-04-25 20:53:25' },
  { id: 81, name: 'farolitoDelValle', country: 'MX', counter: 106, onPlatform: true, isEnabled: true, createdAt: '2023-01-17 23:35:04', updatedAt: '2024-02-21 17:52:47' },
  { id: 82, name: 'ebanxPrime', country: 'GT', counter: 15, onPlatform: true, isEnabled: true, createdAt: '2023-01-20 17:05:21', updatedAt: '2023-04-25 20:53:03' },
  { id: 83, name: 'elektra-ng', country: 'GT', counter: 350, onPlatform: true, isEnabled: true, createdAt: '2023-02-09 02:55:36', updatedAt: '2024-07-22 17:40:12' },
  { id: 84, name: 'tillsterSV-err', country: 'SV', counter: 35, onPlatform: true, isEnabled: true, createdAt: '2023-03-14 22:19:39', updatedAt: '2023-04-25 20:53:25' },
  { id: 85, name: 'mcdGT', country: 'GT', counter: 1902, onPlatform: true, isEnabled: true, createdAt: '2023-03-16 19:11:48', updatedAt: '2026-02-13 15:54:46' },
  { id: 86, name: 'cwCO001', country: 'CO', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2023-03-21 21:16:02', updatedAt: '2023-04-25 20:53:25' },
  { id: 87, name: 'cwCO032', country: 'CO', counter: 125, onPlatform: true, isEnabled: true, createdAt: '2023-04-03 14:15:12', updatedAt: '2023-04-25 20:53:25' },
  { id: 88, name: 'cwCOTest', country: 'CO', counter: 337, onPlatform: true, isEnabled: true, createdAt: '2023-04-12 16:52:43', updatedAt: '2025-11-04 17:53:32' },
  { id: 89, name: 'coppel-3ds2', country: 'MX', counter: 64, onPlatform: true, isEnabled: true, createdAt: '2023-04-13 21:15:08', updatedAt: '2025-01-10 19:00:42' },
  { id: 254, name: 'granjeroGT', country: 'GT', counter: 228, onPlatform: true, isEnabled: true, createdAt: '2023-04-27 22:35:07', updatedAt: '2026-02-13 20:34:47' },
  { id: 255, name: 'ebanxTest2', country: 'GT', counter: 8, onPlatform: true, isEnabled: true, createdAt: '2023-04-28 16:54:57', updatedAt: '2023-04-28 17:16:30' },
  { id: 256, name: 'porcusGT', country: 'GT', counter: 626, onPlatform: true, isEnabled: true, createdAt: '2023-05-10 21:28:06', updatedAt: '2026-02-06 12:06:52' },
  { id: 257, name: 'elektraCash', country: 'GT', counter: 385, onPlatform: true, isEnabled: true, createdAt: '2023-05-24 13:30:26', updatedAt: '2025-04-10 19:33:30' },
  { id: 258, name: 'primeVideoCR', country: 'CR', counter: 8, onPlatform: true, isEnabled: true, createdAt: '2023-05-30 00:27:16', updatedAt: '2025-10-10 22:50:36' },
  { id: 259, name: 'papaJohnsGT2', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2023-05-31 23:49:20', updatedAt: '2023-05-31 23:49:20' },
  { id: 260, name: 'tiendaMiaPA', country: 'PA', counter: 67, onPlatform: true, isEnabled: true, createdAt: '2023-06-01 12:28:39', updatedAt: '2025-04-08 20:34:02' },
  { id: 261, name: 'techEducationPA', country: 'PA', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2023-06-01 12:50:03', updatedAt: '2023-06-01 12:52:44' },
  { id: 262, name: 'turkishAirlinesPA', country: 'PA', counter: 13, onPlatform: true, isEnabled: true, createdAt: '2023-06-01 13:01:03', updatedAt: '2024-07-11 18:31:36' },
  { id: 263, name: 'doinGlobalPA', country: 'PA', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2023-06-01 13:08:38', updatedAt: '2023-09-06 15:26:58' },
  { id: 264, name: 'doingGlobalGT', country: 'GT', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2023-06-07 19:18:11', updatedAt: '2023-07-26 15:01:15' },
  { id: 265, name: 'lulisGT-TEST', country: 'GT', counter: 8, onPlatform: true, isEnabled: true, createdAt: '2023-06-15 22:01:26', updatedAt: '2023-06-15 22:29:25' },
  { id: 266, name: 'garenaPA', country: 'PA', counter: 27, onPlatform: true, isEnabled: true, createdAt: '2023-06-21 17:37:57', updatedAt: '2023-11-17 16:06:51' },
  { id: 267, name: 'krispyKremeMXSB', country: 'MX', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2023-06-22 20:30:40', updatedAt: '2023-06-22 20:30:40' },
  { id: 268, name: 'coppel3ds', country: 'MX', counter: 46, onPlatform: true, isEnabled: true, createdAt: '2023-06-22 23:10:26', updatedAt: '2023-09-30 05:21:00' },
  { id: 269, name: 'garenaGT', country: 'GT', counter: 69, onPlatform: true, isEnabled: true, createdAt: '2023-06-30 18:45:17', updatedAt: '2025-11-03 02:34:18' },
  { id: 270, name: 'burgerKingGT', country: 'GT', counter: 1274, onPlatform: true, isEnabled: true, createdAt: '2023-06-30 23:59:12', updatedAt: '2025-10-30 16:07:52' },
  { id: 271, name: 'guatiqueGT', country: 'GT', counter: 129, onPlatform: true, isEnabled: true, createdAt: '2023-07-06 15:15:48', updatedAt: '2025-10-10 22:39:32' },
  { id: 272, name: 'amazonCR', country: 'CR', counter: 31, onPlatform: true, isEnabled: true, createdAt: '2023-07-10 17:30:23', updatedAt: '2025-08-21 16:47:22' },
  { id: 273, name: 'tiendaMiaGT', country: 'GT', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2023-07-11 21:16:35', updatedAt: '2023-07-11 21:18:36' },
  { id: 274, name: 'tradeinnGT', country: 'GT', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2023-07-11 21:35:15', updatedAt: '2023-07-11 21:37:22' },
  { id: 275, name: 'amazonGT', country: 'GT', counter: 106, onPlatform: true, isEnabled: true, createdAt: '2023-07-11 21:47:38', updatedAt: '2025-08-25 21:23:01' },
  { id: 276, name: 'baristaCAGGT', country: 'GT', counter: 290, onPlatform: true, isEnabled: true, createdAt: '2023-07-27 19:54:11', updatedAt: '2025-03-12 19:21:54' },
  { id: 277, name: 'makaiGT', country: 'GT', counter: 22, onPlatform: true, isEnabled: true, createdAt: '2023-08-01 17:05:33', updatedAt: '2025-07-29 22:07:14' },
  { id: 278, name: 'trainingSofia', country: 'GT', counter: 10, onPlatform: true, isEnabled: true, createdAt: '2023-08-14 18:48:30', updatedAt: '2023-08-21 21:11:24' },
  { id: 279, name: 'cmiCreditGT', country: 'GT', counter: 276, onPlatform: true, isEnabled: true, createdAt: '2023-08-22 13:16:03', updatedAt: '2024-08-02 17:33:12' },
  { id: 280, name: 'burgerKingGT007', country: 'GT', counter: 25, onPlatform: true, isEnabled: true, createdAt: '2023-08-24 01:12:16', updatedAt: '2024-09-17 23:19:03' },
  { id: 281, name: 'krispyKremeStagingMX', country: 'MX', counter: 58, onPlatform: true, isEnabled: true, createdAt: '2023-08-30 13:40:40', updatedAt: '2023-09-15 22:46:03' },
  { id: 282, name: 'migopaymentspartner', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2023-09-04 23:18:35', updatedAt: '2023-09-04 23:18:54' },
  { id: 283, name: 'uneteWebGT', country: 'GT', counter: 59, onPlatform: true, isEnabled: true, createdAt: '2023-09-06 19:08:40', updatedAt: '2024-07-12 18:27:14' },
  { id: 284, name: 'burgerKingGT001', country: 'GT', counter: 96, onPlatform: true, isEnabled: true, createdAt: '2023-09-08 22:05:59', updatedAt: '2025-11-05 21:09:13' },
  { id: 285, name: 'ebanxSV', country: 'SV', counter: 120, onPlatform: true, isEnabled: true, createdAt: '2023-09-28 21:35:07', updatedAt: '2026-02-10 18:33:55' },
  { id: 286, name: 'cristinaOnboarding', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2023-09-30 16:41:54', updatedAt: '2023-09-30 16:43:08' },
  { id: 287, name: 'diegoOnboarding', country: 'GT', counter: 24, onPlatform: true, isEnabled: true, createdAt: '2023-10-01 20:21:24', updatedAt: '2023-10-12 17:15:56' },
  { id: 288, name: 'farolitoTecamachalco', country: 'MX', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2023-10-03 18:31:10', updatedAt: '2023-10-03 18:31:10' },
  { id: 289, name: 'danielaOnboarding', country: 'GT', counter: 8, onPlatform: true, isEnabled: true, createdAt: '2023-10-04 16:38:26', updatedAt: '2023-10-12 18:23:04' },
  { id: 290, name: 'dianaOnboarding', country: 'GT', counter: 8, onPlatform: true, isEnabled: true, createdAt: '2023-10-04 16:40:48', updatedAt: '2023-11-28 19:44:53' },
  { id: 291, name: 'daraSecurity', country: 'GT', counter: 7, onPlatform: true, isEnabled: true, createdAt: '2023-10-06 19:50:28', updatedAt: '2023-10-07 15:32:07' },
  { id: 292, name: 'cbcb2cNgGT', country: 'GT', counter: 55, onPlatform: true, isEnabled: true, createdAt: '2023-10-09 20:21:32', updatedAt: '2023-11-07 17:46:00' },
  { id: 293, name: 'zigiClient', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2023-10-18 16:34:44', updatedAt: '2023-10-18 16:40:52' },
  { id: 294, name: 'migoTest-B', country: 'GT', counter: 6, onPlatform: true, isEnabled: true, createdAt: '2023-10-24 23:43:49', updatedAt: '2023-11-15 18:26:37' },
  { id: 295, name: 'kevinOnboarding', country: 'GT', counter: 14, onPlatform: true, isEnabled: true, createdAt: '2023-10-25 15:52:19', updatedAt: '2023-11-03 21:47:30' },
  { id: 296, name: 'krispyKremeUberMX', country: 'MX', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2023-10-25 19:15:00', updatedAt: '2023-11-06 17:17:17' },
  { id: 297, name: 'garenaCR', country: 'CR', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2023-10-30 23:47:40', updatedAt: '2023-11-13 18:56:10' },
  { id: 298, name: 'fercoGT', country: 'GT', counter: 2287, onPlatform: true, isEnabled: true, createdAt: '2023-11-06 18:34:20', updatedAt: '2025-10-10 23:13:10' },
  { id: 299, name: 'elGalloMasGalloGT', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2023-11-10 21:27:59', updatedAt: '2023-11-10 21:30:12' },
  { id: 300, name: 'tributaxGT', country: 'GT', counter: 742, onPlatform: true, isEnabled: true, createdAt: '2023-11-14 14:20:12', updatedAt: '2026-02-01 08:04:57' },
  { id: 301, name: 'yummiiGT', country: 'GT', counter: 605, onPlatform: true, isEnabled: true, createdAt: '2023-11-14 14:35:50', updatedAt: '2026-02-12 20:19:49' },
  { id: 302, name: 'cmiCreditGTT', country: 'GT', counter: 0, onPlatform: true, isEnabled: true, createdAt: '2023-11-22 19:16:00', updatedAt: '2024-01-29 17:08:53' },
  { id: 303, name: 'ropeCreditGT', country: 'GT', counter: 0, onPlatform: true, isEnabled: true, createdAt: '2023-11-22 19:16:17', updatedAt: '2023-11-22 20:05:03' },
  { id: 304, name: 'municipalidadGT', country: 'GT', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2023-11-28 20:30:27', updatedAt: '2023-11-28 21:20:12' },
  { id: 305, name: 'bantrabGT', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2023-12-20 15:50:04', updatedAt: '2023-12-20 16:03:27' },
  { id: 306, name: 'bantrabNewGT', country: 'GT', counter: 6, onPlatform: true, isEnabled: true, createdAt: '2023-12-20 16:49:20', updatedAt: '2023-12-20 22:47:24' },
  { id: 307, name: 'bancoAztecaGT', country: 'GT', counter: 341, onPlatform: true, isEnabled: true, createdAt: '2024-01-02 22:05:37', updatedAt: '2026-01-16 15:35:17' },
  { id: 308, name: 'migoTest-2', country: 'GT', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2024-01-14 23:55:35', updatedAt: '2024-01-15 16:37:43' },
  { id: 309, name: 'migoTestQA', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-01-15 16:42:10', updatedAt: '2024-01-15 16:42:10' },
  { id: 310, name: 'migoTestQARidivi', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-01-16 22:40:51', updatedAt: '2024-01-16 22:40:51' },
  { id: 311, name: 'migoTestEpaySoap', country: 'GT', counter: 197, onPlatform: true, isEnabled: true, createdAt: '2024-01-18 17:40:38', updatedAt: '2024-02-22 06:49:24' },
  { id: 312, name: 'migoTestFac2', country: 'GT', counter: 114, onPlatform: true, isEnabled: true, createdAt: '2024-01-19 05:09:42', updatedAt: '2024-02-19 18:27:30' },
  { id: 313, name: 'migoTest2', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2024-01-24 17:58:11', updatedAt: '2024-01-24 17:59:21' },
  { id: 314, name: 'mongeGT', country: 'GT', counter: 253, onPlatform: true, isEnabled: true, createdAt: '2024-02-06 22:09:14', updatedAt: '2025-10-14 21:34:18' },
  { id: 315, name: 'migoTestMX', country: 'MX', counter: 982, onPlatform: true, isEnabled: true, createdAt: '2024-02-13 14:05:13', updatedAt: '2025-10-06 21:27:23' },
  { id: 316, name: 'migoTestCR', country: 'CR', counter: 2061, onPlatform: true, isEnabled: true, createdAt: '2024-02-15 20:57:49', updatedAt: '2025-10-06 21:27:23' },
  { id: 317, name: 'cyber-test', country: 'GT', counter: 856, onPlatform: true, isEnabled: true, createdAt: '2024-02-16 04:12:52', updatedAt: '2025-12-08 23:50:30' },
  { id: 318, name: 'migoSB', country: 'MX', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-02-19 18:26:00', updatedAt: '2024-02-19 18:26:00' },
  { id: 319, name: 'mcdGTnew', country: 'GT', counter: 341, onPlatform: true, isEnabled: true, createdAt: '2024-02-22 17:50:58', updatedAt: '2024-04-02 20:44:18' },
  { id: 320, name: 'farolitoAltata', country: 'MX', counter: 10, onPlatform: true, isEnabled: true, createdAt: '2024-02-22 17:53:12', updatedAt: '2024-02-23 17:26:41' },
  { id: 321, name: 'burgerKingGT012', country: 'GT', counter: 11, onPlatform: true, isEnabled: true, createdAt: '2024-02-23 21:49:46', updatedAt: '2024-11-18 16:39:25' },
  { id: 322, name: 'bamDemoGT', country: 'GT', counter: 22, onPlatform: true, isEnabled: true, createdAt: '2024-03-08 16:46:42', updatedAt: '2025-07-31 16:13:40' },
  { id: 323, name: 'burgerKingGT050', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-03-12 21:08:05', updatedAt: '2024-03-12 21:08:05' },
  { id: 324, name: 'demosYalu', country: 'GT', counter: 61, onPlatform: true, isEnabled: true, createdAt: '2024-03-14 21:40:19', updatedAt: '2025-03-10 21:52:22' },
  { id: 325, name: 'mondelezMX', country: 'MX', counter: 505, onPlatform: true, isEnabled: true, createdAt: '2024-03-15 11:03:41', updatedAt: '2024-10-07 14:10:02' },
  { id: 327, name: 'molinosModernosGT', country: 'GT', counter: 17, onPlatform: true, isEnabled: true, createdAt: '2024-04-05 01:01:06', updatedAt: '2024-04-25 19:05:53' },
  { id: 328, name: 'sanMartin-yumpii', country: 'GT', counter: 12, onPlatform: true, isEnabled: true, createdAt: '2024-04-08 15:55:16', updatedAt: '2024-04-18 01:13:17' },
  { id: 329, name: 'nestleCreditMX', country: 'MX', counter: 0, onPlatform: true, isEnabled: true, createdAt: '2024-04-09 06:36:23', updatedAt: '2024-04-09 06:36:45' },
  { id: 331, name: 'casaDeTonoMX', country: 'MX', counter: 570, onPlatform: true, isEnabled: true, createdAt: '2024-05-10 15:10:17', updatedAt: '2026-01-23 21:22:08' },
  { id: 332, name: 'demosYaluGT', country: 'GT', counter: 120, onPlatform: true, isEnabled: true, createdAt: '2024-05-10 21:32:39', updatedAt: '2026-02-11 17:19:37' },
  { id: 333, name: 'mongeCR', country: 'CR', counter: 62, onPlatform: true, isEnabled: true, createdAt: '2024-05-16 20:58:46', updatedAt: '2026-01-15 23:03:14' },
  { id: 334, name: 'casaDeTonoPreAuthMX', country: 'MX', counter: 463, onPlatform: true, isEnabled: true, createdAt: '2024-05-23 20:42:27', updatedAt: '2025-07-18 21:30:20' },
  { id: 335, name: 'tributaxGT-yumpii', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-06-04 22:15:25', updatedAt: '2024-06-04 22:15:25' },
  { id: 336, name: 'camperoGTwithout3DS', country: 'GT', counter: 79, onPlatform: true, isEnabled: true, createdAt: '2024-06-18 22:07:43', updatedAt: '2024-09-04 01:04:04' },
  { id: 337, name: 'uxTrainingDos', country: 'GT', counter: 15, onPlatform: true, isEnabled: true, createdAt: '2024-07-11 17:12:08', updatedAt: '2024-07-25 22:20:10' },
  { id: 338, name: 'burgerKingGT061', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-07-18 16:23:57', updatedAt: '2024-07-18 16:23:57' },
  { id: 339, name: 'cbcCapulloAppGT', country: 'GT', counter: 652, onPlatform: true, isEnabled: true, createdAt: '2024-07-19 17:11:52', updatedAt: '2025-08-08 21:08:25' },
  { id: 340, name: 'migoCypress', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2024-07-22 18:15:09', updatedAt: '2024-12-20 18:13:12' },
  { id: 341, name: 'burgerKingGT030', country: 'GT', counter: 6, onPlatform: true, isEnabled: true, createdAt: '2024-07-25 16:12:46', updatedAt: '2024-08-08 11:10:58' },
  { id: 342, name: 'fifcoTest', country: 'GT', counter: 26, onPlatform: true, isEnabled: true, createdAt: '2024-07-26 21:31:41', updatedAt: '2024-10-07 15:03:29' },
  { id: 344, name: 'elektra-bot-gt', country: 'GT', counter: 43, onPlatform: true, isEnabled: true, createdAt: '2024-08-06 22:53:45', updatedAt: '2025-07-31 16:53:18' },
  { id: 345, name: 'burgerKingGTDemo', country: 'GT', counter: 18, onPlatform: true, isEnabled: true, createdAt: '2024-08-08 17:54:16', updatedAt: '2024-12-12 19:50:03' },
  { id: 346, name: 'burgerKingGT041', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-08-12 16:54:00', updatedAt: '2024-08-12 16:54:00' },
  { id: 347, name: 'burgerKingGT054', country: 'GT', counter: 6, onPlatform: true, isEnabled: true, createdAt: '2024-08-12 16:56:38', updatedAt: '2024-08-13 15:32:16' },
  { id: 348, name: 'burgerKingGT009', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2024-08-12 17:34:42', updatedAt: '2024-08-12 18:26:40' },
  { id: 349, name: 'demosYalu-coolBox-PE', country: 'GT', counter: 62, onPlatform: true, isEnabled: true, createdAt: '2024-08-13 15:27:25', updatedAt: '2024-11-19 21:11:50' },
  { id: 350, name: 'burgerKingGT029', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-08-13 15:35:08', updatedAt: '2024-08-13 15:35:08' },
  { id: 351, name: 'demosYalu-Ecuasuiza', country: 'GT', counter: 14, onPlatform: true, isEnabled: true, createdAt: '2024-08-22 14:43:10', updatedAt: '2024-11-28 17:03:41' },
  { id: 352, name: 'demosYalu-zoomiesCR', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2024-08-28 16:02:14', updatedAt: '2024-08-28 17:44:25' },
  { id: 353, name: 'demosYalu-zoomiesCR', country: 'CR', counter: 22, onPlatform: true, isEnabled: true, createdAt: '2024-08-28 17:57:40', updatedAt: '2024-09-30 19:12:07' },
  { id: 354, name: 'cbcCapulloAppGT-test', country: 'GT', counter: 13, onPlatform: true, isEnabled: true, createdAt: '2024-09-05 18:54:19', updatedAt: '2024-09-05 19:41:19' },
  { id: 355, name: 'vahCbc', country: 'GT', counter: 19, onPlatform: true, isEnabled: true, createdAt: '2024-09-05 19:39:40', updatedAt: '2024-09-05 20:22:00' },
  { id: 356, name: 'coppel-3dsMX', country: 'MX', counter: 14, onPlatform: true, isEnabled: true, createdAt: '2024-09-06 13:55:57', updatedAt: '2024-12-06 17:27:32' },
  { id: 357, name: 'cwCOApple', country: 'CO', counter: 367, onPlatform: true, isEnabled: true, createdAt: '2024-09-06 19:17:26', updatedAt: '2025-10-30 21:14:06' },
  { id: 358, name: 'lcdtPreAuthLiebeMX', country: 'MX', counter: 27, onPlatform: true, isEnabled: true, createdAt: '2024-09-13 19:46:22', updatedAt: '2025-11-12 18:43:55' },
  { id: 359, name: 'lcdtPreAuthAncaMX', country: 'MX', counter: 442, onPlatform: true, isEnabled: true, createdAt: '2024-09-17 21:11:47', updatedAt: '2026-01-28 21:08:32' },
  { id: 360, name: 'lcdtAncaMX', country: 'MX', counter: 245, onPlatform: true, isEnabled: true, createdAt: '2024-09-17 23:03:13', updatedAt: '2026-02-13 13:08:19' },
  { id: 361, name: 'lcdtLiebeMX', country: 'MX', counter: 21, onPlatform: true, isEnabled: true, createdAt: '2024-09-24 22:15:15', updatedAt: '2025-11-11 21:26:03' },
  { id: 362, name: 'laLicoGT', country: 'GT', counter: 105, onPlatform: true, isEnabled: true, createdAt: '2024-09-25 16:51:19', updatedAt: '2025-08-07 15:09:04' },
  { id: 363, name: 'cbcCapulloTarjetaGT', country: 'GT', counter: 420, onPlatform: true, isEnabled: true, createdAt: '2024-10-15 20:55:11', updatedAt: '2025-08-14 17:33:01' },
  { id: 364, name: '7a4fd7b2b485', country: 'MX', counter: 31, onPlatform: true, isEnabled: true, createdAt: '2024-12-06 17:27:39', updatedAt: '2025-01-31 17:37:22' },
  { id: 365, name: 'ihlenGT', country: 'GT', counter: 8, onPlatform: true, isEnabled: true, createdAt: '2024-12-18 23:53:52', updatedAt: '2024-12-19 00:16:17' },
  { id: 366, name: 'burgerKingGT005', country: 'GT', counter: 7, onPlatform: true, isEnabled: true, createdAt: '2025-01-07 20:28:21', updatedAt: '2025-01-07 21:14:12' },
  { id: 367, name: 'cmiTestingGT', country: 'GT', counter: 648, onPlatform: true, isEnabled: true, createdAt: '2025-01-22 21:17:13', updatedAt: '2026-02-05 17:51:26' },
  { id: 368, name: 'migoQA', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-01-24 20:09:53', updatedAt: '2025-01-24 20:09:53' },
  { id: 369, name: 'wa2deskGT', country: 'GT', counter: 98, onPlatform: true, isEnabled: true, createdAt: '2025-01-29 22:03:35', updatedAt: '2026-01-27 22:13:03' },
  { id: 370, name: 'crediTiendaGT', country: 'GT', counter: 764, onPlatform: true, isEnabled: true, createdAt: '2025-02-05 21:14:45', updatedAt: '2025-08-18 15:00:47' },
  { id: 371, name: 'temuGT', country: 'GT', counter: 18, onPlatform: true, isEnabled: true, createdAt: '2025-02-11 22:32:27', updatedAt: '2025-07-14 21:11:44' },
  { id: 372, name: 'cyber-test2', country: 'GT', counter: 34, onPlatform: true, isEnabled: true, createdAt: '2025-02-13 22:47:04', updatedAt: '2025-09-30 23:31:24' },
  { id: 373, name: 'cyber-test3', country: 'GT', counter: 25, onPlatform: true, isEnabled: true, createdAt: '2025-02-13 22:49:00', updatedAt: '2025-10-01 00:12:16' },
  { id: 374, name: 'apinosChickenGT', country: 'GT', counter: 506, onPlatform: true, isEnabled: true, createdAt: '2025-02-26 04:28:23', updatedAt: '2026-02-12 10:50:51' },
  { id: 375, name: 'donPolloSV', country: 'SV', counter: 8, onPlatform: true, isEnabled: true, createdAt: '2025-02-26 05:13:57', updatedAt: '2025-03-25 19:12:17' },
  { id: 376, name: 'migoPostmanFlows', country: 'CR', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-02-27 22:04:26', updatedAt: '2025-02-27 22:04:26' },
  { id: 377, name: 'crediTiendaGT2', country: 'GT', counter: 0, onPlatform: true, isEnabled: true, createdAt: '2025-03-07 20:53:18', updatedAt: '2025-03-07 20:53:18' },
  { id: 378, name: 'papaJohnsCRPreProd', country: 'CR', counter: 25, onPlatform: true, isEnabled: true, createdAt: '2025-03-07 21:37:22', updatedAt: '2025-07-31 15:51:12' },
  { id: 379, name: '7a4fd7b2b486', country: 'GT', counter: 21, onPlatform: true, isEnabled: true, createdAt: '2025-03-10 18:11:41', updatedAt: '2025-03-25 14:05:06' },
  { id: 380, name: '7a4fd7b2b488', country: 'GT', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2025-03-11 16:27:45', updatedAt: '2025-03-11 18:41:38' },
  { id: 381, name: '7a4fd7b2b487', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2025-03-11 18:06:20', updatedAt: '2025-03-11 19:20:38' },
  { id: 382, name: '7a4fd7b2b489', country: 'GT', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2025-03-11 19:32:43', updatedAt: '2025-03-11 21:37:14' },
  { id: 383, name: '7a4fd7b2b490', country: 'GT', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2025-03-11 22:26:55', updatedAt: '2025-03-24 18:39:29' },
  { id: 384, name: '7a4fd7b2b491', country: 'GT', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2025-03-11 22:32:00', updatedAt: '2025-03-11 23:21:38' },
  { id: 385, name: '7a4fd7b2b492', country: 'GT', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2025-03-11 23:28:47', updatedAt: '2025-03-14 22:52:33' },
  { id: 386, name: 'burpeeGT', country: 'GT', counter: 23, onPlatform: true, isEnabled: true, createdAt: '2025-03-28 23:03:34', updatedAt: '2025-07-24 23:55:07' },
  { id: 387, name: 'grupoSadiGT', country: 'GT', counter: 78, onPlatform: true, isEnabled: true, createdAt: '2025-04-09 23:49:12', updatedAt: '2025-09-25 21:47:09' },
  { id: 388, name: 'cbcb2bSV', country: 'SV', counter: 189, onPlatform: true, isEnabled: true, createdAt: '2025-04-24 00:55:04', updatedAt: '2025-09-03 20:34:37' },
  { id: 389, name: 'theVitaminShoppeGT', country: 'GT', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2025-04-25 22:56:28', updatedAt: '2025-04-26 01:05:56' },
  { id: 390, name: 'panitoGT', country: 'GT', counter: 139, onPlatform: true, isEnabled: true, createdAt: '2025-04-30 18:24:18', updatedAt: '2025-08-18 22:56:34' },
  { id: 391, name: 'subscriptionTest', country: 'GT', counter: 10464, onPlatform: true, isEnabled: true, createdAt: '2025-05-09 18:04:30', updatedAt: '2026-02-15 20:08:27' },
  { id: 392, name: 'genesisGT', country: 'GT', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2025-05-20 18:34:28', updatedAt: '2025-05-20 19:09:04' },
  { id: 393, name: 'yummiiGT', country: 'MXN', counter: 28, onPlatform: true, isEnabled: true, createdAt: '2025-05-28 23:05:43', updatedAt: '2025-06-09 23:42:22' },
  { id: 394, name: 'demGT', country: 'GT', counter: 14, onPlatform: true, isEnabled: true, createdAt: '2025-05-30 17:01:17', updatedAt: '2025-07-31 16:14:32' },
  { id: 395, name: 'prodPolancoGT', country: 'GT', counter: 43, onPlatform: true, isEnabled: true, createdAt: '2025-06-05 02:50:16', updatedAt: '2025-09-24 22:55:25' },
  { id: 396, name: 'hipGT', country: 'GT', counter: 18, onPlatform: true, isEnabled: true, createdAt: '2025-06-05 17:36:36', updatedAt: '2025-09-30 23:04:20' },
  { id: 397, name: 'yummiiGT', country: 'GTQ', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2025-06-09 23:58:24', updatedAt: '2025-06-10 00:08:37' },
  { id: 398, name: 'migoTestBI', country: 'GT', counter: 52, onPlatform: true, isEnabled: true, createdAt: '2025-06-11 15:09:26', updatedAt: '2026-02-12 09:01:40' },
  { id: 399, name: 'yummiiGT', country: 'MX', counter: 79, onPlatform: true, isEnabled: true, createdAt: '2025-06-14 00:37:09', updatedAt: '2025-08-13 23:32:58' },
  { id: 400, name: 'camperoGT.V2', country: 'GT', counter: 19, onPlatform: true, isEnabled: true, createdAt: '2025-06-17 12:47:18', updatedAt: '2026-02-05 15:28:32' },
  { id: 401, name: 'tillsterTestingGT', country: 'GT', counter: 32, onPlatform: true, isEnabled: true, createdAt: '2025-06-23 17:02:01', updatedAt: '2025-07-25 18:24:43' },
  { id: 402, name: 'escoge2GT', country: 'GT', counter: 1147, onPlatform: true, isEnabled: true, createdAt: '2025-06-25 16:59:35', updatedAt: '2025-12-03 21:54:07' },
  { id: 403, name: 'luormelGT', country: 'GT', counter: 17, onPlatform: true, isEnabled: true, createdAt: '2025-07-01 19:36:21', updatedAt: '2025-07-01 21:59:39' },
  { id: 404, name: 'elCatadorPT', country: 'PT', counter: 49, onPlatform: true, isEnabled: true, createdAt: '2025-07-03 21:07:54', updatedAt: '2025-07-14 17:22:33' },
  { id: 405, name: 'cbcb2bSV', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-07-04 18:34:50', updatedAt: '2025-07-04 18:34:50' },
  { id: 406, name: 'benevitaGT', country: 'GT', counter: 60, onPlatform: true, isEnabled: true, createdAt: '2025-07-08 15:31:21', updatedAt: '2025-10-15 14:53:29' },
  { id: 407, name: 'test-serfinsa3ds', country: 'SV', counter: 273, onPlatform: true, isEnabled: true, createdAt: '2025-07-08 20:18:12', updatedAt: '2026-02-13 19:56:16' },
  { id: 408, name: 'PayfacGTExe', country: 'GT', counter: 13, onPlatform: true, isEnabled: true, createdAt: '2025-07-09 22:15:07', updatedAt: '2025-08-06 22:09:47' },
  { id: 409, name: 'PayfacGTGeneral', country: 'GT', counter: 73, onPlatform: true, isEnabled: true, createdAt: '2025-07-09 22:27:44', updatedAt: '2026-01-23 21:33:21' },
  { id: 410, name: 'PayfacGTPC', country: 'GT', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2025-07-09 22:33:14', updatedAt: '2025-07-10 18:16:35' },
  { id: 411, name: 'elCatadorDO', country: 'PT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-07-14 17:50:01', updatedAt: '2025-07-14 17:50:01' },
  { id: 412, name: 'brisasjgGT', country: 'GT', counter: 142, onPlatform: true, isEnabled: true, createdAt: '2025-07-14 23:22:51', updatedAt: '2026-02-12 21:46:16' },
  { id: 413, name: 'aliGT', country: 'GT', counter: 989, onPlatform: true, isEnabled: true, createdAt: '2025-07-17 20:41:26', updatedAt: '2026-02-13 19:37:33' },
  { id: 414, name: 'cbcb2bHN', country: 'HN', counter: 152, onPlatform: true, isEnabled: true, createdAt: '2025-07-25 21:24:35', updatedAt: '2025-09-17 14:33:43' },
  { id: 415, name: 'migoTestBIUSD', country: 'GT', counter: 7, onPlatform: true, isEnabled: true, createdAt: '2025-07-30 17:58:55', updatedAt: '2025-07-30 18:17:55' },
  { id: 416, name: 'migoTestPeru', country: 'PE', counter: 66, onPlatform: true, isEnabled: true, createdAt: '2025-07-31 14:07:33', updatedAt: '2025-08-19 22:55:53' },
  { id: 417, name: 'cbcb2bHN', country: 'HND', counter: 20, onPlatform: true, isEnabled: true, createdAt: '2025-07-31 14:21:09', updatedAt: '2025-08-04 14:05:49' },
  { id: 418, name: 'batangaGT', country: 'GT', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2025-08-08 00:15:08', updatedAt: '2025-08-08 00:21:54' },
  { id: 419, name: 'batangaCR', country: 'CR', counter: 168, onPlatform: true, isEnabled: true, createdAt: '2025-08-08 15:02:42', updatedAt: '2025-09-25 16:33:53' },
  { id: 420, name: 'migoTestPeru', country: 'PEE', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-08-12 09:39:26', updatedAt: '2025-08-12 09:39:26' },
  { id: 421, name: 'elektraTest', country: 'GT', counter: 24, onPlatform: true, isEnabled: true, createdAt: '2025-08-19 22:26:34', updatedAt: '2025-10-13 21:56:00' },
  { id: 422, name: 'migoGT', country: 'GT', counter: 117, onPlatform: true, isEnabled: true, createdAt: '2025-08-20 02:13:53', updatedAt: '2026-02-12 05:38:58' },
  { id: 423, name: 'granjeroCR', country: 'CR', counter: 421, onPlatform: true, isEnabled: true, createdAt: '2025-08-26 22:17:53', updatedAt: '2025-12-08 20:43:38' },
  { id: 424, name: 'migoTestEmpty', country: 'GT', counter: 3, onPlatform: true, isEnabled: true, createdAt: '2025-08-28 18:26:07', updatedAt: '2025-08-28 20:16:33' },
  { id: 425, name: 'yummiiGT', country: 'CR', counter: 7, onPlatform: true, isEnabled: true, createdAt: '2025-08-28 18:53:19', updatedAt: '2025-08-28 19:15:46' },
  { id: 426, name: 'PayfacCR', country: 'CR', counter: 5, onPlatform: true, isEnabled: true, createdAt: '2025-09-08 15:43:05', updatedAt: '2025-09-12 19:53:39' },
  { id: 427, name: 'saltntasteGT', country: 'GT', counter: 4, onPlatform: true, isEnabled: true, createdAt: '2025-09-09 18:28:16', updatedAt: '2025-10-14 14:03:06' },
  { id: 428, name: 'gourlmetGT', country: 'GT', counter: 16, onPlatform: true, isEnabled: true, createdAt: '2025-09-09 18:59:04', updatedAt: '2026-02-03 01:23:54' },
  { id: 429, name: 'PayfacCuotasGT', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-09-11 14:54:57', updatedAt: '2025-09-11 14:54:57' },
  { id: 430, name: 'brisasSubscriptionTest', country: 'GT', counter: 6, onPlatform: true, isEnabled: true, createdAt: '2025-09-23 22:34:29', updatedAt: '2026-01-13 23:58:41' },
  { id: 431, name: 'skipCVVTest', country: 'GT', counter: 15, onPlatform: true, isEnabled: true, createdAt: '2025-09-26 23:35:55', updatedAt: '2025-09-27 02:36:37' },
  { id: 432, name: 'yummiiF', country: 'GT', counter: 62, onPlatform: true, isEnabled: true, createdAt: '2025-10-15 15:01:31', updatedAt: '2026-02-04 03:39:46' },
  { id: 433, name: 'elEsfuerzoGT', country: 'GT', counter: 64, onPlatform: true, isEnabled: true, createdAt: '2025-10-28 15:13:27', updatedAt: '2026-02-10 21:50:15' },
  { id: 434, name: 'asalGT', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-10-30 01:14:09', updatedAt: '2025-10-30 01:14:09' },
  { id: 435, name: 'polloBrujoGT', country: 'GT', counter: 113, onPlatform: true, isEnabled: true, createdAt: '2025-10-30 16:56:12', updatedAt: '2026-02-13 23:06:03' },
  { id: 436, name: 'mokaGT', country: 'GT', counter: 35, onPlatform: true, isEnabled: true, createdAt: '2025-11-04 23:30:54', updatedAt: '2026-01-12 14:21:00' },
  { id: 437, name: 'settlementTest', country: 'GT', counter: 0, onPlatform: true, isEnabled: true, createdAt: '2025-11-06 23:50:07', updatedAt: '2025-11-06 23:50:07' },
  { id: 438, name: 'lcdtGrMX', country: 'MX', counter: 7, onPlatform: true, isEnabled: true, createdAt: '2025-11-10 18:24:32', updatedAt: '2025-11-10 20:26:33' },
  { id: 439, name: 'spexaiGT', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-11-11 23:41:13', updatedAt: '2025-11-11 23:41:13' },
  { id: 440, name: 'sanMartinSV', country: 'SV', counter: 12, onPlatform: true, isEnabled: true, createdAt: '2025-11-18 17:48:36', updatedAt: '2026-01-21 02:21:02' },
  { id: 441, name: 'sanMartinTestGT', country: 'GT', counter: 16, onPlatform: true, isEnabled: true, createdAt: '2025-11-26 17:05:29', updatedAt: '2026-02-13 17:10:39' },
  { id: 442, name: 'rapifrenoGT', country: 'GT', counter: 7, onPlatform: true, isEnabled: true, createdAt: '2025-12-09 15:53:24', updatedAt: '2025-12-09 18:22:55' },
  { id: 443, name: '4onGT', country: 'GT', counter: 1, onPlatform: true, isEnabled: true, createdAt: '2025-12-22 20:12:01', updatedAt: '2025-12-22 20:12:01' },
  { id: 444, name: 'elCatadorDO', country: 'DO', counter: 9, onPlatform: true, isEnabled: true, createdAt: '2026-01-13 00:04:51', updatedAt: '2026-02-13 13:20:25' },
  { id: 445, name: 'sugoiGT', country: 'GT', counter: 28, onPlatform: true, isEnabled: true, createdAt: '2026-01-22 16:14:47', updatedAt: '2026-02-13 19:57:19' },
  { id: 446, name: 'subscriptionTest', country: 'CR', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2026-01-28 16:16:02', updatedAt: '2026-01-28 16:22:21' },
  { id: 447, name: 'test-serfinsaTds', country: 'SV', counter: 2, onPlatform: true, isEnabled: true, createdAt: '2026-02-06 02:17:14', updatedAt: '2026-02-06 02:20:13' },
  { id: 448, name: 'stereoPubCR', country: 'CR', counter: 17, onPlatform: true, isEnabled: true, createdAt: '2026-02-10 17:14:22', updatedAt: '2026-02-12 01:03:14' },
];

// ─── TX_DATA (from transacciones_agregadas.json) ─────────────────────────────

export const TX_DATA: Record<string, MerchantTxStats> = {
  '11': { total_transactions: 2, successful: 0, failed: 2, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '12': { total_transactions: 11, successful: 1, failed: 10, success_rate: 9.1, total_usd: 1.3, avg_ticket_usd: 1.3, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '14': { total_transactions: 124, successful: 25, failed: 99, success_rate: 20.2, total_usd: 412.37, avg_ticket_usd: 16.49, last_transaction: null, days_since_last_tx: 999, channels: ['app', 'web', 'wa'], payment_types: [] },
  '18': { total_transactions: 1147, successful: 258, failed: 889, success_rate: 22.5, total_usd: 16187.73, avg_ticket_usd: 62.74, last_transaction: '2026-01-08', days_since_last_tx: 38, channels: ['app', 'web', 'wa'], payment_types: [] },
  '27': { total_transactions: 145, successful: 10, failed: 135, success_rate: 6.9, total_usd: 177.32, avg_ticket_usd: 17.73, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '28': { total_transactions: 35, successful: 4, failed: 31, success_rate: 11.4, total_usd: 4.66, avg_ticket_usd: 1.17, last_transaction: null, days_since_last_tx: 999, channels: ['app', 'web', 'wa'], payment_types: [] },
  '31': { total_transactions: 576, successful: 71, failed: 505, success_rate: 12.3, total_usd: 589.83, avg_ticket_usd: 8.31, last_transaction: null, days_since_last_tx: 999, channels: ['app', 'wa'], payment_types: [] },
  '40': { total_transactions: 18, successful: 6, failed: 12, success_rate: 33.3, total_usd: 85.98, avg_ticket_usd: 14.33, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '41': { total_transactions: 1753, successful: 498, failed: 1255, success_rate: 28.4, total_usd: 7261.4, avg_ticket_usd: 14.58, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa', 'app'], payment_types: [] },
  '42': { total_transactions: 3, successful: 1, failed: 2, success_rate: 33.3, total_usd: 0.13, avg_ticket_usd: 0.13, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '43': { total_transactions: 4, successful: 0, failed: 4, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '50': { total_transactions: 663, successful: 163, failed: 500, success_rate: 24.6, total_usd: 5951.07, avg_ticket_usd: 36.51, last_transaction: '2026-02-05', days_since_last_tx: 11, channels: ['app', 'web', 'platform', 'wa'], payment_types: [] },
  '51': { total_transactions: 22, successful: 6, failed: 16, success_rate: 27.3, total_usd: 121.7, avg_ticket_usd: 20.28, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '70': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '74': { total_transactions: 11, successful: 0, failed: 11, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: '2026-02-05', days_since_last_tx: 11, channels: ['web'], payment_types: [] },
  '77': { total_transactions: 1925, successful: 245, failed: 1680, success_rate: 12.7, total_usd: 2788.9, avg_ticket_usd: 11.38, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '85': { total_transactions: 258, successful: 73, failed: 185, success_rate: 28.3, total_usd: 745.48, avg_ticket_usd: 10.21, last_transaction: '2026-02-04', days_since_last_tx: 12, channels: ['app', 'web', 'wa'], payment_types: [] },
  '88': { total_transactions: 5, successful: 0, failed: 5, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '254': { total_transactions: 43, successful: 21, failed: 22, success_rate: 48.8, total_usd: 16.17, avg_ticket_usd: 0.77, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '256': { total_transactions: 169, successful: 4, failed: 165, success_rate: 2.4, total_usd: 80.9, avg_ticket_usd: 20.22, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '258': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '269': { total_transactions: 2, successful: 0, failed: 2, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '270': { total_transactions: 74, successful: 22, failed: 52, success_rate: 29.7, total_usd: 2488.95, avg_ticket_usd: 113.13, last_transaction: '2025-10-30', days_since_last_tx: 109, channels: ['web', 'wa'], payment_types: [] },
  '271': { total_transactions: 3, successful: 0, failed: 3, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '272': { total_transactions: 1, successful: 1, failed: 0, success_rate: 100, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['platform'], payment_types: [] },
  '275': { total_transactions: 3, successful: 1, failed: 2, success_rate: 33.3, total_usd: 0.13, avg_ticket_usd: 0.13, last_transaction: null, days_since_last_tx: 999, channels: ['platform'], payment_types: [] },
  '284': { total_transactions: 3, successful: 1, failed: 2, success_rate: 33.3, total_usd: 6.52, avg_ticket_usd: 6.52, last_transaction: '2025-11-06', days_since_last_tx: 102, channels: ['wa'], payment_types: [] },
  '285': { total_transactions: 4, successful: 3, failed: 1, success_rate: 75, total_usd: 300, avg_ticket_usd: 100, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '298': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '300': { total_transactions: 148, successful: 43, failed: 105, success_rate: 29.1, total_usd: 314.02, avg_ticket_usd: 7.3, last_transaction: '2025-10-11', days_since_last_tx: 127, channels: ['wa'], payment_types: [] },
  '301': { total_transactions: 296, successful: 59, failed: 237, success_rate: 19.9, total_usd: 7324.91, avg_ticket_usd: 124.15, last_transaction: '2026-01-15', days_since_last_tx: 32, channels: ['platform', 'wa'], payment_types: [] },
  '307': { total_transactions: 44, successful: 14, failed: 30, success_rate: 31.8, total_usd: 428.43, avg_ticket_usd: 30.6, last_transaction: '2025-10-14', days_since_last_tx: 125, channels: ['wa'], payment_types: [] },
  '314': { total_transactions: 3, successful: 0, failed: 3, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '315': { total_transactions: 25, successful: 9, failed: 16, success_rate: 36, total_usd: 19.29, avg_ticket_usd: 2.14, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'platform', 'wa'], payment_types: [] },
  '317': { total_transactions: 75, successful: 41, failed: 34, success_rate: 54.7, total_usd: 566.22, avg_ticket_usd: 13.81, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '331': { total_transactions: 12, successful: 3, failed: 9, success_rate: 25, total_usd: 16.96, avg_ticket_usd: 5.65, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa', 'app'], payment_types: [] },
  '332': { total_transactions: 13, successful: 1, failed: 12, success_rate: 7.7, total_usd: 18242.51, avg_ticket_usd: 18242.51, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '333': { total_transactions: 38, successful: 17, failed: 21, success_rate: 44.7, total_usd: 2119.99, avg_ticket_usd: 124.71, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '339': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '357': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '358': { total_transactions: 7, successful: 0, failed: 7, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '359': { total_transactions: 252, successful: 6, failed: 246, success_rate: 2.4, total_usd: 97.92, avg_ticket_usd: 16.32, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '360': { total_transactions: 120, successful: 37, failed: 83, success_rate: 30.8, total_usd: 253.75, avg_ticket_usd: 6.86, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '361': { total_transactions: 14, successful: 0, failed: 14, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '362': { total_transactions: 17, successful: 5, failed: 12, success_rate: 29.4, total_usd: 130.49, avg_ticket_usd: 26.1, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '363': { total_transactions: 9, successful: 6, failed: 3, success_rate: 66.7, total_usd: 583.61, avg_ticket_usd: 97.27, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '367': { total_transactions: 215, successful: 18, failed: 197, success_rate: 8.4, total_usd: 1543.06, avg_ticket_usd: 85.73, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '369': { total_transactions: 11, successful: 4, failed: 7, success_rate: 36.4, total_usd: 3300.97, avg_ticket_usd: 825.24, last_transaction: null, days_since_last_tx: 999, channels: ['platform', 'wa'], payment_types: [] },
  '370': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '372': { total_transactions: 12, successful: 12, failed: 0, success_rate: 100, total_usd: 2456.74, avg_ticket_usd: 204.73, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '373': { total_transactions: 9, successful: 8, failed: 1, success_rate: 88.9, total_usd: 495.78, avg_ticket_usd: 61.97, last_transaction: '2025-09-29', days_since_last_tx: 139, channels: ['wa'], payment_types: [] },
  '374': { total_transactions: 53, successful: 1, failed: 52, success_rate: 1.9, total_usd: 0.13, avg_ticket_usd: 0.13, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '387': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '388': { total_transactions: 42, successful: 4, failed: 38, success_rate: 9.5, total_usd: 1844, avg_ticket_usd: 461, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '390': { total_transactions: 2, successful: 0, failed: 2, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '391': { total_transactions: 9847, successful: 6342, failed: 3505, success_rate: 64.4, total_usd: 1934159.65, avg_ticket_usd: 304.98, last_transaction: '2026-02-12', days_since_last_tx: 4, channels: ['app', 'web', 'wa'], payment_types: [] },
  '395': { total_transactions: 33, successful: 16, failed: 17, success_rate: 48.5, total_usd: 604.66, avg_ticket_usd: 37.79, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '396': { total_transactions: 12, successful: 2, failed: 10, success_rate: 16.7, total_usd: 109, avg_ticket_usd: 54.5, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '398': { total_transactions: 12, successful: 1, failed: 11, success_rate: 8.3, total_usd: 6.53, avg_ticket_usd: 6.53, last_transaction: '2025-12-19', days_since_last_tx: 59, channels: ['wa', 'app'], payment_types: [] },
  '399': { total_transactions: 27, successful: 0, failed: 27, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '400': { total_transactions: 3, successful: 0, failed: 3, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '402': { total_transactions: 1054, successful: 239, failed: 815, success_rate: 22.7, total_usd: 4521.61, avg_ticket_usd: 18.92, last_transaction: '2025-11-09', days_since_last_tx: 99, channels: ['web', 'platform', 'wa'], payment_types: [] },
  '406': { total_transactions: 44, successful: 25, failed: 19, success_rate: 56.8, total_usd: 1914.51, avg_ticket_usd: 76.58, last_transaction: '2025-09-30', days_since_last_tx: 138, channels: ['web'], payment_types: [] },
  '407': { total_transactions: 258, successful: 82, failed: 176, success_rate: 31.8, total_usd: 2694, avg_ticket_usd: 32.85, last_transaction: '2026-01-29', days_since_last_tx: 18, channels: ['app', 'web', 'wa'], payment_types: [] },
  '408': { total_transactions: 2, successful: 0, failed: 2, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: '2025-08-06', days_since_last_tx: 193, channels: [], payment_types: [] },
  '409': { total_transactions: 71, successful: 22, failed: 49, success_rate: 31, total_usd: 5.22, avg_ticket_usd: 0.24, last_transaction: '2026-01-23', days_since_last_tx: 24, channels: ['app', 'web', 'wa'], payment_types: [] },
  '412': { total_transactions: 139, successful: 69, failed: 70, success_rate: 49.6, total_usd: 15359.25, avg_ticket_usd: 222.6, last_transaction: '2025-10-03', days_since_last_tx: 136, channels: ['web', 'wa'], payment_types: [] },
  '413': { total_transactions: 905, successful: 462, failed: 443, success_rate: 51, total_usd: 1317.41, avg_ticket_usd: 2.85, last_transaction: '2026-02-13', days_since_last_tx: 3, channels: ['app', 'wa'], payment_types: ['wallet'] },
  '414': { total_transactions: 129, successful: 34, failed: 95, success_rate: 26.4, total_usd: 1776.43, avg_ticket_usd: 52.25, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '416': { total_transactions: 51, successful: 17, failed: 34, success_rate: 33.3, total_usd: 14.3, avg_ticket_usd: 0.84, last_transaction: '2025-08-18', days_since_last_tx: 182, channels: [], payment_types: [] },
  '417': { total_transactions: 14, successful: 6, failed: 8, success_rate: 42.9, total_usd: 4.57, avg_ticket_usd: 0.76, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '418': { total_transactions: 4, successful: 0, failed: 4, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '419': { total_transactions: 168, successful: 95, failed: 73, success_rate: 56.5, total_usd: 1357.36, avg_ticket_usd: 14.29, last_transaction: '2025-08-20', days_since_last_tx: 179, channels: ['wa'], payment_types: [] },
  '420': { total_transactions: 1, successful: 1, failed: 0, success_rate: 100, total_usd: 0.85, avg_ticket_usd: 0.85, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '421': { total_transactions: 24, successful: 6, failed: 18, success_rate: 25, total_usd: 78.28, avg_ticket_usd: 13.05, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '422': { total_transactions: 117, successful: 6, failed: 111, success_rate: 5.1, total_usd: 37.78, avg_ticket_usd: 6.3, last_transaction: null, days_since_last_tx: 999, channels: ['app', 'web', 'wa'], payment_types: [] },
  '423': { total_transactions: 421, successful: 202, failed: 219, success_rate: 48, total_usd: 4892.82, avg_ticket_usd: 24.22, last_transaction: null, days_since_last_tx: 999, channels: ['web', 'wa'], payment_types: [] },
  '424': { total_transactions: 3, successful: 0, failed: 3, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['web'], payment_types: [] },
  '425': { total_transactions: 7, successful: 1, failed: 6, success_rate: 14.3, total_usd: 0.01, avg_ticket_usd: 0.01, last_transaction: '2025-08-28', days_since_last_tx: 172, channels: [], payment_types: [] },
  '426': { total_transactions: 5, successful: 2, failed: 3, success_rate: 40, total_usd: 0.59, avg_ticket_usd: 0.3, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '427': { total_transactions: 4, successful: 1, failed: 3, success_rate: 25, total_usd: 0.13, avg_ticket_usd: 0.13, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '428': { total_transactions: 16, successful: 1, failed: 15, success_rate: 6.2, total_usd: 0.13, avg_ticket_usd: 0.13, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '429': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '430': { total_transactions: 6, successful: 5, failed: 1, success_rate: 83.3, total_usd: 223.69, avg_ticket_usd: 44.74, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '431': { total_transactions: 15, successful: 4, failed: 11, success_rate: 26.7, total_usd: 0.52, avg_ticket_usd: 0.13, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '432': { total_transactions: 62, successful: 30, failed: 32, success_rate: 48.4, total_usd: 7867.12, avg_ticket_usd: 262.24, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '433': { total_transactions: 64, successful: 26, failed: 38, success_rate: 40.6, total_usd: 121.93, avg_ticket_usd: 4.69, last_transaction: null, days_since_last_tx: 999, channels: ['app', 'wa'], payment_types: [] },
  '434': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['web'], payment_types: [] },
  '435': { total_transactions: 113, successful: 51, failed: 62, success_rate: 45.1, total_usd: 352.35, avg_ticket_usd: 6.91, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '436': { total_transactions: 35, successful: 23, failed: 12, success_rate: 65.7, total_usd: 488.75, avg_ticket_usd: 21.25, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '438': { total_transactions: 7, successful: 0, failed: 7, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '439': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '440': { total_transactions: 12, successful: 6, failed: 6, success_rate: 50, total_usd: 122.6, avg_ticket_usd: 20.43, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '441': { total_transactions: 16, successful: 3, failed: 13, success_rate: 18.8, total_usd: 61.11, avg_ticket_usd: 20.37, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '442': { total_transactions: 7, successful: 6, failed: 1, success_rate: 85.7, total_usd: 1762.65, avg_ticket_usd: 293.77, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '443': { total_transactions: 1, successful: 0, failed: 1, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['web'], payment_types: [] },
  '444': { total_transactions: 9, successful: 6, failed: 3, success_rate: 66.7, total_usd: 32.72, avg_ticket_usd: 5.45, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '445': { total_transactions: 28, successful: 2, failed: 26, success_rate: 7.1, total_usd: 13.13, avg_ticket_usd: 6.56, last_transaction: null, days_since_last_tx: 999, channels: ['wa'], payment_types: [] },
  '446': { total_transactions: 2, successful: 0, failed: 2, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
  '447': { total_transactions: 2, successful: 0, failed: 2, success_rate: 0, total_usd: 0, avg_ticket_usd: 0, last_transaction: null, days_since_last_tx: 999, channels: ['web'], payment_types: [] },
  '448': { total_transactions: 17, successful: 13, failed: 4, success_rate: 76.5, total_usd: 96.05, avg_ticket_usd: 7.39, last_transaction: null, days_since_last_tx: 999, channels: [], payment_types: [] },
};

// ─── getMerchantHealth ───────────────────────────────────────────────────────

export function getMerchantHealth(clientId: number): MerchantHealth {
  const client = CLIENTS_DATA.find((c) => c.id === clientId);
  const tx = TX_DATA[String(clientId)];

  const reasons: string[] = [];
  let score = 100;

  const counter = client?.counter ?? 0;
  const successRate = tx?.success_rate ?? 0;
  const daysSinceLast = tx?.days_since_last_tx ?? 999;

  // Critical checks
  if (counter === 0) {
    reasons.push('Sin transacciones registradas (counter = 0)');
    score -= 50;
  }
  if (daysSinceLast > 90) {
    reasons.push(`Inactivo por ${daysSinceLast} días (>90)`);
    score -= 30;
  }
  if (tx && successRate < 30) {
    reasons.push(`Tasa de éxito muy baja: ${successRate}% (<30%)`);
    score -= 30;
  }

  // Risk checks
  if (daysSinceLast > 30 && daysSinceLast <= 90) {
    reasons.push(`${daysSinceLast} días sin transacciones (>30)`);
    score -= 15;
  }
  if (tx && successRate >= 30 && successRate < 70) {
    reasons.push(`Tasa de éxito moderada: ${successRate}% (<70%)`);
    score -= 15;
  }

  // No tx data at all
  if (!tx) {
    reasons.push('Sin datos de transacciones en el período');
    score -= 20;
  }

  score = Math.max(0, Math.min(100, score));

  // Determine level
  const isCritical =
    daysSinceLast > 90 || (tx != null && successRate < 30) || counter === 0;
  const isRisk =
    (daysSinceLast > 30 && daysSinceLast <= 90) ||
    (tx != null && successRate >= 30 && successRate < 70);

  let level: HealthLevel;
  if (isCritical) {
    level = 'critical';
  } else if (isRisk) {
    level = 'risk';
  } else {
    level = 'healthy';
    if (reasons.length === 0) {
      reasons.push('Merchant saludable');
    }
  }

  return { score, level, reasons };
}
