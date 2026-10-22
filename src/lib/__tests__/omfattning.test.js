import { describe, it, expect } from 'vitest';
import { bedomOmfattning } from '../omfattning.js';

describe('bedomOmfattning', () => {
  it('ger ej omfattad när ingen sektor är vald', () => {
    expect(bedomOmfattning({ sektor: null, anstallda: '250+', omsattning: '50+' }).status).toBe('ej-omfattad');
    expect(bedomOmfattning({ sektor: 'ingen', anstallda: '250+', omsattning: '50+' }).status).toBe('ej-omfattad');
  });

  it('ger ej omfattad för små verksamheter under båda tröskelvärdena', () => {
    const r = bedomOmfattning({ sektor: 'Energi', anstallda: 'under-50', omsattning: 'under-10' });
    expect(r.status).toBe('ej-omfattad');
    expect(r.kategori).toBeNull();
  });

  it('klassar stor verksamhet i bilaga 1 som väsentlig', () => {
    expect(bedomOmfattning({ sektor: 'Energi', anstallda: '250+', omsattning: '10-50' }).kategori).toBe('vasentlig');
    expect(bedomOmfattning({ sektor: 'Transport', anstallda: '50-249', omsattning: '50+' }).kategori).toBe('vasentlig');
  });

  it('klassar medelstor verksamhet i bilaga 1 som viktig', () => {
    const r = bedomOmfattning({ sektor: 'Energi', anstallda: '50-249', omsattning: '10-50' });
    expect(r).toMatchObject({ status: 'omfattad', kategori: 'viktig' });
  });

  it('klassar verksamhet i bilaga 2 som viktig oavsett storlek', () => {
    expect(bedomOmfattning({ sektor: 'Tillverkning', anstallda: '250+', omsattning: '50+' }).kategori).toBe('viktig');
    expect(bedomOmfattning({ sektor: 'Forskning', anstallda: '50-249', omsattning: 'under-10' }).kategori).toBe('viktig');
  });

  it('räcker att ett av tröskelvärdena överskrids för att omfattas', () => {
    expect(bedomOmfattning({ sektor: 'Energi', anstallda: 'under-50', omsattning: '10-50' }).status).toBe('omfattad');
    expect(bedomOmfattning({ sektor: 'Energi', anstallda: '50-249', omsattning: 'under-10' }).status).toBe('omfattad');
  });
});
