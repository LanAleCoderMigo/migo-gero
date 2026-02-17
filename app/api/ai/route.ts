import { GoogleGenAI } from '@google/genai';
import { CLIENTS_DATA, TX_DATA, getMerchantHealth } from '@/lib/data/merchants';

export const runtime = 'nodejs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  type: 'chat' | 'brief';
  merchantId?: string;
  message?: string;
  history?: Message[];
}

// ─── Portfolio summary (computed once at module level) ────────────────────────

function buildPortfolioSummary(): string {
  const totalMerchants = CLIENTS_DATA.length;
  const countries = [...new Set(CLIENTS_DATA.map((c) => c.country))];

  const txClientIds = Object.keys(TX_DATA);
  let totalTx = 0;
  let totalSuccessful = 0;
  let totalUsd = 0;
  let activeLast30 = 0;
  let criticalCount = 0;
  let riskCount = 0;
  let healthyCount = 0;

  for (const id of txClientIds) {
    const tx = TX_DATA[id];
    totalTx += tx.total_transactions;
    totalSuccessful += tx.successful;
    totalUsd += tx.total_usd;
    if (tx.days_since_last_tx <= 30) activeLast30++;
  }

  for (const client of CLIENTS_DATA) {
    const h = getMerchantHealth(client.id);
    if (h.level === 'critical') criticalCount++;
    else if (h.level === 'risk') riskCount++;
    else healthyCount++;
  }

  const avgSuccessRate =
    totalTx > 0 ? ((totalSuccessful / totalTx) * 100).toFixed(1) : '0';

  return [
    `Portafolio: ${totalMerchants} merchants en ${countries.length} países (${countries.join(', ')}).`,
    `Transacciones totales (período): ${totalTx.toLocaleString()} | Exitosas: ${totalSuccessful.toLocaleString()} | Tasa promedio: ${avgSuccessRate}%`,
    `Volumen total: $${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`,
    `Merchants activos (últimos 30d): ${activeLast30} de ${txClientIds.length} con datos de tx`,
    `Salud: ${healthyCount} healthy, ${riskCount} en riesgo, ${criticalCount} críticos`,
  ].join('\n');
}

const PORTFOLIO_SUMMARY = buildPortfolioSummary();

// ─── Merchant context builder ────────────────────────────────────────────────

function buildMerchantContext(merchantId: string): string {
  const client = CLIENTS_DATA.find((c) => c.id === Number(merchantId));
  const tx = TX_DATA[merchantId];
  const health = getMerchantHealth(Number(merchantId));

  if (!client) return `No se encontró el merchant con ID ${merchantId}.`;

  const lines = [
    `## Merchant: ${client.name} (ID: ${client.id})`,
    `País: ${client.country} | Counter: ${client.counter.toLocaleString()} | En plataforma: ${client.onPlatform ? 'Sí' : 'No'}`,
    `Creado: ${client.createdAt} | Última actualización: ${client.updatedAt}`,
  ];

  if (tx) {
    lines.push(
      '',
      '### Transacciones (período analizado)',
      `Total: ${tx.total_transactions.toLocaleString()} | Exitosas: ${tx.successful.toLocaleString()} | Fallidas: ${tx.failed.toLocaleString()}`,
      `Tasa de éxito: ${tx.success_rate}%`,
      `Volumen total: $${tx.total_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD | Ticket promedio: $${tx.avg_ticket_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`,
      `Última transacción: ${tx.last_transaction ?? 'N/A'} | Días desde última tx: ${tx.days_since_last_tx}`,
      `Canales: ${tx.channels.length > 0 ? tx.channels.join(', ') : 'N/A'}`,
      `Tipos de pago: ${tx.payment_types.length > 0 ? tx.payment_types.join(', ') : 'N/A'}`,
    );
  } else {
    lines.push('', 'Sin datos de transacciones en el período analizado.');
  }

  lines.push(
    '',
    '### Salud del merchant',
    `Score: ${health.score}/100 | Nivel: ${health.level.toUpperCase()}`,
    `Razones: ${health.reasons.join('; ')}`,
  );

  return lines.join('\n');
}

// ─── System prompts ──────────────────────────────────────────────────────────

function getChatSystemPrompt(): string {
  return `Eres Migo-Assistant, analista de inteligencia comercial de Migo Payments.
Tienes acceso al portafolio de ${CLIENTS_DATA.length} merchants en Guatemala, México y Centroamérica.
Responde en español, de forma concisa y ejecutiva.

Contexto del portafolio:
${PORTFOLIO_SUMMARY}

Reglas:
- Usa datos concretos cuando respondas sobre merchants específicos.
- Si no tienes datos de transacciones para un merchant, indícalo.
- Formatea números con separadores y símbolos de moneda.
- Sé directo y orientado a acción en tus recomendaciones.`;
}

function getBriefSystemPrompt(): string {
  return `Eres Migo-Assistant, analista de inteligencia comercial de Migo Payments.
Genera resúmenes ejecutivos concisos en español para el equipo de operaciones.

Reglas:
- Máximo 150 palabras.
- Estructura: situación actual, métricas clave, evaluación de riesgo, recomendación.
- Usa bullets para claridad.
- Incluye números específicos del merchant.
- Termina con una recomendación accionable.`;
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'GEMINI_API_KEY no configurada' },
      { status: 500 },
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { type, merchantId, message, history } = body;

  if (type !== 'chat' && type !== 'brief') {
    return Response.json(
      { error: 'type debe ser "chat" o "brief"' },
      { status: 400 },
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // ── Build prompt and history ────────────────────────────────────────────

  let systemPrompt: string;
  const contents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];

  if (type === 'brief') {
    if (!merchantId) {
      return Response.json(
        { error: 'merchantId requerido para type "brief"' },
        { status: 400 },
      );
    }

    systemPrompt = getBriefSystemPrompt();
    const context = buildMerchantContext(merchantId);
    contents.push({
      role: 'user',
      parts: [{ text: `Genera un brief ejecutivo de máximo 150 palabras para este merchant:\n\n${context}` }],
    });
  } else {
    systemPrompt = getChatSystemPrompt();

    // Inject merchant context if provided
    if (merchantId) {
      const context = buildMerchantContext(merchantId);
      systemPrompt += `\n\nMerchant en contexto:\n${context}`;
    }

    // Append conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Append current user message
    if (message) {
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    if (contents.length === 0) {
      return Response.json(
        { error: 'Se requiere message o history para type "chat"' },
        { status: 400 },
      );
    }
  }

  // ── Stream response ───────────────────────────────────────────────────

  try {
    const stream = ai.models.generateContentStream({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 1024,
      },
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of await stream) {
            const text = chunk.text ?? '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(encoder.encode(`\n⚠️ Error: ${msg}`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al conectar con Gemini';
    return Response.json({ error: msg }, { status: 502 });
  }
}
