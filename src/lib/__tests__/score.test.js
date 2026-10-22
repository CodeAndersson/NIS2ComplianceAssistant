import { describe, it, expect } from 'vitest';
import { beraknaScore, totalMognad, prioriteradeLuckor } from '../score.js';
import { OMRADEN } from '../../data/omraden.js';

const omraden = [
  { id: 1, kategori: 'policy', fragor: [{ id: 'a1' }, { id: 'a2' }] },
  { id: 2, kategori: 'teknik', fragor: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }, { id: 'b4' }] },
];

describe('beraknaScore', () => {
  it('ger 0 % och låg nivå när inget är besvarat', () => {
    const [a, b] = beraknaScore({}, omraden);
    expect(a).toMatchObject({ procent: 0, niva: 'lag', besvarade: 0, totalt: 2 });
    expect(b).toMatchObject({ procent: 0, niva: 'lag', besvarade: 0, totalt: 4 });
  });

  it('ger 1 poäng för ja, 0,5 för delvis och 0 för nej', () => {
    const [a, b] = beraknaScore({ a1: 'ja', a2: 'delvis', b1: 'nej', b2: 'ja' }, omraden);
    expect(a.procent).toBe(75);
    expect(b.procent).toBe(25);
    expect(b.besvarade).toBe(2);
  });

  it('sätter nivå efter gränserna 80 % och 40 %', () => {
    expect(beraknaScore({ b1: 'ja', b2: 'ja', b3: 'ja', b4: 'delvis' }, omraden)[1].niva).toBe('hog'); // 87,5 %
    expect(beraknaScore({ a1: 'ja', a2: 'ja' }, omraden)[0].niva).toBe('hog');                        // 100 %
    expect(beraknaScore({ a1: 'ja', a2: 'nej' }, omraden)[0].niva).toBe('medel');                      // 50 %
    expect(beraknaScore({ b1: 'ja', b2: 'delvis' }, omraden)[1].niva).toBe('lag');                     // 37,5 %
  });

  it('täcker alla tio säkerhetsåtgärdsområden i lagen som standard', () => {
    expect(beraknaScore({})).toHaveLength(10);
    expect(OMRADEN.every(o => o.fragor.length > 0)).toBe(true);
  });
});

describe('totalMognad', () => {
  it('är medelvärdet av områdenas mognad', () => {
    expect(totalMognad(beraknaScore({ a1: 'ja', a2: 'ja' }, omraden))).toBe(50);
  });

  it('ger 0 för en tom lista', () => {
    expect(totalMognad([])).toBe(0);
  });
});

describe('prioriteradeLuckor', () => {
  it('tar bara med besvarade områden under hög nivå, största luckan först', () => {
    const resultat = beraknaScore({ a1: 'ja', a2: 'nej', b1: 'nej' }, omraden);
    expect(prioriteradeLuckor(resultat).map(r => r.id)).toEqual([2, 1]);
  });

  it('utesluter områden med hög mognad och obesvarade områden', () => {
    const resultat = beraknaScore({ a1: 'ja', a2: 'ja' }, omraden);
    expect(prioriteradeLuckor(resultat)).toEqual([]);
  });
});
