// Sparar bedömningen lokalt i webbläsaren. Ingen data skickas till någon server.

import type { Tillstand, Vy } from '../types';

export const LAGRINGSNYCKEL = 'nis2-assistant:v1';

/** Den del av Storage-API:t som används — gör det enkelt att testa med en fejkad lagring. */
export type Lagring = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const GILTIGA_VYER: readonly Vy[] = ['intro', 'wizard', 'gap', 'resultat'];

export const TOMT_TILLSTAND: Tillstand = {
  vy: 'intro',
  omfattning: { sektor: null, anstallda: null, omsattning: null },
  svar: {},
};

function arObjekt(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Läser sparat tillstånd. Returnerar tomt tillstånd om inget finns eller datan är ogiltig. */
export function laddaTillstand(storage: Lagring | undefined): Tillstand {
  try {
    const radata = storage?.getItem(LAGRINGSNYCKEL);
    if (!radata) return TOMT_TILLSTAND;
    const data = JSON.parse(radata);
    if (!arObjekt(data) || !arObjekt(data.omfattning) || !arObjekt(data.svar)) return TOMT_TILLSTAND;
    return {
      vy: GILTIGA_VYER.includes(data.vy as Vy) ? (data.vy as Vy) : 'intro',
      omfattning: { ...TOMT_TILLSTAND.omfattning, ...data.omfattning },
      svar: data.svar as Tillstand['svar'],
    };
  } catch {
    return TOMT_TILLSTAND;
  }
}

/** Sparar tillståndet. Misslyckas tyst (t.ex. i privat läge eller när lagringen är full). */
export function sparaTillstand(storage: Lagring | undefined, tillstand: Tillstand): void {
  try {
    storage?.setItem(LAGRINGSNYCKEL, JSON.stringify(tillstand));
  } catch {
    // Lagring är en bekvämlighet — appen fungerar även utan den.
  }
}

export function rensaTillstand(storage: Lagring | undefined): void {
  try {
    storage?.removeItem(LAGRINGSNYCKEL);
  } catch {
    // ignoreras
  }
}
