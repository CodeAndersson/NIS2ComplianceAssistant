import { describe, it, expect } from 'vitest';
import { laddaTillstand, sparaTillstand, rensaTillstand, LAGRINGSNYCKEL, TOMT_TILLSTAND, type Lagring } from '../lagring';
import type { Tillstand } from '../../types';

function minnesLagring(initial: Record<string, string> = {}): Lagring {
  const data: Record<string, string> = { ...initial };
  return {
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => { data[k] = String(v); },
    removeItem: (k: string) => { delete data[k]; },
  };
}

describe('lagring', () => {
  it('sparar och läser tillbaka en bedömning', () => {
    const storage = minnesLagring();
    const tillstand: Tillstand = { vy: 'gap', omfattning: { sektor: 'Energi', anstallda: '250+', omsattning: '50+' }, svar: { '1.1': 'ja' }, delningsId: null };
    sparaTillstand(storage, tillstand);
    expect(laddaTillstand(storage)).toEqual(tillstand);
  });

  it('ger tomt tillstånd när inget är sparat', () => {
    expect(laddaTillstand(minnesLagring())).toEqual(TOMT_TILLSTAND);
  });

  it('ger tomt tillstånd för trasig eller felaktig data', () => {
    expect(laddaTillstand(minnesLagring({ [LAGRINGSNYCKEL]: '{inte json' }))).toEqual(TOMT_TILLSTAND);
    expect(laddaTillstand(minnesLagring({ [LAGRINGSNYCKEL]: '[]' }))).toEqual(TOMT_TILLSTAND);
  });

  it('faller tillbaka till startvyn för okänd vy', () => {
    const storage = minnesLagring({ [LAGRINGSNYCKEL]: JSON.stringify({ vy: 'hackad', omfattning: {}, svar: {}, delningsId: 42 }) });
    expect(laddaTillstand(storage).vy).toBe('intro');
    expect(laddaTillstand(storage).delningsId).toBeNull();
  });

  it('kraschar inte när lagringen inte är tillgänglig', () => {
    const trasig: Lagring = { getItem: () => { throw new Error('blockerad'); }, setItem: () => { throw new Error('full'); }, removeItem: () => { throw new Error(); } };
    expect(laddaTillstand(trasig)).toEqual(TOMT_TILLSTAND);
    expect(() => sparaTillstand(trasig, TOMT_TILLSTAND)).not.toThrow();
    expect(() => rensaTillstand(trasig)).not.toThrow();
    expect(laddaTillstand(undefined)).toEqual(TOMT_TILLSTAND);
  });

  it('rensar sparad bedömning', () => {
    const storage = minnesLagring();
    sparaTillstand(storage, { ...TOMT_TILLSTAND, vy: 'gap' });
    rensaTillstand(storage);
    expect(laddaTillstand(storage)).toEqual(TOMT_TILLSTAND);
  });
});
