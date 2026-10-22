import { SEKTORER_BILAGA_1 } from '../data/sektorer.js';

/**
 * Preliminär bedömning av om en verksamhet omfattas av cybersäkerhetslagen
 * och i så fall som väsentlig eller viktig verksamhetsutövare.
 */
export function bedomOmfattning({ sektor, anstallda, omsattning }) {
  if (!sektor || sektor === 'ingen') {
    return { status: 'ej-omfattad', kategori: null,
      forklaring: 'Verksamheten tillhör ingen av sektorerna i bilaga 1 eller 2 till NIS2-direktivet.' };
  }
  const stort = anstallda === '250+' || omsattning === '50+';
  if (anstallda === 'under-50' && omsattning === 'under-10') {
    return { status: 'ej-omfattad', kategori: null,
      forklaring: 'Verksamheten ligger under tröskelvärdena (minst 50 anställda eller 10 MEUR omsättning). Notera att vissa kritiska verksamheter omfattas oavsett storlek — kontrollera MCFFS 2026:1.' };
  }
  const arBilaga1 = SEKTORER_BILAGA_1.includes(sektor);
  if (arBilaga1 && stort) {
    return { status: 'omfattad', kategori: 'vasentlig',
      forklaring: 'Stor verksamhet inom en sektor med hög kritikalitet (bilaga 1). Klassificeras som väsentlig verksamhetsutövare.' };
  }
  return { status: 'omfattad', kategori: 'viktig',
    forklaring: arBilaga1
      ? 'Medelstor verksamhet inom en sektor med hög kritikalitet (bilaga 1). Klassificeras som viktig verksamhetsutövare.'
      : 'Verksamhet inom en annan kritisk sektor (bilaga 2). Klassificeras som viktig verksamhetsutövare.' };
}
