import { OMRADEN } from '../data/omraden.js';

export const SVARSTYP = { JA: 'ja', DELVIS: 'delvis', NEJ: 'nej' };
export const SVARSPOANG = { ja: 1, delvis: 0.5, nej: 0 };

/** Mognad i procent per säkerhetsåtgärdsområde. Obesvarade frågor räknas som 0. */
export function beraknaScore(svar, omraden = OMRADEN) {
  return omraden.map(omrade => {
    const max = omrade.fragor.length;
    const summa = omrade.fragor.reduce((s, f) => s + (SVARSPOANG[svar[f.id]] ?? 0), 0);
    const procent = max > 0 ? (summa / max) * 100 : 0;
    const niva = procent >= 80 ? 'hog' : procent >= 40 ? 'medel' : 'lag';
    const besvarade = omrade.fragor.filter(f => svar[f.id]).length;
    return { ...omrade, procent, niva, besvarade, totalt: max };
  });
}

/** Genomsnittlig mognad över alla områden. */
export function totalMognad(resultat) {
  if (resultat.length === 0) return 0;
  return resultat.reduce((s, r) => s + r.procent, 0) / resultat.length;
}

/** Besvarade områden som inte når hög mognad, sorterade med störst lucka först. */
export function prioriteradeLuckor(resultat) {
  return resultat
    .filter(r => r.niva !== 'hog' && r.besvarade > 0)
    .sort((a, b) => a.procent - b.procent);
}
