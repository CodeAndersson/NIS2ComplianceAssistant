// Sparar bedömningen lokalt i webbläsaren. Ingen data skickas till någon server.

export const LAGRINGSNYCKEL = 'nis2-assistant:v1';

const GILTIGA_VYER = ['intro', 'wizard', 'gap', 'resultat'];

export const TOMT_TILLSTAND = {
  vy: 'intro',
  omfattning: { sektor: null, anstallda: null, omsattning: null },
  svar: {},
};

function arObjekt(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Läser sparat tillstånd. Returnerar tomt tillstånd om inget finns eller datan är ogiltig. */
export function laddaTillstand(storage) {
  try {
    const radata = storage?.getItem(LAGRINGSNYCKEL);
    if (!radata) return TOMT_TILLSTAND;
    const data = JSON.parse(radata);
    if (!arObjekt(data) || !arObjekt(data.omfattning) || !arObjekt(data.svar)) return TOMT_TILLSTAND;
    return {
      vy: GILTIGA_VYER.includes(data.vy) ? data.vy : 'intro',
      omfattning: { ...TOMT_TILLSTAND.omfattning, ...data.omfattning },
      svar: data.svar,
    };
  } catch {
    return TOMT_TILLSTAND;
  }
}

/** Sparar tillståndet. Misslyckas tyst (t.ex. i privat läge eller när lagringen är full). */
export function sparaTillstand(storage, tillstand) {
  try {
    storage?.setItem(LAGRINGSNYCKEL, JSON.stringify(tillstand));
  } catch {
    // Lagring är en bekvämlighet — appen fungerar även utan den.
  }
}

export function rensaTillstand(storage) {
  try {
    storage?.removeItem(LAGRINGSNYCKEL);
  } catch {
    // ignoreras
  }
}
