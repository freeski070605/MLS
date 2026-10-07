import { db } from './db';
export const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
export const brand = { name: 'MahLovely Studio', tagline: 'Your Hair. Your Skin. Your Crown.', description: 'Hair artistry and esthetic care, together in one studio.' };
export async function setting<T>(key: string, fallback: T): Promise<T> {
  try { const row = await db.siteSetting.findUnique({ where: { key } }); return row ? row.value as T : fallback; } catch { return fallback; }
}
export async function content(key: string, fallback: string) {
  try { const row = await db.contentBlock.findUnique({ where: { key } }); return row?.status === 'PUBLISHED' && row.body ? row.body : fallback; } catch { return fallback; }
}
export function money(cents?: number | null) { return cents == null ? 'Price varies' : new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(cents / 100); }
export function priceLabel(s: { priceType: string; priceMin: number | null; priceMax: number | null }) {
  if (s.priceType === 'CONSULTATION') return 'Consultation required';
  if (s.priceType === 'VARIES' || s.priceMin == null) return 'Price varies';
  if (s.priceType === 'STARTING') return `Starting at ${money(s.priceMin)}`;
  if (s.priceType === 'RANGE') return `${money(s.priceMin)}–${money(s.priceMax)}`;
  return money(s.priceMin);
}
