import { describe, it, expect } from 'vitest';
import { laddaTillstand, sparaTillstand, rensaTillstand, LAGRINGSNYCKEL, TOMT_TILLSTAND } from '../lagring.js';

function minnesLagring(initial = {}) {
  const data = { ...initial };
  return {
    getItem: k => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: k => { delete data[k]; },
  };
}

describe('lagring', () => {
  it('sparar och läser tillbaka en bedömning', () => {
    const storage = minnesLagring();
    const tillstand = { vy: 'gap', omfattning: { sektor: 'Energi', anstallda: '250+', omsattning: '50+' }, svar: { '1.1': 'ja' } };
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
    const storage = minnesLagring({ [LAGRINGSNYCKEL]: JSON.stringify({ vy: 'hackad', omfattning: {}, svar: {} }) });
    expect(laddaTillstand(storage).vy).toBe('intro');
  });

  it('kraschar inte när lagringen inte är tillgänglig', () => {
    const trasig = { getItem: () => { throw new Error('blockerad'); }, setItem: () => { throw new Error('full'); }, removeItem: () => { throw new Error(); } };
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
