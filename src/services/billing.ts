import type { InvoiceItem } from '../types';

/** Renvoie le prochain numéro séquentiel PREFIX-YYYY-NNNN pour l'année donnée. */
export function nextSequentialNumber(
  prefix: string,
  existing: string[],
  year: number = new Date().getFullYear(),
): string {
  const head = `${prefix}-${year}-`;
  let max = 0;
  for (const code of existing) {
    if (!code || !code.startsWith(head)) continue;
    const n = parseInt(code.slice(head.length), 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `${head}${String(max + 1).padStart(4, '0')}`;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function computeInvoiceTotals(
  items: InvoiceItem[],
  tvaRate: number,
): { totalHt: number; tvaAmount: number; totalTtc: number } {
  const totalHt = round2(
    (items || []).reduce(
      (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.unitPriceHt) || 0),
      0,
    ),
  );
  const tvaAmount = round2((totalHt * (Number(tvaRate) || 0)) / 100);
  const totalTtc = round2(totalHt + tvaAmount);
  return { totalHt, tvaAmount, totalTtc };
}

/** Formate une dioptrie avec signe explicite (+1.25, -0.50) ; vide si null. */
export function formatDiopter(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}`;
}

/** Sphère de vision de près = sphère VL + addition ; null si sphère absente. */
export function computeNear(
  sphere: number | null | undefined,
  addition: number | null | undefined,
): number | null {
  if (sphere === null || sphere === undefined || Number.isNaN(sphere)) return null;
  return round2(sphere + (Number(addition) || 0));
}

export function formatMad(v: number): string {
  return `${(Number(v) || 0).toFixed(2)} MAD`;
}
