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

// ---- Montant en toutes lettres (français) ----
const UNITS_FR = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf',
];

function below100Fr(n: number): string {
  if (n < 20) return UNITS_FR[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (t === 7 || t === 9) {
    const base = t === 7 ? 'soixante' : 'quatre-vingt';
    if (t === 7 && u === 1) return 'soixante et onze';
    return `${base}-${UNITS_FR[10 + u]}`;
  }
  const tensWord = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', '', 'quatre-vingt', ''][t];
  if (u === 0) return t === 8 ? 'quatre-vingts' : tensWord;
  if (u === 1 && t >= 2 && t <= 6) return `${tensWord} et un`;
  return `${tensWord}-${UNITS_FR[u]}`;
}

function below1000Fr(n: number): string {
  if (n < 100) return below100Fr(n);
  const h = Math.floor(n / 100);
  const rem = n % 100;
  let s = h === 1 ? 'cent' : `${UNITS_FR[h]} cent`;
  if (rem === 0) return h > 1 ? `${s}s` : s;
  return `${s} ${below100Fr(rem)}`;
}

/** Convertit un entier (0..999 999 999) en toutes lettres (français). */
export function integerToFrenchWords(n: number): string {
  if (n === 0) return 'zéro';
  let rest = Math.floor(Math.abs(n));
  const milliards = Math.floor(rest / 1_000_000_000); rest %= 1_000_000_000;
  const millions = Math.floor(rest / 1_000_000); rest %= 1_000_000;
  const milliers = Math.floor(rest / 1000); rest %= 1000;
  const unites = rest;
  const out: string[] = [];
  if (milliards) out.push(`${below1000Fr(milliards)} milliard${milliards > 1 ? 's' : ''}`);
  if (millions) out.push(`${below1000Fr(millions)} million${millions > 1 ? 's' : ''}`);
  if (milliers) out.push(milliers === 1 ? 'mille' : `${below1000Fr(milliers)} mille`);
  if (unites) out.push(below1000Fr(unites));
  return out.join(' ');
}

/** Montant MAD en toutes lettres, "MAD" en fin (+ centimes si besoin), 1re lettre capitale. */
export function amountToFrenchMad(amount: number): string {
  const rounded = Math.round((Number(amount) || 0) * 100) / 100;
  const intPart = Math.floor(rounded);
  const cents = Math.round((rounded - intPart) * 100);
  let s = `${integerToFrenchWords(intPart)} MAD`;
  if (cents > 0) s += ` et ${integerToFrenchWords(cents)} centime${cents > 1 ? 's' : ''}`;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
